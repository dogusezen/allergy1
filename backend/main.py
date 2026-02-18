from __future__ import annotations

import os
import re
import json
import sqlite3
from datetime import datetime, timezone
from typing import Any, Dict, Optional, List

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


import hashlib

# ---------------------------
# HTML parsing helpers (S-kaupat / K-Ruoka / Pikatukku)
# ---------------------------

def sha256(s: str) -> str:
    return hashlib.sha256((s or "").encode("utf-8")).hexdigest()

def extract_after_heading(html: str, heading: str) -> str:
    """
    Works well for S-kaupat accessibility HTML:
      ### Ainesosat
      <text>
    """
    if not html:
        return ""
    pat = re.compile(rf"###\s+{re.escape(heading)}\s*\n\s*\n(.*?)(?:\n###|\n##|\Z)", re.S)
    m = pat.search(html)
    if not m:
        return ""
    return m.group(1).strip().replace("\n", " ").strip()

def extract_h1(html: str) -> str:
    m = re.search(r"#\s+([^\n]+)", html)
    return (m.group(1).strip() if m else "")

def extract_ean_from_url(url: str) -> str:
    m = re.search(r"/(\d{13})\b", url)
    if m:
        return m.group(1)
    m = re.search(r"(\d{13})", url)
    return m.group(1) if m else ""

def extract_pikatukku_id(url: str) -> str:
    # p/8095568
    m = re.search(r"/p/(\d+)", url)
    return m.group(1) if m else ""

async def fetch_text(url: str, timeout: int = 30) -> str:
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=True, headers={
        "User-Agent": os.getenv("USER_AGENT", "Mozilla/5.0 (compatible; AllergySync/1.0)"),
        "Accept-Language": "fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }) as client:
        r = await client.get(url)
        r.raise_for_status()
        return r.text

def build_content_hash(p: dict) -> str:
    blob = "\n".join([
        (p.get("product_code") or ""),
        (p.get("ean") or ""),
        (p.get("name") or ""),
        (p.get("brand") or ""),
        (p.get("category_path") or ""),
        (p.get("ingredients_text") or ""),
        (p.get("additives_text") or ""),
        (p.get("allergens_text") or ""),
        (p.get("nutrition_json") or ""),
    ])
    return sha256(blob)

async def parse_s_kaupat(url: str) -> dict:
    html = await fetch_text(url)
    name = extract_h1(html)
    ingredients = extract_after_heading(html, "Ainesosat")
    allergens = extract_after_heading(html, "Allergeenit")
    ean = extract_after_heading(html, "EAN") or extract_ean_from_url(url)
    nutrition_block = extract_after_heading(html, "Ravintosisältö")
    nutrition_json = json.dumps({"raw": nutrition_block}, ensure_ascii=False) if nutrition_block else ""
    return {
        "source": "s-kaupat",
        "source_id": ean or extract_ean_from_url(url) or url,
        "product_code": "",
        "ean": ean or extract_ean_from_url(url),
        "name": name,
        "brand": "",
        "category_path": "",
        "ingredients_text": ingredients,
        "additives_text": "",
        "allergens_text": allergens,
        "nutrition_json": nutrition_json,
        "source_updated_at": "",
    }

async def parse_k_ruoka(url: str) -> dict:
    html = await fetch_text(url)
    name = extract_h1(html)
    ean = extract_ean_from_url(url)
    ingredients = extract_after_heading(html, "Ainesosat")
    allergens = extract_after_heading(html, "Allergeenit")
    return {
        "source": "k-ruoka",
        "source_id": ean or url,
        "product_code": "",
        "ean": ean,
        "name": name,
        "brand": "",
        "category_path": "",
        "ingredients_text": ingredients,
        "additives_text": "",
        "allergens_text": allergens,
        "nutrition_json": "",
        "source_updated_at": "",
    }

async def parse_pikatukku(url: str) -> dict:
    html = await fetch_text(url)
    name = extract_h1(html)
    if not name:
        m = re.search(r"<title>(.*?)</title>", html, re.I|re.S)
        name = re.sub(r"\s+", " ", (m.group(1) if m else "")).strip()
    pid = extract_pikatukku_id(url) or url
    ingredients = extract_after_heading(html, "Ainesosat")
    allergens = extract_after_heading(html, "Allergeenit")
    if not ingredients:
        m = re.search(r'property="og:description"\s+content="([^"]+)"', html, re.I)
        if m:
            desc = m.group(1)
            if "," in desc and len(desc) > 20:
                ingredients = desc.strip()
    if not allergens:
        m2 = re.search(r"(SAATTAA SISÄLTÄÄ[^<\\n]+)", html, re.I)
        if m2:
            allergens = m2.group(1).strip()
    return {
        "source": "pikatukku",
        "source_id": pid,
        "product_code": pid,
        "ean": "",
        "name": name,
        "brand": "",
        "category_path": "",
        "ingredients_text": ingredients,
        "additives_text": "",
        "allergens_text": allergens,
        "nutrition_json": "",
        "source_updated_at": "",
    }

async def parse_product_url(url: str) -> dict:
    u = url.lower()
    if "s-kaupat.fi/tuote/" in u:
        return await parse_s_kaupat(url)
    if "k-ruoka.fi" in u:
        return await parse_k_ruoka(url)
    if "pikatukku.valioaimo.fi" in u:
        return await parse_pikatukku(url)
    raise ValueError("Unsupported URL source")

DB_PATH = os.getenv("DB_PATH", "data/products.sqlite")

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

SCHEMA_SQL = """
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_product_id TEXT UNIQUE,
  product_code TEXT,
  ean TEXT,
  name TEXT,
  brand TEXT,
  category_path TEXT,
  ingredients_text TEXT,
  additives_text TEXT,
  allergens_text TEXT,
  nutrition_json TEXT,
  source_updated_at TEXT,
  content_hash TEXT,
  last_seen_at TEXT
);

CREATE TABLE IF NOT EXISTS product_changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_product_id TEXT,
  changed_at TEXT,
  field TEXT,
  old_value TEXT,
  new_value TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_last_seen ON products(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_changes_product ON product_changes(source_product_id, changed_at);
"""

def db() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.executescript(SCHEMA_SQL)
    con.commit()
    return con

app = FastAPI(title="Allergy Catalog Backend", version="1.0.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GeminiRequest(BaseModel):
    prompt: str = Field(..., min_length=1)

TRACK_FIELDS = ["product_code", "ean", "name", "brand", "category_path", "ingredients_text", "additives_text", "allergens_text", "nutrition_json", "source_updated_at", "content_hash"]

class GeminiResponse(BaseModel):
    text: Optional[str] = None

@app.get("/health")
def health():
    return {"ok": True, "time": now_iso()}

@app.post("/api/gemini", response_model=GeminiResponse)
async def gemini_proxy(req: GeminiRequest):
    """
    Secure Gemini proxy (key stays on backend).
    Uses Google Generative Language REST endpoint.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set on backend")

    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-preview-09-2025").strip()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    params = {"key": api_key}

    payload = {
        "contents": [{"parts": [{"text": req.prompt}]}]
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(url, params=params, json=payload)
            if r.status_code >= 400:
                raise HTTPException(status_code=502, detail=f"Gemini API error: {r.status_code} {r.text}")
            data = r.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini call failed: {e}")

    text = None
    try:
        text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text")
    except Exception:
        text = None

    return {"text": text}

# --------- Product APIs (SQLite) ---------

@app.get("/api/products")
def list_products(q: str = "", limit: int = 50, offset: int = 0):
    q = (q or "").strip()
    limit = max(1, min(200, int(limit)))
    offset = max(0, int(offset))

    con = db()
    try:
        if q:
            like = f"%{q}%"
            rows = con.execute(
                """
                SELECT source_product_id, product_code, ean, name, brand, category_path, last_seen_at
                FROM products
                WHERE name LIKE ? OR product_code LIKE ? OR ean LIKE ?
                ORDER BY last_seen_at DESC
                LIMIT ? OFFSET ?
                """,
                (like, like, like, limit, offset),
            ).fetchall()
        else:
            rows = con.execute(
                """
                SELECT source_product_id, product_code, ean, name, brand, category_path, last_seen_at
                FROM products
                ORDER BY last_seen_at DESC
                LIMIT ? OFFSET ?
                """,
                (limit, offset),
            ).fetchall()
        return {"items": [dict(r) for r in rows], "limit": limit, "offset": offset}
    finally:
        con.close()

@app.get("/api/products/{source_product_id}")
def get_product(source_product_id: str):
    con = db()
    try:
        row = con.execute(
            "SELECT * FROM products WHERE source_product_id = ?",
            (source_product_id,),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        d = dict(row)
        # Attempt to parse nutrition_json for convenience
        try:
            d["nutrition"] = json.loads(d.get("nutrition_json") or "{}")
        except Exception:
            d["nutrition"] = None
        return d
    finally:
        con.close()

@app.get("/api/changes")
def list_changes(limit: int = 100, offset: int = 0):
    limit = max(1, min(500, int(limit)))
    offset = max(0, int(offset))
    con = db()
    try:
        rows = con.execute(
            """
            SELECT source_product_id, changed_at, field, old_value, new_value
            FROM product_changes
            ORDER BY changed_at DESC
            LIMIT ? OFFSET ?
            """,
            (limit, offset),
        ).fetchall()
        return {"items": [dict(r) for r in rows], "limit": limit, "offset": offset}
    finally:
        con.close()

# --------- Sync Stub ---------
class ImportUrlsRequest(BaseModel):
    urls: List[str] = Field(..., min_length=1)

class ImportUrlsResult(BaseModel):
    ok: bool
    imported: int
    updated: int
    errors: List[str] = Field(default_factory=list)

@app.post("/api/import_urls", response_model=ImportUrlsResult)
async def import_urls(req: ImportUrlsRequest):
    """Import products from a list of product URLs (S-kaupat / K-Ruoka / Pikatukku)."""
    con = db()
    imported = 0
    updated = 0
    errors: List[str] = []
    try:
        for url in req.urls:
            url = (url or "").strip()
            if not url:
                continue
            try:
                p = await parse_product_url(url)
                source_product_id = f"{p['source']}:{p['source_id']}"
                row = {
                    "source_product_id": source_product_id,
                    "product_code": p.get("product_code", ""),
                    "ean": p.get("ean", ""),
                    "name": p.get("name", ""),
                    "brand": p.get("brand", ""),
                    "category_path": p.get("category_path", ""),
                    "ingredients_text": p.get("ingredients_text", ""),
                    "additives_text": p.get("additives_text", ""),
                    "allergens_text": p.get("allergens_text", ""),
                    "nutrition_json": p.get("nutrition_json", ""),
                    "source_updated_at": p.get("source_updated_at", ""),
                    "last_seen_at": now_iso(),
                }
                row["content_hash"] = build_content_hash(row)

                old = con.execute("SELECT * FROM products WHERE source_product_id=?", (source_product_id,)).fetchone()
                if old is None:
                    upsert_product(con, row)
                    imported += 1
                else:
                    oldd = dict(old)
                    if (oldd.get("content_hash") or "") != row["content_hash"]:
                        ch_at = now_iso()
                        for f in TRACK_FIELDS:
                            o = str(oldd.get(f) or "")
                            n = str(row.get(f) or "")
                            if o != n:
                                log_change(con, source_product_id, ch_at, f, o, n)
                        upsert_product(con, row)
                        updated += 1
                    else:
                        row_min = dict(oldd)
                        row_min["last_seen_at"] = row["last_seen_at"]
                        upsert_product(con, row_min)
            except Exception as e:
                errors.append(f"{url} -> {e}")
        con.commit()
        return {"ok": True, "imported": imported, "updated": updated, "errors": errors}
    finally:
        con.close()

class SyncResult(BaseModel):
    ok: bool
    message: str

@app.post("/api/sync", response_model=SyncResult)
def sync_now():
    """
    Placeholder sync endpoint.
    Next step: plug in your Valio Aimo list/detail endpoints and mapping,
    then run a delta sync and populate the products table.
    """
    # Intentionally minimal: you will paste your crawler here and call it.
    return {"ok": True, "message": "Sync stub is ready. Paste your crawler into backend and wire it here."}

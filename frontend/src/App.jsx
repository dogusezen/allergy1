import React, { useState, useMemo, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || '';
import {

  AlertTriangle,
  ChefHat,
  Users,
  Printer,
  Save,
  X,
  Check,
  Utensils,
  FileText,
  Camera,
  Zap,
  Activity,
  Calculator,
  School,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Baby,
  Droplet,
  Flame,
  Dna,
  ClipboardList,
  Wand2,
  Search,
  Loader2,
  Sparkles,
  BarChart3,
  TrendingUp,
  PieChart

} from 'lucide-react';


// --- SABTLER VE VERTABANI ---


const ALLERGEN_LIST = [

  'Süt', 'Gluten', 'Yumurta', 'Kuruyemi', 'Soya', 'Balk',
  'Kabuklu Deniz Ürünleri', 'Tavuk', 'Susam', 'Hardal', 'Kereviz', 'Baklagil'

];


// --- GENLETLM YEREL VERTABANI ---

const INGREDIENT_DATABASE = {

  // Hazr Yemekler (Türkiye & Avrupa)
  'pizza': { label: 'Pizza', allergen: 'Gluten', cal: 266, fat: 10, protein: 11, carbs: 33 },
  'hamburger': { label: 'Hamburger', allergen: 'Gluten', cal: 295, fat: 14, protein: 17, carbs: 24 },
  'schnitzel': { label: 'Schnitzel', allergen: 'Gluten', cal: 300, fat: 15, protein: 20, carbs: 18 },
  'lazanya': { label: 'Lazanya', allergen: 'Gluten', cal: 350, fat: 18, protein: 15, carbs: 30 },
  'lahmacun': { label: 'Lahmacun', allergen: 'Gluten', cal: 150, fat: 6, protein: 8, carbs: 18 },
  'mant': { label: 'Mant', allergen: 'Gluten', cal: 350, fat: 12, protein: 12, carbs: 45 },
  'börek': { label: 'Börek', allergen: 'Gluten', cal: 300, fat: 18, protein: 7, carbs: 28 },
  'simit': { label: 'Simit', allergen: 'Susam', cal: 320, fat: 10, protein: 10, carbs: 55 },
  'kruvasan': { label: 'Kruvasan', allergen: 'Gluten', cal: 280, fat: 15, protein: 5, carbs: 30 },
  'menemen': { label: 'Menemen', allergen: 'Yumurta', cal: 120, fat: 8, protein: 6, carbs: 4 },

  // Temel Malzemeler
  'krema': { label: 'Krema', allergen: 'Süt', cal: 100, fat: 10, protein: 1, carbs: 1 },
  'peynir': { label: 'Peynir', allergen: 'Süt', cal: 110, fat: 9, protein: 7, carbs: 1 },
  'mozarella': { label: 'Mozarella', allergen: 'Süt', cal: 280, fat: 22, protein: 28, carbs: 2 },
  'parmesan': { label: 'Parmesan', allergen: 'Süt', cal: 431, fat: 29, protein: 38, carbs: 4 },
  'yourt': { label: 'Yourt', allergen: 'Süt', cal: 60, fat: 3, protein: 3.5, carbs: 4.7 },
  'tereya': { label: 'Tereya', allergen: 'Süt', cal: 100, fat: 11, protein: 0.1, carbs: 0.1 },
  'yumurta': { label: 'Yumurta', allergen: 'Yumurta', cal: 70, fat: 5, protein: 6, carbs: 1 },

  // Etler
  'tavuk': { label: 'Tavuk', allergen: 'Tavuk', cal: 165, fat: 3.6, protein: 31, carbs: 0 },
  'hindi': { label: 'Hindi', allergen: 'Tavuk', cal: 140, fat: 2, protein: 30, carbs: 0 },
  'dana': { label: 'Dana Eti', allergen: null, cal: 250, fat: 15, protein: 26, carbs: 0 },
  'kyma': { label: 'Kyma', allergen: null, cal: 220, fat: 15, protein: 18, carbs: 0 },
  'sosis': { label: 'Sosis', allergen: null, cal: 300, fat: 25, protein: 12, carbs: 2 },
  'salam': { label: 'Salam', allergen: null, cal: 280, fat: 22, protein: 15, carbs: 3 },
  'sucuk': { label: 'Sucuk', allergen: null, cal: 350, fat: 30, protein: 18, carbs: 2 },
  'balk': { label: 'Balk', allergen: 'Balk', cal: 140, fat: 5, protein: 22, carbs: 0 },
  'ton': { label: 'Ton Bal', allergen: 'Balk', cal: 130, fat: 1, protein: 28, carbs: 0 },

  // Baklagil & Tahl
  'nohut': { label: 'Nohut', allergen: 'Baklagil', cal: 160, fat: 3, protein: 9, carbs: 27 },
  'fasulye': { label: 'Kuru Fasulye', allergen: 'Baklagil', cal: 140, fat: 0.5, protein: 9, carbs: 25 },
  'mercimek': { label: 'Mercimek', allergen: 'Baklagil', cal: 116, fat: 0.4, protein: 9, carbs: 20 },
  'buday': { label: 'Buday', allergen: 'Gluten', cal: 340, fat: 2, protein: 13, carbs: 72 },
  'bulgur': { label: 'Bulgur', allergen: 'Gluten', cal: 83, fat: 0.2, protein: 3, carbs: 18 },
  'makarna': { label: 'Makarna', allergen: 'Gluten', cal: 150, fat: 1, protein: 5, carbs: 30 },
  'un': { label: 'Un', allergen: 'Gluten', cal: 100, fat: 0.3, protein: 3, carbs: 21 },

  // Baharat & Sos
  'susam': { label: 'Susam', allergen: 'Susam', cal: 50, fat: 4, protein: 1, carbs: 2 },
  'hardal': { label: 'Hardal', allergen: 'Hardal', cal: 10, fat: 0.5, protein: 0.5, carbs: 0.5 },
  'kereviz': { label: 'Kereviz', allergen: 'Kereviz', cal: 14, fat: 0, protein: 0.7, carbs: 3 },
  'soya': { label: 'Soya Sosu', allergen: 'Soya', cal: 10, fat: 0, protein: 1, carbs: 1 },
  'fstk': { label: 'Fstk', allergen: 'Kuruyemi', cal: 160, fat: 14, protein: 7, carbs: 4 },
  'ceviz': { label: 'Ceviz', allergen: 'Kuruyemi', cal: 185, fat: 18, protein: 4, carbs: 4 },
  'badem': { label: 'Badem', allergen: 'Kuruyemi', cal: 170, fat: 15, protein: 6, carbs: 6 },

};


const INITIAL_CHILDREN = [

  { id: 1, name: 'Zeynep Ylmaz', school: 'Merkez Anaokulu', group: 'Kelebekler', age: 5, gender: 'Kz', allergies: ['Süt', 'Yumurta'] },
  { id: 2, name: 'Kerem Demir', school: 'Neeli Admlar', group: 'Ar Maya', age: 6, gender: 'Erkek', allergies: ['Kuruyemi', 'Susam'] },
  { id: 3, name: 'Elif ahin', school: 'Merkez Anaokulu', group: 'Kelebekler', age: 5, gender: 'Kz', allergies: ['Gluten'] },
  { id: 4, name: 'Burak Çelik', school: 'Atatürk ÖO', group: '1-A', age: 7, gender: 'Erkek', allergies: ['Soya', 'Süt'] },
  { id: 5, name: 'Aye Kaya', school: 'Neeli Admlar', group: 'Papatyalar', age: 4, gender: 'Kz', allergies: ['Tavuk', 'Hardal'] },

];


const INITIAL_MEALS = [

  {
    id: 101,
    name: 'Kark Pizza',
    ingredients: 'Pizza Hamuru, Mozarella Peyniri, Sucuk, Msr, Domates Sosu',
    allergens: ['Gluten', 'Süt'],
    nutrition: { cal: 515, fat: 24, protein: 37, carbs: 32 }
  },
  {
    id: 102,
    name: 'Susaml Tavuk',
    ingredients: 'Piliç Göüs, Susam, Soya Sosu, Bal',
    allergens: ['Soya', 'Susam', 'Tavuk'],
    nutrition: { cal: 320, fat: 8, protein: 12, carbs: 45 }
  },
  {
    id: 103,
    name: 'Meyve Salatas',
    ingredients: 'Mevsim Meyveleri (Elma, Muz, Portakal, Çilek)',
    allergens: [],
    nutrition: { cal: 150, fat: 0.5, protein: 2, carbs: 35 }
  },

];


// --- GÜVENL JSON AYRITIRICI ---

const safeJsonParse = (text) => {

  try {
    // Önce standart temizlik
    let clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    // Eer standart temizlik ie yaramazsa, ilk { ve son } arasn bulmay dene
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      const jsonStr = text.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonStr);
    }
    throw e;
  }

};


// --- GEMINI API YARDIMCISI (Düzeltilmi) ---

// --- GEMINI API YARDIMCISI (Backend proxy) ---
const callGemini = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE}/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      console.error(`Gemini Proxy Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data?.text || null;
  } catch (error) {
    console.error('Gemini Proxy Call Failed:', error);
    return null;
  }
};



export default function App() {

  const [view, setView] = useState('dashboard');
  const [children, setChildren] = useState(INITIAL_CHILDREN);
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [todayMealId, setTodayMealId] = useState(101);
  const [notification, setNotification] = useState(null);

  const [selectedForPrint, setSelectedForPrint] = useState([]);
  const [newChild, setNewChild] = useState({ name: '', school: '', group: '', age: '', gender: '', allergies: [] });
  const [customAllergy, setCustomAllergy] = useState('');

  // Yemek için özel alerjen yönetimi
  const [customMealAllergen, setCustomMealAllergen] = useState('');
  const [isAddingAllergen, setIsAddingAllergen] = useState(false);

  const [newMeal, setNewMeal] = useState({
    name: '',
    ingredients: '',
    allergens: [],
    nutrition: { cal: 0, fat: 0, protein: 0, carbs: 0 }
  });

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiVariants, setShowAiVariants] = useState(false);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const todayMeal = useMemo(() => meals.find(m => m.id === parseInt(todayMealId)) || meals[0], [meals, todayMealId]);

  const conflicts = useMemo(() => {
    if (!todayMeal) return [];
    const fullContentText = `${todayMeal.name} ${todayMeal.ingredients}`.toLocaleLowerCase('tr-TR');

    return children.filter(child => {
      return child.allergies.some(allergy => {
        const isStandardMatch = todayMeal.allergens.includes(allergy);
        const isCustomMatch = fullContentText.includes(allergy.toLocaleLowerCase('tr-TR'));
        return isStandardMatch || isCustomMatch;
      });
    }).map(child => {
      const conflicting = child.allergies.filter(a => {
        const isStandardMatch = todayMeal.allergens.includes(a);
        const isCustomMatch = fullContentText.includes(a.toLocaleLowerCase('tr-TR'));
        return isStandardMatch || isCustomMatch;
      });
      return { ...child, conflictingAllergens: conflicting };
    });
  }, [children, todayMeal]);

  useEffect(() => {
    if (view === 'labels') {
        setSelectedForPrint(conflicts.map(c => c.id));
    }
  }, [view, conflicts]);

  const handlePrint = () => {
    window.focus();
    setTimeout(() => {
        window.print();
    }, 300);
  };

  const togglePrintSelection = (id) => {
    if (selectedForPrint.includes(id)) {
        setSelectedForPrint(prev => prev.filter(item => item !== id));
    } else {
        setSelectedForPrint(prev => [...prev, id]);
    }
  };

  const toggleSelectAll = () => {
      if (selectedForPrint.length === conflicts.length) {
          setSelectedForPrint([]);
      } else {
          setSelectedForPrint(conflicts.map(c => c.id));
      }
  };

  const handleAddCustomAllergy = () => {
    if (!customAllergy.trim()) return;
    if (!newChild.allergies.includes(customAllergy.trim())) {
      setNewChild(prev => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim()]
      }));
      setCustomAllergy('');
    } else {
      showNotification('Bu alerjen zaten ekli.');
    }
  };

  const removeAllergy = (allergyToRemove) => {
    setNewChild(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergyToRemove)
    }));
  };

  const addCustomMealAllergen = () => {
    const trimmed = customMealAllergen.trim();
    if (!trimmed) return;

    if (newMeal.allergens.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
        showNotification('Bu alerjen zaten listede var.');
        setCustomMealAllergen('');
        return;
    }

    setNewMeal(prev => ({
        ...prev,
        allergens: [...prev.allergens, trimmed]
    }));
    setCustomMealAllergen('');
    setIsAddingAllergen(false);
    showNotification('Alerjen manuel olarak eklendi.');
  };

  const localAnalyzeMeal = (text) => {
    const lowerText = text.toLocaleLowerCase('tr-TR');
    const detectedAllergens = new Set();

    let totalCal = 0;
    let totalFat = 0;
    let totalProtein = 0;
    let totalCarbs = 0;

    Object.keys(INGREDIENT_DATABASE).forEach(key => {
      if (lowerText.includes(key)) {
        const item = INGREDIENT_DATABASE[key];
        if (item.allergen) detectedAllergens.add(item.allergen);
        totalCal += item.cal;
        totalFat += item.fat;
        totalProtein += item.protein;
        totalCarbs += item.carbs;
      }
    });

    if (totalCal === 0 && text.length > 5) totalCal = 200;

    return {
      allergens: Array.from(detectedAllergens),
      nutrition: {
        cal: Math.round(totalCal),
        fat: Math.round(totalFat * 10) / 10,
        protein: Math.round(totalProtein * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10
      }
    };
  };

  const updateMealData = (ingredients, analysisData = null) => {
    const analysis = analysisData || localAnalyzeMeal(ingredients);
    setNewMeal(prev => ({
      ...prev,
      ingredients: ingredients,
      allergens: analysis.allergens,
      nutrition: analysis.nutrition
    }));
  };

  const generateAiRecipe = async () => {
    if (!newMeal.name) {
      showNotification('Lütfen önce bir yemek ad girin.');
      return;
    }
    setIsAiLoading(true);
    setAiSuggestions([]);
    setShowAiVariants(false);

    try {
      const prompt = `Sen bir catering uzmansn. "${newMeal.name}" yemei için:

      1. Eer bu yemek çok genel bir isimse (örn: Pizza, Makarna, Tost), en popüler 3 çeidini ve içeriklerini JSON listesi olarak ver.
      2. Eer spesifik bir yemekse (örn: slim Kebab), sadece standart endüstriyel malzemelerini tek bir string olarak ver.

      Yant Format (JSON):
      {
        "isGeneric": true/false,
        "variants": [ {"name": "Çeit Ad", "ingredients": "malzeme1, malzeme2"} ],
        "singleRecipe": "malzeme1, malzeme2"
      }
      Sadece JSON döndür.`;


      const result = await callGemini(prompt);
      if (result) {
        // Safe JSON Parse Kullanm
        try {
            const data = safeJsonParse(result);
            if (data.isGeneric && data.variants.length > 0) {
              setAiSuggestions(data.variants);
              setShowAiVariants(true);
              showNotification('Lütfen bir çeit seçin.');
            } else {
              updateMealData(data.singleRecipe || "");
              showNotification('Tarif AI tarafndan oluturuldu ');
            }
        } catch (parseError) {
             console.error("AI JSON Parse Error:", parseError);
             showNotification('AI yant ilenemedi.');
        }
      }
    } catch (e) {
      console.error(e);
      showNotification('AI yant veremedi, lütfen tekrar deneyin.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const formatIngredientsWithAi = async () => {
    if (!newMeal.ingredients) return;
    setIsAiLoading(true);
    try {
      const prompt = `Aadaki yemek malzemelerini endüstriyel standartta, virgülle ayrlm, ba harfleri büyük ve temiz bir liste haline getir. Gereksiz kelimeleri (biraz, bolca vs.) at.

      Girdi: "${newMeal.ingredients}"
      Çkt (Sadece metin):`;


      const result = await callGemini(prompt);
      if (result) {
        updateMealData(result.trim());
        showNotification('Liste düzenlendi ');
      }
    } catch (e) {
      showNotification('Düzenleme baarsz.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const analyzeWithGemini = async () => {
    if (!newMeal.ingredients) return;
    setIsAiLoading(true);
    try {
      const prompt = `Analiz et: "${newMeal.name}", içindekiler: "${newMeal.ingredients}".

      1. Bu listedeki alerjenleri tespit et (Liste: Süt, Gluten, Yumurta, Kuruyemi, Soya, Balk, Kabuklu Deniz Ürünleri, Tavuk, Susam, Hardal, Kereviz, Baklagil).
      2. 1 porsiyon için tahmini besin deerlerini hesapla (Kalori, Ya, Protein, Karbonhidrat).
      Yant SADECE u JSON formatnda ver:
      { "allergens": ["Alerjen1", "Alerjen2"], "nutrition": { "cal": 0, "fat": 0, "protein": 0, "carbs": 0 } }`;


      const result = await callGemini(prompt);
      if (result) {
        try {
            const data = safeJsonParse(result);
            setNewMeal(prev => ({
            ...prev,
            allergens: data.allergens || [],
            nutrition: data.nutrition || prev.nutrition
            }));
            showNotification('Detayl analiz tamamland ');
        } catch (parseError) {
             console.error("AI JSON Parse Error:", parseError);
             showNotification('Analiz sonucu okunamad.');
        }
      }
    } catch (e) {
      showNotification('Analiz srasnda hata olutu.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddChild = () => {
    if (!newChild.name || !newChild.group || !newChild.school) return;
    setChildren([...children, { ...newChild, id: Date.now() }]);
    setNewChild({ name: '', school: '', group: '', age: '', gender: '', allergies: [] });
    showNotification('Örenci baaryla eklendi');
    setView('dashboard');
  };

  const handleAddMeal = () => {
    if (!newMeal.name) return;
    const newId = Date.now();
    setMeals([...meals, { ...newMeal, id: newId }]);
    setTodayMealId(newId);
    setNewMeal({ name: '', ingredients: '', allergens: [], nutrition: { cal: 0, fat: 0, protein: 0, carbs: 0 } });
    showNotification('Yemek menüye eklendi ve seçildi');
    setView('dashboard');
  };

  const renderBadge = (text, type = 'neutral') => {
    const colors = {
      neutral: 'bg-gray-100 text-gray-800',
      danger: 'bg-red-100 text-red-800 border border-red-200',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800'
    };
    return (
      <span key={text} className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[type]} mr-1 mb-1 inline-block`}>
        {text}
      </span>
    );
  };

  // --- YEN EKLENEN RAPOR GÖRÜNÜMÜ ---
  const renderReportsView = () => {
    const totalStudents = children.length;
    const studentsWithAllergies = children.filter(c => c.allergies.length > 0).length;
    const allergyRatio = totalStudents > 0 ? Math.round((studentsWithAllergies / totalStudents) * 100) : 0;

    // Alerjen Dalmn Hesapla
    const allergyDistribution = {};
    children.forEach(c => {
        c.allergies.forEach(a => {
            allergyDistribution[a] = (allergyDistribution[a] || 0) + 1;
        });
    });
    // Srala
    const sortedAllergens = Object.entries(allergyDistribution)
        .sort(([,a], [,b]) => b - a);

    // Mock Aylk Trend Verisi (Simülasyon)
    const monthlyStats = [
        { month: 'Eyl', risk: 15 },
        { month: 'Eki', risk: 8 },
        { month: 'Kas', risk: 12 },
        { month: 'Ara', risk: 6 },
        { month: 'Oca', risk: 10 },
        { month: 'ub', risk: 4 },
    ];
    const maxRisk = Math.max(...monthlyStats.map(s => s.risk));

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Üst Özet Kartlar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                        <p className="text-sm text-gray-500 font-medium">Toplam Hizmet Alan</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalStudents}</h3>
                        <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                            <TrendingUp size={12} className="mr-1" /> Geçen aya göre +2
                        </p>
                   </div>
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Users size={24} />
                   </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                        <p className="text-sm text-gray-500 font-medium">Özel Diyetli Örenci</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{studentsWithAllergies}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                            Tüm örencilerin %{allergyRatio}'si
                        </p>
                   </div>
                   <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <AlertTriangle size={24} />
                   </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                        <p className="text-sm text-gray-500 font-medium">Aktif Reçete Says</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{meals.length}</h3>
                        <p className="text-xs text-purple-600 font-medium mt-1 flex items-center">
                             <Sparkles size={12} className="mr-1" /> AI ile optimize edildi
                        </p>
                   </div>
                   <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <ChefHat size={24} />
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alerjen Dalm Grafii */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <PieChart size={18} className="mr-2 text-blue-600" />
                        Alerjen Dalm (Örenci Bazl)
                    </h3>
                    <div className="space-y-4">
                        {sortedAllergens.length > 0 ? sortedAllergens.map(([key, value]) => (
                            <div key={key}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{key}</span>
                                    <span className="text-gray-500">{value} Örenci</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${(value / totalStudents) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400 py-8">Veri bulunamad.</p>
                        )}
                    </div>
                </div>

                {/* Aylk Risk Trendi Grafii */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                        <BarChart3 size={18} className="mr-2 text-orange-600" />
                        Engellenen Risk Trendi (Son 6 Ay)
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">Sistem tarafndan otomatik engellenen alerjen çakmalar.</p>

                    <div className="flex-1 flex items-end justify-between px-2 gap-2 h-48 border-b border-gray-100 pb-2">
                        {monthlyStats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center w-full group relative">
                                <div
                                    className="w-full bg-orange-100 rounded-t-md hover:bg-orange-200 transition-all relative group-hover:scale-105"
                                    style={{ height: `${(stat.risk / maxRisk) * 100}%` }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {stat.risk}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2 font-medium">{stat.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detay Tablosu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800">Riskli Örenci Listesi Özeti</h3>
                </div>
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                        <tr>
                            <th className="px-6 py-3">Örenci Ad</th>
                            <th className="px-6 py-3">Grup / Snf</th>
                            <th className="px-6 py-3">Kritik Alerjenler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {children.filter(c => c.allergies.length > 0).slice(0, 5).map(child => (
                            <tr key={child.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{child.name}</td>
                                <td className="px-6 py-3">{child.group}</td>
                                <td className="px-6 py-3">
                                    <div className="flex gap-1">
                                        {child.allergies.map(a => (
                                            <span key={a} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs border border-red-100">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {studentsWithAllergies === 0 && (
                            <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-400">Riskli kayt bulunamad.</td></tr>
                        )}
                    </tbody>
                </table>
                {studentsWithAllergies > 5 && (
                    <div className="p-3 text-center text-xs text-gray-400 border-t border-gray-100">
                        ve {studentsWithAllergies - 5} örenci daha...
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Kaytl Örenci</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{children.length}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-sm border ${conflicts.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm font-medium ${conflicts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                Bugünkü Riskler
              </p>
              <h3 className={`text-3xl font-bold mt-1 ${conflicts.length > 0 ? 'text-red-800' : 'text-green-800'}`}>
                {conflicts.length}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${conflicts.length > 0 ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Günün Menüsü</p>
              <select
                value={todayMealId}
                onChange={(e) => setTodayMealId(Number(e.target.value))}
                className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-50 border"
              >
                {meals.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Utensils size={24} />
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
             <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-gray-50 p-2 rounded">
                    <Flame size={16} className="mx-auto text-orange-500 mb-1" />
                    <span className="block text-xs font-bold text-gray-800">{todayMeal.nutrition?.cal || 0}</span>
                    <span className="text-[10px] text-gray-500">kcal</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <Droplet size={16} className="mx-auto text-yellow-500 mb-1" />
                    <span className="block text-xs font-bold text-gray-800">{todayMeal.nutrition?.fat || 0}g</span>
                    <span className="text-[10px] text-gray-500">Ya</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <Dna size={16} className="mx-auto text-blue-500 mb-1" />
                    <span className="block text-xs font-bold text-gray-800">{todayMeal.nutrition?.protein || 0}g</span>
                    <span className="text-[10px] text-gray-500">Prot.</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <Zap size={16} className="mx-auto text-purple-500 mb-1" />
                    <span className="block text-xs font-bold text-gray-800">{todayMeal.nutrition?.carbs || 0}g</span>
                    <span className="text-[10px] text-gray-500">Karb.</span>
                </div>
             </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
                {todayMeal.allergens.length > 0 ? (
                todayMeal.allergens.map(a => renderBadge(a, 'warning'))
                ) : (
                <span className="text-xs text-gray-400">Alerjen tespit edilmedi</span>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
              Güvenlik Uyarlar (Bugün)
            </h3>
            {conflicts.length > 0 && (
              <button
                onClick={() => setView('labels')}
                className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg flex items-center hover:bg-gray-800 transition-colors"
              >
                <Printer size={12} className="mr-1.5" />
                Etiket Yazdr
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-100">
            {conflicts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Check className="w-12 h-12 mx-auto text-green-200 mb-2" />
                <p>Güvenli gün! Alerji çakmas yok.</p>
              </div>
            ) : (
              conflicts.map(child => (
                <div key={child.id} className="p-4 hover:bg-red-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm mr-3">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{child.name}</p>
                      <p className="text-xs text-gray-500">
                        {child.age ? `${child.age} Ya` : ''} • {child.gender || ''} • {child.school}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide block mb-1">
                      SERVS ETMEYN
                    </span>
                    {child.conflictingAllergens.map(a => renderBadge(a, 'danger'))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <h3 className="font-bold text-xl mb-2">Hzl lemler</h3>
          <p className="text-blue-100 mb-6 text-sm">Veritabann yönetin veya bir sonraki gün için hazrlk yapn.</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setView('addMeal')}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-white/10 group"
            >
              <ChefHat className="w-8 h-8 mb-2 text-blue-200 group-hover:text-white transition-colors" />
              <span className="font-medium text-sm">Yemek / Reçete Gir</span>
              <span className="text-[10px] text-blue-200 mt-1 flex items-center">
                <Sparkles size={10} className="mr-1" /> Gemini AI Destekli
              </span>
            </button>
            <button
              onClick={() => setView('addChild')}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-white/10 group"
            >
              <Users className="w-8 h-8 mb-2 text-blue-200 group-hover:text-white transition-colors" />
              <span className="font-medium text-sm">Örenci Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddMealForm = () => (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                Yemek Reçete Girii
                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200 flex items-center">
                    <Sparkles size={12} className="mr-1" /> AI Powered
                </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Sadece yemek adn girin, gerisini AI halletsin.</p>
        </div>
        <button onClick={() => setView('dashboard')} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yemek Ad (Reçete Ad)</label>
          <div className="flex gap-2">
            <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Örn: Pizza, Makarna, Kuru Fasulye..."
                value={newMeal.name}
                onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
            />
            <button
                onClick={generateAiRecipe}
                disabled={isAiLoading || !newMeal.name}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center hover:bg-purple-700 disabled:opacity-50 transition-all whitespace-nowrap shadow-sm"
            >
                {isAiLoading ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                ) : (
                    <Wand2 size={16} className="mr-2" />
                )}
                AI ile Olutur
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-1 flex items-center">
            * "Pizza" gibi genel isimler yazarsanz AI size çeit soracaktr.
          </p>
        </div>

        {/* AI Varyasyon Seçimi Modal (Basit) */}
        {showAiVariants && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 animate-fadeIn">
                <p className="text-sm font-bold text-purple-900 mb-2 flex items-center">
                    <AlertTriangle size={14} className="mr-2" />
                    Lütfen bir çeit seçin:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {aiSuggestions.map((variant, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setNewMeal({...newMeal, name: variant.name, ingredients: variant.ingredients});
                                updateMealData(variant.ingredients);
                                setShowAiVariants(false);
                            }}
                            className="text-left bg-white p-2 rounded border border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-all text-sm"
                        >
                            <span className="font-bold block text-purple-700">{variant.name}</span>
                            <span className="text-xs text-gray-500 line-clamp-1">{variant.ingredients}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-blue-900">Yemek Bileenleri</label>
            <div className="flex gap-2">
                <button
                    onClick={formatIngredientsWithAi}
                    disabled={!newMeal.ingredients || isAiLoading}
                    className="flex items-center text-xs bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                    title="Yazm hatalarn düzelt ve formatla"
                >
                    <Sparkles size={12} className="mr-1" /> Düzenle
                </button>
            </div>
          </div>
          <textarea
            className="w-full border border-blue-200 rounded-lg p-2.5 text-sm h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            placeholder="Örn: Dana Kyma, Soan, Yumurta..."
            value={newMeal.ingredients}
            onChange={(e) => updateMealData(e.target.value)}
          />
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-700 flex items-center">
                    <Activity size={16} className="mr-2 text-green-600" />
                    Besin Deerleri
                </label>
                <button
                    onClick={analyzeWithGemini}
                    disabled={!newMeal.ingredients || isAiLoading}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-full flex items-center hover:bg-green-700 shadow-sm"
                >
                    {isAiLoading ? <Loader2 size={12} className="animate-spin mr-1" /> : <Sparkles size={12} className="mr-1" />}
                    AI Detayl Analiz
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100 text-center">
                    <div className="flex justify-center mb-1"><Flame size={20} className="text-orange-500" /></div>
                    <div className="text-xl font-bold text-gray-800">{newMeal.nutrition.cal}</div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Kalori (kcal)</div>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm border border-yellow-100 text-center">
                    <div className="flex justify-center mb-1"><Droplet size={20} className="text-yellow-500" /></div>
                    <div className="text-xl font-bold text-gray-800">{newMeal.nutrition.fat}g</div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Ya</div>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 text-center">
                    <div className="flex justify-center mb-1"><Dna size={20} className="text-blue-500" /></div>
                    <div className="text-xl font-bold text-gray-800">{newMeal.nutrition.protein}g</div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Protein</div>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100 text-center">
                    <div className="flex justify-center mb-1"><Zap size={20} className="text-purple-500" /></div>
                    <div className="text-xl font-bold text-gray-800">{newMeal.nutrition.carbs}g</div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Karbonhidrat</div>
                </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
                * Varsaylan deerler yerel veritabanndan, detayl analiz ise AI'dan gelir.
            </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Otomatik Tespit Edilen Alerjenler</label>

          <div className="flex flex-wrap gap-2 mb-3 items-center">
            {/* Standart Alerjen Listesi */}
            {ALLERGEN_LIST.map(allergen => (
              <button
                key={allergen}
                onClick={() => {
                  const current = newMeal.allergens;
                  setNewMeal({
                    ...newMeal,
                    allergens: current.includes(allergen)
                      ? current.filter(a => a !== allergen)
                      : [...current, allergen]
                  });
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  newMeal.allergens.includes(allergen)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {allergen}
              </button>
            ))}

            {/* Manuel Eklenen Özel Alerjenlerin Gösterimi */}
            {newMeal.allergens
               .filter(a => !ALLERGEN_LIST.includes(a))
               .map(a => (
                 <span key={a} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm font-bold flex items-center border border-indigo-200">
                   {a}
                   <button
                     onClick={() => setNewMeal(prev => ({...prev, allergens: prev.allergens.filter(item => item !== a)}))}
                     className="ml-2 hover:text-indigo-950"
                     title="Kaldr"
                   >
                     <X size={14} />
                   </button>
                 </span>
            ))}

            {/* Entegre Alerjen Ekleme Butonu/Alan */}
            {isAddingAllergen ? (
                <div className="flex items-center bg-white border border-indigo-300 rounded-full px-2 py-1 shadow-sm">
                    <input
                        autoFocus
                        type="text"
                        className="outline-none text-sm w-24 text-gray-700"
                        placeholder="Alerjen..."
                        value={customMealAllergen}
                        onChange={(e) => setCustomMealAllergen(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') addCustomMealAllergen();
                            if (e.key === 'Escape') setIsAddingAllergen(false);
                        }}
                    />
                    <button onClick={addCustomMealAllergen} className="text-indigo-600 hover:text-indigo-800 ml-1"><Check size={14}/></button>
                    <button onClick={() => setIsAddingAllergen(false)} className="text-gray-400 hover:text-gray-600 ml-1"><X size={14}/></button>
                </div>
            ) : (
                <button
                    onClick={() => setIsAddingAllergen(true)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-dashed border-gray-400 text-gray-500 hover:border-gray-600 hover:text-gray-700 flex items-center hover:bg-gray-50"
                >
                    <Plus size={14} className="mr-1"/> Ekle
                </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            * Seçili alerjenler mavi, seçilmeyenler beyaz görünür. Özel alerjen eklemek için "+ Ekle" butonunu kullann.
          </p>
        </div>

        <button
          onClick={handleAddMeal}
          disabled={!newMeal.name}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          <Save size={18} className="mr-2" />
          Reçeteyi Kaydet
        </button>
      </div>
    </div>
  );

  const renderAddChildForm = () => (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Örenci Kayd</h2>
        <button onClick={() => setView('dashboard')} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Örn: Ahmet Ylmaz"
            value={newChild.name}
            onChange={(e) => setNewChild({...newChild, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Okul Ad</label>
            <div className="relative">
                <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Örn: Merkez Anaokulu"
                value={newChild.school}
                onChange={(e) => setNewChild({...newChild, school: e.target.value})}
                />
                <School className="absolute left-3 top-3 text-gray-400" size={16} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Snf / Grup</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Örn: Kelebekler"
              value={newChild.group}
              onChange={(e) => setNewChild({...newChild, group: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ya</label>
            <div className="relative">
                <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Örn: 6"
                value={newChild.age}
                onChange={(e) => setNewChild({...newChild, age: e.target.value})}
                />
                <Baby className="absolute left-3 top-3 text-gray-400" size={16} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={newChild.gender}
              onChange={(e) => setNewChild({...newChild, gender: e.target.value})}
            >
              <option value="">Seçiniz</option>
              <option value="Kz">Kz</option>
              <option value="Erkek">Erkek</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Bilinen Alerjiler</label>

          <div className="flex flex-wrap gap-2 mb-4">
            {newChild.allergies.length === 0 && <span className="text-sm text-gray-400 italic">Henüz alerjen seçilmedi.</span>}
            {newChild.allergies.map(allergy => (
              <span key={allergy} className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                {allergy}
                <button onClick={() => removeAllergy(allergy)} className="ml-2 text-red-400 hover:text-red-700">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {ALLERGEN_LIST.map(allergen => (
              <label
                key={allergen}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  newChild.allergies.includes(allergen)
                    ? 'bg-red-50 border-red-200 ring-1 ring-red-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 mr-2"
                  checked={newChild.allergies.includes(allergen)}
                  onChange={() => {
                    const current = newChild.allergies;
                    setNewChild({
                      ...newChild,
                      allergies: current.includes(allergen)
                        ? current.filter(a => a !== allergen)
                        : [...current, allergen]
                    });
                  }}
                />
                <span className={`text-sm ${newChild.allergies.includes(allergen) ? 'font-medium text-red-800' : 'text-gray-600'}`}>
                  {allergen}
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Listede yok mu? Manuel ekleyin:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Örn: Çilek, Kivi, Ar..."
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAllergy()}
              />
            </div>
            <button
              onClick={handleAddCustomAllergy}
              className="bg-gray-800 text-white p-2 rounded-lg hover:bg-black transition-colors"
              title="Listeye Ekle"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <button
          onClick={handleAddChild}
          disabled={!newChild.name || !newChild.group || !newChild.school}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          <Save size={18} className="mr-2" />
          Profili Kaydet
        </button>
      </div>
    </div>
  );

  const renderPrintView = () => (
    <div className="max-w-5xl mx-auto">
      {/* 1. SEÇM EKRANI - YAZDIRILMAYACAK */}
      <div className="no-print mb-8">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Etiket Yazdr</h2>
                <p className="text-gray-500">Listeden etiket basmak istediiniz kiileri seçiniz.</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setView('dashboard')} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    ptal
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center hover:bg-blue-700 shadow-md transition-colors"
                    disabled={selectedForPrint.length === 0}
                >
                    <Printer size={18} className="mr-2" />
                    Seçilenleri Yazdr ({selectedForPrint.length})
                </button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <button onClick={toggleSelectAll} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                    {selectedForPrint.length === conflicts.length ? <CheckSquare className="mr-2 text-blue-600" /> : <Square className="mr-2" />}
                    Tümünü Seç / Kaldr
                </button>
                <span className="text-sm text-gray-500">{conflicts.length} kiiden {selectedForPrint.length} kii seçildi</span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {conflicts.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">Yazdrlacak riskli kayt bulunamad.</div>
                ) : (
                    conflicts.map(child => (
                        <div
                            key={child.id}
                            onClick={() => togglePrintSelection(child.id)}
                            className={`p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors ${selectedForPrint.includes(child.id) ? 'bg-blue-50/50' : ''}`}
                        >
                            <div className="flex items-center">
                                <div className={`mr-4 ${selectedForPrint.includes(child.id) ? 'text-blue-600' : 'text-gray-300'}`}>
                                    {selectedForPrint.includes(child.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{child.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {child.school} - {child.group}
                                      {child.age && <span className="ml-2 bg-gray-100 px-1 rounded text-xs">Ya: {child.age}</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {child.conflictingAllergens.map(a => (
                                    <span key={a} className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded">
                                        {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        <div className="mt-8 mb-4 border-t pt-8">
            <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wider mb-4">Etiket Önizleme</h3>
        </div>
      </div>

      {/* 2. ETKETLER - YAZDIRILACAK ALAN */}
      <div id="printable-area" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conflicts.filter(c => selectedForPrint.includes(c.id)).map((child, index) => (
          <div
            key={index}
            className="border-4 border-black p-6 bg-white rounded-none shadow-sm mb-4 relative flex flex-col justify-between"
            style={{ minHeight: '350px' }}
          >
            {/* Header */}
            <div>
                <div className="bg-red-600 text-white text-center py-2 font-black text-xl tracking-widest uppercase mb-4" style={{WebkitPrintColorAdjust: 'exact'}}>
                    ALERJ UYARISI
                </div>

                <div className="flex justify-between items-start mb-4">
                    <div className="w-full">
                        <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Örenci Ad</h2>
                        <div className="flex justify-between items-baseline">
                          <p className="text-2xl font-black text-black leading-tight truncate">{child.name}</p>
                          {(child.age || child.gender) && (
                            <span className="text-sm font-bold border border-black px-2 py-0.5 rounded-sm ml-2">
                                {child.age ? `${child.age} Ya` : ''}
                                {child.age && child.gender ? ' / ' : ''}
                                {child.gender || ''}
                            </span>
                          )}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                     <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Okul ve Snf</h2>
                     <div className="flex items-center">
                        <School size={16} className="text-gray-400 mr-2" />
                        <span className="text-lg font-bold text-gray-800">{child.school} <span className="text-gray-400 mx-1">/</span> {child.group}</span>
                     </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Günün Menüsü</h2>
                    <p className="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2">{todayMeal.name}</p>

                    {/* Yazdrlan etikette kalori bilgisi (stee bal) */}
                    <div className="flex gap-2 mt-2 text-[10px] text-gray-500 font-mono">
                       <span>Kcal: {todayMeal.nutrition?.cal || 0}</span> |
                       <span>Ya: {todayMeal.nutrition?.fat || 0}g</span> |
                       <span>Prot: {todayMeal.nutrition?.protein || 0}g</span>
                    </div>
                </div>
            </div>

            {/* Footer / Allergen Alert */}
            <div className="mt-auto">
                <div className="bg-red-50 border-2 border-red-600 p-4 text-center" style={{WebkitPrintColorAdjust: 'exact'}}>
                    <div className="flex justify-center items-center mb-2 text-red-700 font-bold text-sm uppercase">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Yemekte Bulunan Alerjen Ürünler
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {child.conflictingAllergens.map(a => (
                            <span key={a} className="bg-red-600 text-white px-3 py-1 font-black text-xl uppercase tracking-wide rounded-sm shadow-sm" style={{WebkitPrintColorAdjust: 'exact'}}>
                                {a}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-[10px] text-gray-400 font-mono">ALLERGY MANAGEMENT SYSTEM • {new Date().toLocaleDateString('tr-TR')}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yazdrma için Gelimi CSS */}
      <style>{`

        @media print {
            @page {
                margin: 0.5cm;
                size: auto;
            }

            body {
                background: white;
                height: 100vh;
                overflow: hidden;
            }

            /* Her eyi gizle */
            body * {
                visibility: hidden;
            }

            /* Sadece yazdrlabilir alan ve içeriini görünür yap */
            #printable-area, #printable-area * {
                visibility: visible;
            }

            /* Yazdrlabilir alan sayfann en üstüne ve önüne getir */
            #printable-area {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                background: white;
                margin: 0;
                padding: 20px;
                display: grid !important;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                align-content: start;
            }

            /* UI elementlerini tamamen kaldr */
            .no-print, nav, header, button, .fixed {
                display: none !important;
            }
        }
      `}</style>

    </div>
  );

}
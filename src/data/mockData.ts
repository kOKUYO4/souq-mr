/* Données de démonstration pour SOUQ.MR */

export interface Listing {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  location: string;
  locationAr: string;
  images: string[];
  condition: "new" | "used" | "tbh";
  negotiable: boolean;
  cod: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  seller: Seller;
  description: string;
  descriptionAr: string;
  attributes?: Record<string, string>;
}

export interface Seller {
  id: string;
  name: string;
  nameAr: string;
  avatar: string;
  badge: "verified" | "pro" | "regular";
  rating: number;
  reviews: number;
  listings: number;
  joinedAt: string;
  phone: string;
  responseTime?: string;
}

export interface Review {
  id: string;
  author: string;
  authorAr: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  commentAr: string;
  sellerId: string;
  listingId?: string;
}

export interface Notification {
  id: string;
  type: "offer" | "message" | "sold" | "review" | "system";
  titleFr: string;
  titleAr: string;
  bodyFr: string;
  bodyAr: string;
  read: boolean;
  createdAt: string;
  link?: string;
  avatar?: string;
}

export const sellers: Seller[] = [
  {
    id: "s1",
    name: "Mohamed Ould Saleck",
    nameAr: "محمد ولد سالك",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
    badge: "pro",
    rating: 4.9,
    reviews: 127,
    listings: 45,
    joinedAt: "2023-01-15",
    phone: "+222 22 34 56 78",
    responseTime: "< 1h",
  },
  {
    id: "s2",
    name: "Fatimetou Mint Ahmed",
    nameAr: "فاطمة بنت أحمد",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    badge: "verified",
    rating: 4.7,
    reviews: 63,
    listings: 28,
    joinedAt: "2023-05-20",
    phone: "+222 33 45 67 89",
    responseTime: "< 3h",
  },
  {
    id: "s3",
    name: "Abderrahmane Ould Bah",
    nameAr: "عبد الرحمن ولد باه",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abderrahmane",
    badge: "regular",
    rating: 4.5,
    reviews: 31,
    listings: 12,
    joinedAt: "2024-02-10",
    phone: "+222 44 56 78 90",
    responseTime: "< 6h",
  },
  {
    id: "s4",
    name: "Mariem Mint Mokhtar",
    nameAr: "مريم بنت مختار",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariem",
    badge: "verified",
    rating: 4.8,
    reviews: 89,
    listings: 34,
    joinedAt: "2023-08-05",
    phone: "+222 55 67 89 01",
    responseTime: "< 2h",
  },
  {
    id: "s5",
    name: "Cheikh Ould Sidi",
    nameAr: "شيخ ولد سيدي",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cheikh",
    badge: "pro",
    rating: 4.95,
    reviews: 214,
    listings: 78,
    joinedAt: "2022-11-01",
    phone: "+222 66 78 90 12",
    responseTime: "< 30min",
  },
  {
    id: "s6",
    name: "Aminetou Mint Vall",
    nameAr: "آمنة بنت فال",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aminetou",
    badge: "regular",
    rating: 4.3,
    reviews: 17,
    listings: 8,
    joinedAt: "2024-04-22",
    phone: "+222 77 89 01 23",
    responseTime: "< 12h",
  },
];

export const listings: Listing[] = [
  {
    id: "l1",
    title: "Toyota Land Cruiser 2018 - Excellent état",
    titleAr: "تويوتا لاند كروزر 2018 - حالة ممتازة",
    price: 4800000,
    category: "vehicles",
    subcategory: "cars",
    location: "Tevragh-Zeina, Nouakchott",
    locationAr: "تيفرغ زينة، نواكشوط",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
    ],
    condition: "used",
    negotiable: true,
    cod: false,
    featured: true,
    views: 1247,
    createdAt: "2024-12-01",
    seller: sellers[0],
    description:
      "Magnifique Land Cruiser en excellent état, entretenu régulièrement, première main. Moteur diesel 4.5L V8, climatisation, GPS, caméra de recul. Idéal pour les routes mauritaniennes.",
    descriptionAr:
      "لاند كروزر رائع في حالة ممتازة، صيانة منتظمة، يد أولى. محرك ديزل 4.5 لتر V8، مكيف هواء، GPS، كاميرا خلفية. مثالي للطرق الموريتانية.",
    attributes: { marque: "Toyota", modele: "Land Cruiser", annee: "2018", km: "120 000 km", carburant: "Diesel", boite: "Automatique" },
  },
  {
    id: "l2",
    title: "iPhone 15 Pro Max 256GB - Neuf",
    titleAr: "آيفون 15 برو ماكس 256 جيجا - جديد",
    price: 195000,
    category: "phones",
    subcategory: "smartphones",
    location: "Ksar, Nouakchott",
    locationAr: "القصر، نواكشوط",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
    ],
    condition: "new",
    negotiable: false,
    cod: true,
    featured: true,
    views: 892,
    createdAt: "2024-12-03",
    seller: sellers[1],
    description:
      "iPhone 15 Pro Max tout neuf, sous blister, garantie 1 an. Coloris Titane naturel, 256GB de stockage. Livraison disponible dans tout Nouakchott.",
    descriptionAr:
      "آيفون 15 برو ماكس جديد، في علبته، ضمان سنة. لون التيتانيوم الطبيعي، 256 جيجا تخزين. التوصيل متوفر في كل نواكشوط.",
    attributes: { marque: "Apple", modele: "iPhone 15 Pro Max", stockage: "256 GB", couleur: "Titane Naturel", etat: "Neuf sous blister" },
  },
  {
    id: "l3",
    title: "Daraa mauritanienne brodée - Haute couture",
    titleAr: "دراعة موريتانية مطرزة - خياطة راقية",
    price: 18000,
    category: "fashion",
    subcategory: "traditional",
    location: "Arafat, Nouakchott",
    locationAr: "عرفات، نواكشوط",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
    ],
    condition: "new",
    negotiable: true,
    cod: true,
    featured: true,
    views: 543,
    createdAt: "2024-12-02",
    seller: sellers[2],
    description:
      "Daraa traditionnelle mauritanienne, broderie à la main par une artisane locale, tissu coton haut de gamme. Disponible en tailles S, M, L, XL.",
    descriptionAr:
      "دراعة تقليدية موريتانية، تطريز يدوي من حرفية محلية، قماش قطن فاخر. متوفرة بمقاسات S، M، L، XL.",
    attributes: { taille: "M / L / XL", matiere: "Coton premium", broderie: "Main", origine: "Artisanat mauritanien" },
  },
  {
    id: "l4",
    title: "Ensemble de parfums Oud — Collection Mauritanie",
    titleAr: "مجموعة عطور العود - كولكشن موريتانيا",
    price: 45000,
    originalPrice: 60000,
    category: "beauty",
    subcategory: "perfume",
    location: "Nouadhibou",
    locationAr: "نواذيبو",
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80",
    ],
    condition: "new",
    negotiable: true,
    cod: true,
    featured: false,
    views: 334,
    createdAt: "2024-12-04",
    seller: sellers[3],
    description:
      "Collection exclusive d'ouds mauritaniens, bakhour et musc. Parfums 100% naturels, certifiés halal. Coffret cadeau disponible.",
    descriptionAr:
      "مجموعة حصرية من العود الموريتاني والبخور والمسك. عطور 100% طبيعية، شهادة حلال. علبة هدايا متوفرة.",
    attributes: { type: "Oud / Bakhour / Musc", certification: "Halal certifié", origine: "Mauritanie", contenance: "50ml + 100ml + 200g" },
  },
  {
    id: "l5",
    title: "Salon mauritanien — Canapé 8 places en velours",
    titleAr: "صالون موريتاني - أريكة 8 أشخاص بالمخمل",
    price: 85000,
    category: "home",
    subcategory: "furniture",
    location: "Tevragh-Zeina, Nouakchott",
    locationAr: "تيفرغ زينة، نواكشوط",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    ],
    condition: "used",
    negotiable: true,
    cod: false,
    featured: false,
    views: 221,
    createdAt: "2024-11-28",
    seller: sellers[4],
    description:
      "Beau salon style mauritanien, très bon état, peu utilisé. Tissu velours vert, inclus table basse et coussins brodés. Livraison possible à Nouakchott.",
    descriptionAr:
      "صالون جميل على الطراز الموريتاني، حالة ممتازة، قليل الاستخدام. قماش مخمل أخضر، يشمل طاولة وسائد مطرزة. التوصيل ممكن في نواكشوط.",
    attributes: { places: "8 personnes", matiere: "Velours", couleur: "Vert émeraude", etat: "Très bon état" },
  },
  {
    id: "l6",
    title: "Samsung Galaxy S24 Ultra — 512GB Titanium",
    titleAr: "سامسونج جالاكسي S24 الترا - 512 جيجا تيتانيوم",
    price: 165000,
    category: "phones",
    subcategory: "smartphones",
    location: "Ryad, Nouakchott",
    locationAr: "الرياض، نواكشوط",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    ],
    condition: "new",
    negotiable: false,
    cod: true,
    featured: true,
    views: 678,
    createdAt: "2024-12-05",
    seller: sellers[5],
    description:
      "Samsung Galaxy S24 Ultra neuf, toutes couleurs disponibles. S Pen inclus, garantie officielle Samsung 2 ans.",
    descriptionAr:
      "سامسونج جالاكسي S24 الترا جديد، جميع الألوان متوفرة. يشمل قلم S Pen، ضمان سامسونج الرسمي سنتين.",
    attributes: { marque: "Samsung", modele: "Galaxy S24 Ultra", stockage: "512 GB", stylet: "S Pen inclus", garantie: "2 ans" },
  },
  {
    id: "l7",
    title: "Moto Honda CB300 2022 - Très bon état",
    titleAr: "دراجة هوندا CB300 2022 - حالة جيدة جداً",
    price: 380000,
    category: "vehicles",
    subcategory: "motos",
    location: "El Mina, Nouakchott",
    locationAr: "الميناء، نواكشوط",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    ],
    condition: "used",
    negotiable: true,
    cod: false,
    featured: false,
    views: 445,
    createdAt: "2024-11-25",
    seller: sellers[0],
    description:
      "Honda CB300 en très bon état, entretien régulier, 18 000 km. Idéale pour la ville. Vendue avec papiers à jour.",
    descriptionAr:
      "هوندا CB300 في حالة جيدة جداً، صيانة منتظمة، 18,000 كم. مثالية للمدينة. تُباع مع الوثائق سارية.",
    attributes: { marque: "Honda", modele: "CB300", annee: "2022", km: "18 000 km", carburant: "Essence" },
  },
  {
    id: "l8",
    title: "MacBook Pro M3 14 pouces — Neuf scellé",
    titleAr: "ماك بوك برو M3 14 بوصة - جديد مختوم",
    price: 480000,
    category: "phones",
    subcategory: "laptops",
    location: "Tevragh-Zeina, Nouakchott",
    locationAr: "تيفرغ زينة، نواكشوط",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    ],
    condition: "new",
    negotiable: false,
    cod: true,
    featured: true,
    views: 956,
    createdAt: "2024-12-06",
    seller: sellers[1],
    description:
      "MacBook Pro M3 Pro, 14 pouces, 18GB RAM, 512GB SSD. Neuf scellé, garantie Apple 1 an. Clavier international.",
    descriptionAr:
      "ماك بوك برو M3 برو، 14 بوصة، 18 جيجا رام، 512 جيجا SSD. جديد مختوم، ضمان آبل سنة. لوحة مفاتيح دولية.",
    attributes: { marque: "Apple", modele: "MacBook Pro M3", ram: "18 GB", stockage: "512 GB SSD", ecran: "14 pouces Liquid Retina XDR" },
  },
];

export const reviews: Review[] = [
  {
    id: "r1", sellerId: "s1", listingId: "l1",
    author: "Sidi Ould Mohamed", authorAr: "سيدي ولد محمد",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sidi",
    rating: 5, date: "2024-11-20",
    comment: "Excellent vendeur, très honnête. La voiture était exactement comme décrit. Je recommande vivement.",
    commentAr: "بائع ممتاز وصادق جداً. السيارة كانت بالضبط كما وُصفت. أنصح به بشدة.",
  },
  {
    id: "r2", sellerId: "s1",
    author: "Ahmed Ould Brahim", authorAr: "أحمد ولد إبراهيم",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    rating: 5, date: "2024-10-15",
    comment: "Transaction rapide et sécurisée. Mohamed est très professionnel et réactif.",
    commentAr: "معاملة سريعة وآمنة. محمد محترف جداً وسريع الاستجابة.",
  },
  {
    id: "r3", sellerId: "s1",
    author: "Fatima Mint Bilal", authorAr: "فاطمة بنت بلال",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FatimaBilal",
    rating: 4, date: "2024-09-08",
    comment: "Bon vendeur, la moto était en bon état. Légère négociation possible. À recommander.",
    commentAr: "بائع جيد، الدراجة كانت في حالة جيدة. تفاوض خفيف ممكن. يُنصح به.",
  },
  {
    id: "r4", sellerId: "s2",
    author: "Bah Ould Cheikh", authorAr: "باه ولد شيخ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bah",
    rating: 5, date: "2024-11-28",
    comment: "Téléphone reçu en parfait état, emballage d'origine. Livraison rapide. Très satisfait !",
    commentAr: "الهاتف وصل في حالة مثالية، تغليف أصلي. توصيل سريع. راضٍ جداً!",
  },
  {
    id: "r5", sellerId: "s2",
    author: "Moctar Ould Salem", authorAr: "مختار ولد سالم",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Moctar",
    rating: 4, date: "2024-10-30",
    comment: "Bonne vendeuse, produit conforme. Réponse rapide aux messages.",
    commentAr: "بائعة جيدة، المنتج مطابق. ردود سريعة على الرسائل.",
  },
];

export const notifications: Notification[] = [
  {
    id: "n1", type: "offer", read: false,
    titleFr: "Nouvelle offre reçue", titleAr: "عرض جديد",
    bodyFr: "Sidi vous offre 4 500 000 MRU pour votre Land Cruiser",
    bodyAr: "سيدي يعرض عليك 4,500,000 أوقية للاند كروزر",
    createdAt: "2024-12-06T14:32:00",
    link: "/messages",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sidi",
  },
  {
    id: "n2", type: "message", read: false,
    titleFr: "Message de Fatimetou", titleAr: "رسالة من فاطمة",
    bodyFr: "Est-ce que l'iPhone est encore disponible ?",
    bodyAr: "هل الآيفون لا يزال متوفراً؟",
    createdAt: "2024-12-06T12:10:00",
    link: "/messages",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
  },
  {
    id: "n3", type: "review", read: true,
    titleFr: "Nouvel avis 5 étoiles ⭐", titleAr: "تقييم جديد 5 نجوم ⭐",
    bodyFr: "Ahmed vous a laissé un avis 5 étoiles",
    bodyAr: "أحمد أعطاك تقييم 5 نجوم",
    createdAt: "2024-12-05T09:00:00",
    link: "/profil/s1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
  },
  {
    id: "n4", type: "system", read: true,
    titleFr: "Votre annonce est en ligne !", titleAr: "إعلانك أصبح منشوراً!",
    bodyFr: "Land Cruiser 2018 est maintenant visible par tous",
    bodyAr: "لاند كروزر 2018 أصبح مرئياً للجميع",
    createdAt: "2024-12-01T08:00:00",
    link: "/annonce/l1",
  },
];

export const categories = [
  {
    id: "vehicles",
    name: "Véhicules",
    nameAr: "السيارات",
    count: 1284,
    color: "#1B2A4A",
    gradient: "from-night-500 to-night-700",
    subcategories: [
      { id: "cars", nameFr: "Voitures", nameAr: "سيارات", count: 842 },
      { id: "motos", nameFr: "Motos & Scooters", nameAr: "دراجات", count: 213 },
      { id: "trucks", nameFr: "Camions & Utilitaires", nameAr: "شاحنات", count: 156 },
      { id: "parts", nameFr: "Pièces détachées", nameAr: "قطع غيار", count: 73 },
    ],
    filters: ["marque", "modele", "annee", "km", "carburant", "boite"],
  },
  {
    id: "phones",
    name: "Téléphones & Électronique",
    nameAr: "الهواتف والإلكترونيات",
    count: 3421,
    color: "#2D6A4F",
    gradient: "from-islamic-400 to-islamic-600",
    subcategories: [
      { id: "smartphones", nameFr: "Smartphones", nameAr: "هواتف ذكية", count: 1876 },
      { id: "laptops", nameFr: "Laptops & Tablettes", nameAr: "لابتوب وأجهزة لوحية", count: 654 },
      { id: "accessories", nameFr: "Accessoires", nameAr: "ملحقات", count: 521 },
      { id: "appliances", nameFr: "Électroménager", nameAr: "أجهزة كهربائية", count: 370 },
    ],
    filters: ["marque", "modele", "stockage", "etat", "couleur"],
  },
  {
    id: "fashion",
    name: "Mode & Vêtements",
    nameAr: "الأزياء والملابس",
    count: 5632,
    color: "#C9A84C",
    gradient: "from-sand-400 to-sand-600",
    subcategories: [
      { id: "traditional", nameFr: "Tenues traditionnelles", nameAr: "الملابس التقليدية", count: 2341 },
      { id: "men", nameFr: "Homme", nameAr: "رجالي", count: 1234 },
      { id: "women", nameFr: "Femme", nameAr: "نسائي", count: 1456 },
      { id: "children", nameFr: "Enfants", nameAr: "أطفال", count: 601 },
    ],
    filters: ["taille", "couleur", "matiere", "etat", "genre"],
  },
  {
    id: "beauty",
    name: "Beauté & Bien-être",
    nameAr: "الجمال والعناية",
    count: 2198,
    color: "#9B4B8A",
    gradient: "from-purple-500 to-purple-700",
    subcategories: [
      { id: "perfume", nameFr: "Parfums & Encens", nameAr: "عطور وبخور", count: 876 },
      { id: "skincare", nameFr: "Soins visage & corps", nameAr: "العناية بالبشرة", count: 654 },
      { id: "haircare", nameFr: "Soins capillaires", nameAr: "العناية بالشعر", count: 421 },
      { id: "henna", nameFr: "Henné & traditions", nameAr: "الحناء والتقاليد", count: 247 },
    ],
    filters: ["type", "certification", "origine", "typePeau"],
  },
  {
    id: "home",
    name: "Maison & Mobilier",
    nameAr: "المنزل والأثاث",
    count: 1876,
    color: "#B8922E",
    gradient: "from-sand-500 to-sand-700",
    subcategories: [
      { id: "furniture", nameFr: "Meubles", nameAr: "أثاث", count: 876 },
      { id: "decoration", nameFr: "Décoration", nameAr: "ديكور", count: 543 },
      { id: "kitchen", nameFr: "Cuisine", nameAr: "المطبخ", count: 321 },
      { id: "rugs", nameFr: "Tapis & Coussins", nameAr: "سجاد ووسائد", count: 136 },
    ],
    filters: ["matiere", "couleur", "places", "etat"],
  },
  {
    id: "jobs",
    name: "Emploi & Services",
    nameAr: "العمل والخدمات",
    count: 943,
    color: "#1B7A6A",
    gradient: "from-teal-600 to-teal-800",
    subcategories: [
      { id: "jobs", nameFr: "Offres d'emploi", nameAr: "وظائف", count: 432 },
      { id: "services", nameFr: "Services", nameAr: "خدمات", count: 321 },
      { id: "freelance", nameFr: "Freelance", nameAr: "عمل حر", count: 190 },
    ],
    filters: ["secteur", "type", "salaire"],
  },
  {
    id: "animals",
    name: "Animaux",
    nameAr: "الحيوانات",
    count: 412,
    color: "#8B5E3C",
    gradient: "from-amber-700 to-amber-900",
    subcategories: [
      { id: "camels", nameFr: "Chameaux & Dromadaires", nameAr: "إبل وجمال", count: 187 },
      { id: "sheep", nameFr: "Moutons & Chèvres", nameAr: "أغنام وماعز", count: 143 },
      { id: "birds", nameFr: "Oiseaux", nameAr: "طيور", count: 82 },
    ],
    filters: ["espece", "age", "race"],
  },
  {
    id: "other",
    name: "Autres",
    nameAr: "أخرى",
    count: 2341,
    color: "#4A5568",
    gradient: "from-gray-500 to-gray-700",
    subcategories: [
      { id: "sports", nameFr: "Sport & Loisirs", nameAr: "رياضة وترفيه", count: 876 },
      { id: "books", nameFr: "Livres & Éducation", nameAr: "كتب وتعليم", count: 654 },
      { id: "baby", nameFr: "Bébé & Puériculture", nameAr: "أطفال ومستلزمات", count: 811 },
    ],
    filters: ["type", "etat"],
  },
];

/* Stats du tableau de bord vendeur */
export const sellerStats = {
  totalViews: 12847,
  totalListings: 12,
  activeListings: 9,
  totalMessages: 47,
  totalOffers: 23,
  totalSales: 8,
  revenue: 1240000,
  viewsChart: [320, 410, 380, 520, 490, 610, 580, 720, 690, 810, 750, 920],
  months: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-MR", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price);
};

export const timeAgo = (date: string, locale: "fr" | "ar"): string => {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  const days = Math.floor(diff / 86400);
  const hours = Math.floor(diff / 3600);

  if (locale === "ar") {
    if (days > 7) return `منذ ${Math.floor(days / 7)} أسابيع`;
    if (days > 0) return `منذ ${days} أيام`;
    if (hours > 0) return `منذ ${hours} ساعات`;
    return "منذ قليل";
  }
  if (days > 7) return `il y a ${Math.floor(days / 7)} semaines`;
  if (days > 0) return `il y a ${days} jours`;
  if (hours > 0) return `il y a ${hours} heures`;
  return "à l'instant";
};

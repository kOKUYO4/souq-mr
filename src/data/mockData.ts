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
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
    ],
    condition: "used",
    negotiable: true,
    cod: false,
    featured: true,
    views: 1247,
    createdAt: "2024-12-01",
    seller: sellers[0],
    description:
      "Magnifique Land Cruiser en excellent état, entretenu régulièrement, première main.",
    descriptionAr: "لاند كروزر رائع في حالة ممتازة، صيانة منتظمة، يد أولى.",
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
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
    ],
    condition: "new",
    negotiable: false,
    cod: true,
    featured: true,
    views: 892,
    createdAt: "2024-12-03",
    seller: sellers[1],
    description: "iPhone 15 Pro Max tout neuf, sous blister, garantie 1 an.",
    descriptionAr: "آيفون 15 برو ماكس جديد، في علبته، ضمان سنة.",
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
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    condition: "new",
    negotiable: true,
    cod: true,
    featured: true,
    views: 543,
    createdAt: "2024-12-02",
    seller: sellers[2],
    description:
      "Daraa traditionnelle mauritanienne, broderie main, tissu haut de gamme.",
    descriptionAr: "دراعة تقليدية موريتانية، تطريز يدوي، قماش فاخر.",
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
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    ],
    condition: "new",
    negotiable: true,
    cod: true,
    featured: false,
    views: 334,
    createdAt: "2024-12-04",
    seller: sellers[3],
    description: "Collection exclusive d'ouds mauritaniens, bakhour et musc.",
    descriptionAr: "مجموعة حصرية من العود الموريتاني والبخور والمسك.",
  },
  {
    id: "l5",
    title: "Salon marocain/mauritanien — Canapé 6 places",
    titleAr: "صالون مغربي/موريتاني - أريكة 6 أشخاص",
    price: 85000,
    category: "home",
    subcategory: "furniture",
    location: "Tevragh-Zeina, Nouakchott",
    locationAr: "تيفرغ زينة، نواكشوط",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    ],
    condition: "used",
    negotiable: true,
    cod: false,
    featured: false,
    views: 221,
    createdAt: "2024-11-28",
    seller: sellers[4],
    description:
      "Beau salon style mauritanien, très bon état, peu utilisé, tissu velours.",
    descriptionAr: "صالون جميل على الطراز الموريتاني، حالة ممتازة، قماش مخمل.",
  },
  {
    id: "l6",
    title: "Samsung Galaxy S24 Ultra — 512GB",
    titleAr: "سامسونج جالاكسي S24 الترا - 512 جيجا",
    price: 165000,
    category: "phones",
    subcategory: "smartphones",
    location: "Ryad, Nouakchott",
    locationAr: "الرياض، نواكشوط",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80",
    ],
    condition: "new",
    negotiable: false,
    cod: true,
    featured: true,
    views: 678,
    createdAt: "2024-12-05",
    seller: sellers[5],
    description: "Samsung Galaxy S24 Ultra neuf, toutes couleurs disponibles.",
    descriptionAr: "سامسونج جالاكسي S24 الترا جديد، جميع الألوان متوفرة.",
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
  },
  {
    id: "phones",
    name: "Téléphones & Électronique",
    nameAr: "الهواتف والإلكترونيات",
    count: 3421,
    color: "#2D6A4F",
    gradient: "from-islamic-400 to-islamic-600",
  },
  {
    id: "fashion",
    name: "Mode & Vêtements",
    nameAr: "الأزياء والملابس",
    count: 5632,
    color: "#C9A84C",
    gradient: "from-sand-400 to-sand-600",
  },
  {
    id: "beauty",
    name: "Beauté & Bien-être",
    nameAr: "الجمال والعناية",
    count: 2198,
    color: "#9B4B8A",
    gradient: "from-purple-500 to-purple-700",
  },
  {
    id: "home",
    name: "Maison & Mobilier",
    nameAr: "المنزل والأثاث",
    count: 1876,
    color: "#B8922E",
    gradient: "from-sand-500 to-sand-700",
  },
  {
    id: "jobs",
    name: "Emploi & Services",
    nameAr: "العمل والخدمات",
    count: 943,
    color: "#1B7A6A",
    gradient: "from-teal-600 to-teal-800",
  },
  {
    id: "animals",
    name: "Animaux",
    nameAr: "الحيوانات",
    count: 412,
    color: "#8B5E3C",
    gradient: "from-amber-700 to-amber-900",
  },
  {
    id: "other",
    name: "Autres",
    nameAr: "أخرى",
    count: 2341,
    color: "#4A5568",
    gradient: "from-gray-500 to-gray-700",
  },
];

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

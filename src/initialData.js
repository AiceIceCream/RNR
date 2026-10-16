export const INITIAL_PRODUCTS = [
  {
    id: 'prod-01',
    title: 'Maroon Gold Athletic Dri-FIT Tee',
    category: 'Tees',
    price: 680,
    fabric: 'Micro-Interlock Moisture-Wicking Poly-Spandex',
    badge: 'BESTSELLER',
    colors: [
      { name: 'Maroon Gold', hex: '#831843' },
      { name: 'Black', hex: '#111827' },
      { name: 'White', hex: '#F9FAFB' }
    ],
    image: '/Photocards/1.jpeg',
    images: ['/Photocards/1.jpeg'],
    stock: { S: 12, M: 18, L: 14, XL: 6 },
    description: 'High-ventilation athletic raglan tee engineered for rapid sweat evaporation and zero seam friction during intense athletic activity.',
    reviews: [
      {
        id: 'rev-1',
        name: 'Alfonso Reyes',
        email: 'alfonso.r@gmail.com',
        rating: 5,
        date: '2026-10-10',
        comment: 'Super lightweight and breathable for intense workouts. Dries within 20 minutes after training.'
      }
    ]
  },
  {
    id: 'prod-02',
    title: 'Royal Blue Dynamic Speed Performance Tee',
    category: 'Tees',
    price: 680,
    fabric: 'Breathable Aero-Mesh Poly-Blend',
    badge: 'HOT ITEM',
    colors: [
      { name: 'Royal Blue', hex: '#1E40AF' },
      { name: 'Navy Blue', hex: '#1E3A8A' },
      { name: 'Black', hex: '#111827' }
    ],
    image: '/Photocards/2.jpeg',
    images: ['/Photocards/2.jpeg'],
    stock: { S: 10, M: 15, L: 12, XL: 4 },
    description: 'Vibrant royal blue moisture-dispersing tee designed for intense training and tropical outdoor workouts.',
    reviews: [
      {
        id: 'rev-2',
        name: 'Alyssa Tan',
        email: 'alyssa.t@outlook.com',
        rating: 5,
        date: '2026-10-04',
        comment: 'The Royal Blue is vibrant and the fit is true to size. High quality fabric.'
      }
    ]
  },
  {
    id: 'prod-03',
    title: 'Crimson Red Apex Velocity Training Tee',
    category: 'Tees',
    price: 680,
    fabric: 'Cool-Touch Ergonomic Stretch Poly',
    badge: 'POPULAR',
    colors: [
      { name: 'Crimson Red', hex: '#DC2626' },
      { name: 'White', hex: '#F9FAFB' },
      { name: 'Black', hex: '#111827' }
    ],
    image: '/Photocards/3.jpeg',
    images: ['/Photocards/3.jpeg'],
    stock: { S: 8, M: 14, L: 10, XL: 5 },
    description: 'Dynamic crimson performance garment with reinforced hem and targeted shoulder airflow channels.',
    reviews: []
  },
  {
    id: 'prod-04',
    title: 'Giro Pro Aero High-Performance Cycling Socks',
    category: 'Accessories',
    price: 320,
    fabric: 'Compression Ribbed Nylon-Elastane Blend',
    badge: 'ACCESSORY',
    colors: [
      { name: 'Multi-Color Neon', hex: '#EC4899' },
      { name: 'Stealth Black', hex: '#111827' },
      { name: 'Pure White', hex: '#F9FAFB' }
    ],
    image: '/Photocards/4.jpeg',
    images: ['/Photocards/4.jpeg'],
    stock: { S: 15, M: 25, L: 20, XL: 10 },
    description: 'High-cuff aero cycling socks with mid-foot arch compression band and graduated moisture-transport fibers.',
    reviews: []
  },
  {
    id: 'prod-05',
    title: 'JPOJPO Kinetic Gear Racing Cycling Jersey',
    category: 'Tees',
    price: 1150,
    fabric: 'Italian UPF 50+ Grid Waffle Aero Knit',
    badge: 'PRO CYCLING',
    colors: [
      { name: 'Mechanical Charcoal', hex: '#374151' },
      { name: 'Midnight Navy', hex: '#1E3A8A' },
      { name: 'Crimson', hex: '#DC2626' }
    ],
    image: '/Photocards/5.jpeg',
    images: ['/Photocards/5.jpeg'],
    stock: { S: 6, M: 10, L: 8, XL: 3 },
    description: 'Aerodynamic pro-fit cycling jersey featuring 3 reinforced rear cargo pockets, SBS full zipper, and anti-slip silicone waist gripper.',
    reviews: []
  },
  {
    id: 'prod-06',
    title: 'JPOJPO Cyan Velocity Mechanical Jersey',
    category: 'Tees',
    price: 1150,
    fabric: 'Hex-Aero Quick-Drying Polyester',
    badge: 'AERO FIT',
    colors: [
      { name: 'Cyan Blue', hex: '#06B6D4' },
      { name: 'Matte Black', hex: '#111827' },
      { name: 'White', hex: '#F9FAFB' }
    ],
    image: '/Photocards/6.jpeg',
    images: ['/Photocards/6.jpeg'],
    stock: { S: 5, M: 9, L: 7, XL: 2 },
    description: 'Precision-cut cycling jersey with futuristic mechanical graphics and micro-perforated side panels for optimal heat ventilation.',
    reviews: []
  },
  {
    id: 'prod-07',
    title: 'JPOJPO Sunset Aero Mountain Cycling Jersey',
    category: 'Tees',
    price: 1200,
    fabric: 'Ultra-Light Breathable Microfiber',
    badge: 'LIMITED EDITION',
    colors: [
      { name: 'Sunset Gradient', hex: '#F97316' },
      { name: 'Dusk Violet', hex: '#7C3AED' },
      { name: 'Black', hex: '#111827' }
    ],
    image: '/Photocards/7.jpeg',
    images: ['/Photocards/7.jpeg'],
    stock: { S: 7, M: 12, L: 9, XL: 4 },
    description: 'Eye-catching twilight gradient jersey crafted for endurance gravel rides and highway pace-lines.',
    reviews: []
  },
  {
    id: 'prod-08',
    title: 'JPOJPO Horizon Summit Geometric Jersey',
    category: 'Tees',
    price: 1200,
    fabric: 'Ventilated Jacquard Poly Knit',
    badge: 'PREMIUM',
    colors: [
      { name: 'Horizon Gold', hex: '#D97706' },
      { name: 'Midnight Black', hex: '#111827' },
      { name: 'Teal', hex: '#0D9488' }
    ],
    image: '/Photocards/8.jpeg',
    images: ['/Photocards/8.jpeg'],
    stock: { S: 4, M: 8, L: 6, XL: 3 },
    description: 'Low-drag aerodynamic racing cut with reflective safety accents and thermo-regulated chest fabric.',
    reviews: []
  },
  {
    id: 'prod-09',
    title: 'JPOJPO Flora Fairy Butterfly Aero Jersey',
    category: 'Tees',
    price: 1250,
    fabric: 'Silky Smooth UPF 40+ Polyester Interlock',
    badge: 'ARTIST SERIES',
    colors: [
      { name: 'Flora Multi-Color', hex: '#EC4899' },
      { name: 'Lavender', hex: '#A855F7' },
      { name: 'White', hex: '#F9FAFB' }
    ],
    image: '/Photocards/9.jpeg',
    images: ['/Photocards/9.jpeg'],
    stock: { S: 6, M: 11, L: 8, XL: 4 },
    description: 'Vibrant botanical and butterfly motif printed with eco-friendly Italian sublimation inks that will never fade or crack.',
    reviews: []
  },
  {
    id: 'prod-10',
    title: 'JPOJPO Desert Mirage Aero Cycling Jersey',
    category: 'Tees',
    price: 1250,
    fabric: 'CoolMax Aero-Knit Performance Poly',
    badge: 'NEW ARRIVAL',
    colors: [
      { name: 'Desert Coral', hex: '#FB7185' },
      { name: 'Ocean Cyan', hex: '#0EA5E9' },
      { name: 'Sand Khaki', hex: '#D97706' }
    ],
    image: '/Photocards/10.jpeg',
    images: ['/Photocards/10.jpeg'],
    stock: { S: 8, M: 13, L: 10, XL: 5 },
    description: 'Engineered for high-temperature rides, combining lightweight sun protection with rapid sweat evaporation.',
    reviews: []
  },
  {
    id: 'prod-11',
    title: 'Aero UV Botanical Jungle Arm Compression Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'Ice-Silk Cooling Lycra with UPF 50+ UV Defense',
    badge: 'UV PROTECTION',
    colors: [
      { name: 'Jungle Green', hex: '#15803D' },
      { name: 'Stealth Black', hex: '#111827' },
      { name: 'Ice White', hex: '#F9FAFB' }
    ],
    image: '/Photocards/11.jpeg',
    images: ['/Photocards/11.jpeg'],
    stock: { S: 14, M: 20, L: 18, XL: 8 },
    description: 'Instant cooling effect upon contact with skin. Ergonomic anti-slip silicone bicep grip prevents riding down.',
    reviews: []
  },
  {
    id: 'prod-12',
    title: 'Aero UV Mechanical Cyan Gear Compression Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'Second-Skin Elastic Spandex Poly',
    badge: 'BEST VALUE',
    colors: [
      { name: 'Mechanical Cyan', hex: '#06B6D4' },
      { name: 'Carbon Black', hex: '#1F2937' },
      { name: 'Steel Gray', hex: '#64748B' }
    ],
    image: '/Photocards/12.jpeg',
    images: ['/Photocards/12.jpeg'],
    stock: { S: 10, M: 16, L: 14, XL: 6 },
    description: 'Mechanical gear aesthetic with 4-way graduated compression to support blood circulation and fight forearm fatigue.',
    reviews: []
  },
  {
    id: 'prod-13',
    title: 'Aero UV Crimson Mecha Arm Compression Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'High-Density UV-Shielding Lycra',
    badge: 'POPULAR',
    colors: [
      { name: 'Crimson Mecha', hex: '#DC2626' },
      { name: 'Midnight Black', hex: '#111827' },
      { name: 'Ruby', hex: '#991B1B' }
    ],
    image: '/Photocards/13.jpeg',
    images: ['/Photocards/13.jpeg'],
    stock: { S: 12, M: 18, L: 15, XL: 7 },
    description: 'Futuristic robotics print with seamless flatlock stitching to prevent skin irritation on long rides.',
    reviews: []
  },
  {
    id: 'prod-14',
    title: 'Aero UV Sakura Blossom Floral Arm Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'Ultra-Cooling Stretch Polyester Interlock',
    badge: 'FLORAL SERIES',
    colors: [
      { name: 'Sakura Pink', hex: '#F472B6' },
      { name: 'Pearl White', hex: '#F9FAFB' },
      { name: 'Charcoal', hex: '#374151' }
    ],
    image: '/Photocards/14.jpeg',
    images: ['/Photocards/14.jpeg'],
    stock: { S: 15, M: 22, L: 18, XL: 8 },
    description: 'Graceful Japanese sakura artwork providing comprehensive solar protection for cycling, running, and driving.',
    reviews: []
  },
  {
    id: 'prod-15',
    title: 'Aero UV Solar Flare Mechanical Arm Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'Breathable Moisture-Wicking Cooling Lycra',
    badge: 'HOT ITEM',
    colors: [
      { name: 'Solar Amber', hex: '#D97706' },
      { name: 'Jet Black', hex: '#111827' },
      { name: 'White', hex: '#F9FAFB' }
    ],
    image: '/Photocards/15.jpeg',
    images: ['/Photocards/15.jpeg'],
    stock: { S: 11, M: 17, L: 13, XL: 5 },
    description: 'Bright solar flare cybernetic artwork designed for maximum road visibility and daytime sun deflection.',
    reviews: []
  },
  {
    id: 'prod-16',
    title: 'Aero UV Neo-Graffiti Street Arm Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'Fast-Drying UV Defending Stretch Poly',
    badge: 'URBAN EDITION',
    colors: [
      { name: 'Graffiti Multi', hex: '#8B5CF6' },
      { name: 'Street Black', hex: '#111827' },
      { name: 'White', hex: '#F9FAFB' }
    ],
    image: '/Photocards/16.jpeg',
    images: ['/Photocards/16.jpeg'],
    stock: { S: 9, M: 15, L: 12, XL: 4 },
    description: 'Expressive streetwear graffiti graphics with cooling weave that activates when moistened by perspiration.',
    reviews: []
  },
  {
    id: 'prod-17',
    title: 'Aero UV Oriental Dragon Tattoo Arm Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'Silky Smooth Compression Microfiber',
    badge: 'TATTOO ART',
    colors: [
      { name: 'Dragon Ink Black', hex: '#111827' },
      { name: 'Crimson Tint', hex: '#B91C1C' },
      { name: 'Grey Mist', hex: '#6B7280' }
    ],
    image: '/Photocards/17.jpeg',
    images: ['/Photocards/17.jpeg'],
    stock: { S: 13, M: 19, L: 16, XL: 6 },
    description: 'Classic Eastern dragon illustrative tattoo styling combined with modern UV 50+ athletic defense.',
    reviews: []
  },
  {
    id: 'prod-18',
    title: 'Aero UV Peony Floral UV Arm Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'Breathable 4-Way Stretch Cooling Fabric',
    badge: 'FLORAL SERIES',
    colors: [
      { name: 'Peony Rose', hex: '#FB7185' },
      { name: 'Cream White', hex: '#FEF3C7' },
      { name: 'Black', hex: '#111827' }
    ],
    image: '/Photocards/18.jpeg',
    images: ['/Photocards/18.jpeg'],
    stock: { S: 12, M: 20, L: 15, XL: 7 },
    description: 'Rich peony botanical art, delivering cooling compression and 99% ultraviolet ray blocking.',
    reviews: []
  },
  {
    id: 'prod-19',
    title: 'Aero UV Cyberpunk Grid Compression Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'Second-Skin UPF 50+ Compression Poly',
    badge: 'CYBER SERIES',
    colors: [
      { name: 'Neon Purple', hex: '#A855F7' },
      { name: 'Matrix Black', hex: '#111827' },
      { name: 'Cyber Cyan', hex: '#06B6D4' }
    ],
    image: '/Photocards/19.jpeg',
    images: ['/Photocards/19.jpeg'],
    stock: { S: 10, M: 16, L: 12, XL: 5 },
    description: 'Digital grid aesthetic with non-chafing construction for riders, runners, and outdoor sports enthusiasts.',
    reviews: []
  },
  {
    id: 'prod-20',
    title: 'Aero UV Royal Lotus Botanical Arm Sleeves',
    category: 'Accessories',
    price: 380,
    fabric: 'Cool-Touch High Elasticity Microfiber',
    badge: 'BOTANICAL',
    colors: [
      { name: 'Royal Lotus Blue', hex: '#2563EB' },
      { name: 'Black Velvet', hex: '#111827' },
      { name: 'White Silk', hex: '#F9FAFB' }
    ],
    image: '/Photocards/20.jpeg',
    images: ['/Photocards/20.jpeg'],
    stock: { S: 14, M: 21, L: 17, XL: 8 },
    description: 'Elegant lotus blossom illustration with high elasticity to accommodate various arm circumferences without pinching.',
    reviews: []
  }
];

export const SHIPPING_RATES = {
  standard_delivery: {
    label: 'Standard Courier Dispatch (J&T Express / LBC)',
    fee: 80,
  },
  express_delivery: {
    label: 'Express Air Dispatch (Priority Air Cargo)',
    fee: 150,
  },
};

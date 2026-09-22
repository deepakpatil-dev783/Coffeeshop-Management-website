// Seeded initial state for fallback and Mongo initialization
export const initialMenu = [
  {
    id: 'm1',
    name: 'Caramel Macchiato',
    category: 'Coffee',
    price: 5.45,
    description: 'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and topped with caramel drizzle.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    availability: true,
    isPopular: true,
    prepTime: '4-6 mins'
  },
  {
    id: 'm2',
    name: 'Artisan Espresso Double',
    category: 'Coffee',
    price: 3.90,
    description: 'Rich, full-bodied concentrated shot of dark roasted Ethiopian coffee beans with thick golden crema.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    availability: true,
    isPopular: true,
    prepTime: '2-3 mins'
  },
  {
    id: 'm3',
    name: 'Velvet Flat White',
    category: 'Coffee',
    price: 4.99,
    description: 'Smooth micro-foamed whole milk poured over double shot ristretto with silky latte art.',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    availability: true,
    isPopular: false,
    prepTime: '3-5 mins'
  },
  {
    id: 'm4',
    name: 'Matcha Green Tea Latte',
    category: 'Tea',
    price: 5.29,
    description: 'Ceremonial grade Japanese Uji matcha whisked to perfection with oat milk and subtle agave sweetness.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    availability: true,
    isPopular: true,
    prepTime: '4-5 mins'
  },
  {
    id: 'm5',
    name: 'Earl Grey Reserve',
    category: 'Tea',
    price: 4.29,
    description: 'Organic Ceylon black tea infused with natural Italian bergamot orange and blue cornflowers.',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    availability: true,
    isPopular: false,
    prepTime: '3-4 mins'
  },
  {
    id: 'm6',
    name: 'Iced Cold Brew Vanilla Foam',
    category: 'Cold Drinks',
    price: 5.79,
    description: 'Slow 24-hour steep cold brew served over ice and crowned with velvety sweet cream cold foam.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    availability: true,
    isPopular: true,
    prepTime: '3 mins'
  },
  {
    id: 'm7',
    name: 'Belgian Chocolate Croissant',
    category: 'Snacks',
    price: 4.49,
    description: 'Flaky, buttery multi-layered puff pastry filled with dark Belgian chocolate chunks.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    availability: true,
    isPopular: true,
    prepTime: '2 mins'
  },
  {
    id: 'm8',
    name: 'Avocado Sourdough Toast',
    category: 'Snacks',
    price: 8.99,
    description: 'Smashed organic avocado, chili flakes, microgreens, and poached egg on toasted sourdough.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    availability: true,
    isPopular: false,
    prepTime: '8-10 mins'
  },
  {
    id: 'm9',
    name: 'Tiramisu Classico',
    category: 'Desserts',
    price: 6.99,
    description: 'Traditional Italian espresso-soaked ladyfingers with whipped mascarpone and cocoa powder.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    availability: true,
    isPopular: true,
    prepTime: '3 mins'
  },
  {
    id: 'm10',
    name: 'New York Cheesecake',
    category: 'Desserts',
    price: 6.49,
    description: 'Rich and creamy dense cheesecake with graham cracker crust and wild blueberry reduction.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    availability: true,
    isPopular: false,
    prepTime: '3 mins'
  }
];

export const initialTables = [
  { tableNumber: 1, capacity: 2, status: 'Occupied', section: 'Window Bay 1' },
  { tableNumber: 2, capacity: 2, status: 'Available', section: 'Window Bay 2' },
  { tableNumber: 3, capacity: 4, status: 'Reserved', section: 'Main Lounge' },
  { tableNumber: 4, capacity: 4, status: 'Occupied', section: 'Main Lounge' },
  { tableNumber: 5, capacity: 6, status: 'Available', section: 'VIP Terrace' },
  { tableNumber: 6, capacity: 2, status: 'Cleaning', section: 'Corner Cozy' },
  { tableNumber: 7, capacity: 4, status: 'Available', section: 'Garden Patio' },
  { tableNumber: 8, capacity: 8, status: 'Reserved', section: 'Executive Suite' }
];

export const initialOrders = [
  {
    orderId: 'BB-9041',
    customerName: 'Sophia Reynolds',
    customerEmail: 'sophia@example.com',
    customerPhone: '+1 555-0192',
    orderType: 'Dine-in',
    tableNumber: 1,
    items: [
      { menuItemId: 'm1', name: 'Caramel Macchiato', price: 5.49, quantity: 2 },
      { menuItemId: 'm7', name: 'Belgian Chocolate Croissant', price: 4.49, quantity: 1 }
    ],
    subtotal: 15.47,
    tax: 0.77,
    discount: 0,
    totalAmount: 16.24,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    orderStatus: 'Preparing',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    orderId: 'BB-9042',
    customerName: 'Alexander Wright',
    customerEmail: 'alex@example.com',
    customerPhone: '+1 555-0821',
    orderType: 'Takeaway',
    tableNumber: null,
    items: [
      { menuItemId: 'm6', name: 'Iced Cold Brew Vanilla Foam', price: 5.79, quantity: 1 },
      { menuItemId: 'm9', name: 'Tiramisu Classico', price: 6.99, quantity: 1 }
    ],
    subtotal: 12.78,
    tax: 0.64,
    discount: 1.00,
    totalAmount: 12.42,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI / QR',
    orderStatus: 'Ready',
    createdAt: new Date(Date.now() - 28 * 60000).toISOString()
  },
  {
    orderId: 'BB-9043',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@example.com',
    customerPhone: '+1 555-0433',
    orderType: 'Dine-in',
    tableNumber: 4,
    items: [
      { menuItemId: 'm3', name: 'Velvet Flat White', price: 4.99, quantity: 2 },
      { menuItemId: 'm8', name: 'Avocado Sourdough Toast', price: 8.99, quantity: 2 }
    ],
    subtotal: 27.96,
    tax: 1.40,
    discount: 2.00,
    totalAmount: 27.36,
    paymentStatus: 'Paid',
    paymentMethod: 'Apple Pay',
    orderStatus: 'Confirmed',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  }
];

export const initialReservations = [
  {
    id: 'res-101',
    customerName: 'Dr. Michael Vance',
    customerEmail: 'vance@clinic.org',
    customerPhone: '+1 555-4920',
    tableNumber: 3,
    date: new Date().toISOString().split('T')[0],
    time: '18:30',
    guests: 4,
    status: 'Confirmed',
    specialRequests: 'Anniversary celebration with flowers on table'
  },
  {
    id: 'res-102',
    customerName: 'Jessica Alba',
    customerEmail: 'jessica@studio.com',
    customerPhone: '+1 555-7721',
    tableNumber: 8,
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 6,
    status: 'Confirmed',
    specialRequests: 'Quiet area for business dinner'
  }
];

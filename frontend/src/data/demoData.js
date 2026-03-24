// ============================================================
// ReValue - Central Demo Dataset
// ============================================================

export const demoPosts = [
    {
        _id: 'p1', title: 'Clean PET Plastic Bottles', category: 'plastic', condition: 'Washed & Sorted',
        quantity: '50 kg', weight: 50, price: '₹12/kg', priceMin: 10, priceMax: 14,
        location: 'Koramangala, Bengaluru', pincode: '560034',
        description: 'Bulk PET bottles, thoroughly washed and compressed. Ready for pickup.',
        image: 'https://images.unsplash.com/photo-1611284446314-60a5840ce3d2?auto=format&fit=crop&q=80&w=400',
        createdBy: { _id: 'u1', name: 'Priya Sharma', role: 'individual', rating: 4.7 },
        postedAt: '2025-03-08', status: 'available', aiTag: 'plastic'
    },
    {
        _id: 'p2', title: 'Office Paper Waste Bundle', category: 'paper', condition: 'Dry & Bundled',
        quantity: '120 kg', weight: 120, price: '₹8/kg', priceMin: 7, priceMax: 10,
        location: 'HSR Layout, Bengaluru', pincode: '560102',
        description: 'Office paper waste, shredded and bundled. No food contamination.',
        image: 'https://images.unsplash.com/photo-1595278148419-3549e3e3bdf5?auto=format&fit=crop&q=80&w=400',
        createdBy: { _id: 'u2', name: 'Rajan Mehta', role: 'individual', rating: 4.9 },
        postedAt: '2025-03-07', status: 'available', aiTag: 'paper'
    },
    {
        _id: 'p3', title: 'Old Laptops & Motherboards', category: 'ewaste', condition: 'Non-working',
        quantity: '8 units', weight: 9, price: '₹120/kg', priceMin: 100, priceMax: 150,
        location: 'Electronic City, Bengaluru', pincode: '560100',
        description: 'Non-functional laptops, PCBs, RAM sticks. Data wiped.',
        image: 'https://images.unsplash.com/photo-1550083395-65abdb20b606?auto=format&fit=crop&q=80&w=400',
        createdBy: { _id: 'u3', name: 'Amit Kumar', role: 'individual', rating: 4.5 },
        postedAt: '2025-03-06', status: 'requested', aiTag: 'ewaste'
    },
    {
        _id: 'p4', title: 'Scrap Aluminum Cans', category: 'metal', condition: 'Crushed',
        quantity: '35 kg', weight: 35, price: '₹90/kg', priceMin: 80, priceMax: 100,
        location: 'Whitefield, Bengaluru', pincode: '560066',
        description: 'Aluminum beverage cans, well crushed and packed.',
        image: 'https://images.unsplash.com/photo-1572205336214-41d89bf44a7f?auto=format&fit=crop&q=80&w=400',
        createdBy: { _id: 'u4', name: 'Sunita Das', role: 'individual', rating: 4.3 },
        postedAt: '2025-03-05', status: 'available', aiTag: 'metal'
    },
    {
        _id: 'p5', title: 'Glass Bottles - Mixed Colors', category: 'glass', condition: 'Intact',
        quantity: '60 kg', weight: 60, price: '₹4/kg', priceMin: 3, priceMax: 5,
        location: 'Indiranagar, Bengaluru', pincode: '560038',
        description: 'Mixed glass bottles from restaurant. Rinsed and sorted by color.',
        image: 'https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&q=80&w=400',
        createdBy: { _id: 'u5', name: 'Rahul Verma', role: 'individual', rating: 4.6 },
        postedAt: '2025-03-04', status: 'available', aiTag: 'glass'
    },
    {
        _id: 'p6', title: 'HDPE Plastic Drums', category: 'plastic', condition: 'Cleaned',
        quantity: '200 kg', weight: 200, price: '₹18/kg', priceMin: 16, priceMax: 20,
        location: 'Peenya, Bengaluru', pincode: '560058',
        description: 'Large HDPE industrial drums, cleaned and ready for recycling.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400',
        createdBy: { _id: 'u6', name: 'Deepa Nair', role: 'individual', rating: 4.8 },
        postedAt: '2025-03-03', status: 'available', aiTag: 'plastic'
    },
];

export const demoCollectors = [
    {
        _id: 'c1', name: 'GreenHub Collectors', type: 'organization', hubLocation: 'Peenya Industrial Area',
        areasServed: ['Koramangala', 'HSR Layout', 'Indiranagar'],
        materialsAccepted: ['plastic', 'paper', 'glass'],
        rating: 4.8, reviewCount: 89, totalCollected: 8420, totalSpent: 124000,
        contact: '+91 98765 43210', verified: true
    },
    {
        _id: 'c2', name: 'Ravi Scrap Services', type: 'individual', hubLocation: 'Whitefield',
        areasServed: ['Electronic City', 'Whitefield'],
        materialsAccepted: ['metal', 'ewaste'],
        rating: 4.5, reviewCount: 42, totalCollected: 3200, totalSpent: 89000,
        contact: '+91 87654 32109', verified: true
    },
];

export const demoOrganizations = [
    {
        _id: 'o1', name: 'EcoCycle Industries Pvt Ltd', industryType: 'Plastic Recycling',
        gstin: 'ECHCL12345', verified: true, materialsNeeded: ['plastic', 'metal'],
        monthlyDemand: '50 Tons', location: 'Bommasandra Industrial Area', contact: '+91 80 2783 4456'
    },
];

export const demoTransactions = [
    { _id: 't1', postTitle: 'Clean PET Plastic Bottles', buyer: 'GreenHub', seller: 'Priya Sharma', weight: '50 kg', amount: '₹600', date: '2025-03-09', status: 'completed' },
    { _id: 't2', postTitle: 'Office Paper Waste Bundle', buyer: 'GreenHub', seller: 'Rajan Mehta', weight: '120 kg', amount: '₹960', date: '2025-03-08', status: 'completed' },
    { _id: 't3', postTitle: 'Old Laptops & Motherboards', buyer: 'Ravi Scrap', seller: 'Amit Kumar', weight: '9 kg', amount: '₹1080', date: '2025-03-06', status: 'in-transit' },
];

export const demoFeedback = [
    { _id: 'f1', reviewer: 'GreenHub Collectors', target: 'u1', rating: 5, comment: 'Excellent quality materials, very well sorted. Highly recommended!', date: '2025-03-09' },
    { _id: 'f2', reviewer: 'Priya Sharma', target: 'c1', rating: 5, comment: 'Very professional collector, picked up on time and paid fair price.', date: '2025-03-09' },
    { _id: 'f3', reviewer: 'Ravi Scrap Services', target: 'u3', rating: 4, comment: 'Good e-waste. Labels were still on. Minor issue with sorting.', date: '2025-03-06' },
];

export const dashboardStats = {
    totalWasteListed: '812 Tons',
    totalWasteRecycled: '621 Tons',
    activeCollectors: 1247,
    partnerIndustries: 93,
    totalUsers: 5420,
    co2Saved: '1,380 Tons',
    trends: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        listed: [42, 58, 74, 65, 88, 95, 120],
        recycled: [30, 44, 60, 52, 70, 78, 98],
    },
    categoryShare: {
        labels: ['Plastic', 'Paper', 'Metal', 'E-Waste', 'Glass', 'Organic'],
        data: [38, 22, 18, 11, 7, 4],
    },
    monthlyRevenue: [120000, 145000, 165000, 155000, 188000, 202000, 235000],
};

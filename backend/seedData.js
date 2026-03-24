const mongoose = require("mongoose");
const Post = require("./models/Post");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const dummyUsers = [
    { name: "Rahul Verma", email: "rahul@example.com", password: "password123", role: "individual" },
    { name: "Deepa Nair", email: "deepa@example.com", password: "password123", role: "individual" },
    { name: "Amit Shah", email: "amit@example.com", password: "password123", role: "individual" },
    { name: "GreenHub Connect", email: "collector@example.com", password: "password123", role: "collector" },
    { name: "EcoCycle Industries", email: "industry@example.com", password: "password123", role: "industry" }
];

const dummyPosts = [
    {
        title: 'Clean PET Plastic Bottles', category: 'plastic', condition: 'Washed & Sorted',
        weight: 50, priceMin: 10, priceMax: 14,
        location: 'Koramangala, Bengaluru', pincode: '560034',
        description: 'Bulk PET bottles, thoroughly washed and compressed. Ready for pickup.',
        image: 'https://images.unsplash.com/photo-1611284446314-60a5840ce3d2?auto=format&fit=crop&q=80&w=400',
        creatorEmail: "rahul@example.com"
    },
    {
        title: 'Office Paper Waste Bundle', category: 'paper', condition: 'Dry & Bundled',
        weight: 120, priceMin: 7, priceMax: 10,
        location: 'HSR Layout, Bengaluru', pincode: '560102',
        description: 'Office paper waste, shredded and bundled. No food contamination.',
        image: 'https://images.unsplash.com/photo-1595278148419-3549e3e3bdf5?auto=format&fit=crop&q=80&w=400',
        creatorEmail: "deepa@example.com"
    },
    {
        title: 'Old Laptops & Motherboards', category: 'ewaste', condition: 'Non-working',
        weight: 9, priceMin: 100, priceMax: 150,
        location: 'Electronic City, Bengaluru', pincode: '560100',
        description: 'Non-functional laptops, PCBs, RAM sticks. Data wiped.',
        image: 'https://images.unsplash.com/photo-1550083395-65abdb20b606?auto=format&fit=crop&q=80&w=400',
        creatorEmail: "amit@example.com"
    },
    {
        title: 'Scrap Aluminum Cans', category: 'metal', condition: 'Crushed',
        weight: 35, priceMin: 80, priceMax: 100,
        location: 'Whitefield, Bengaluru', pincode: '560066',
        description: 'Aluminum beverage cans, well crushed and packed.',
        image: 'https://images.unsplash.com/photo-1572205336214-41d89bf44a7f?auto=format&fit=crop&q=80&w=400',
        creatorEmail: "rahul@example.com"
    },
    {
        title: 'Glass Bottles - Mixed Colors', category: 'glass', condition: 'Intact',
        weight: 60, priceMin: 3, priceMax: 5,
        location: 'Indiranagar, Bengaluru', pincode: '560038',
        description: 'Mixed glass bottles from restaurant. Rinsed and sorted by color.',
        image: 'https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&q=80&w=400',
        creatorEmail: "deepa@example.com"
    },
    {
        title: 'HDPE Plastic Drums', category: 'plastic', condition: 'Cleaned',
        weight: 200, priceMin: 16, priceMax: 20,
        location: 'Peenya, Bengaluru', pincode: '560058',
        description: 'Large HDPE industrial drums, cleaned and ready for recycling.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400',
        creatorEmail: "amit@example.com"
    }
];

mongoose.connect("mongodb://localhost:27017/revalueDB").then(async () => {
    console.log("Connected to MongoDB...");

    // Clear existing
    await Post.deleteMany({});
    // We don't necessarily want to delete all users if the tester is using one, 
    // but for a clean seed of post owners, it's better.
    // await User.deleteMany({}); 

    console.log("Cleared old posts.");

    // Ensure dummy users exist
    const userMap = {};
    for (const u of dummyUsers) {
        let user = await User.findOne({ email: u.email });
        if (!user) {
            const hashedPassword = await bcrypt.hash(u.password, 10);
            user = new User({ ...u, password: hashedPassword });
            await user.save();
            console.log(`Created user: ${u.name}`);
        }
        userMap[u.email] = user._id;
    }

    const postsToInsert = dummyPosts.map(p => {
        const { creatorEmail, ...postData } = p;
        return {
            ...postData,
            createdBy: userMap[creatorEmail],
            status: "available",
            unit: "kg",
        };
    });

    await Post.insertMany(postsToInsert);
    console.log(`Successfully seeded ${postsToInsert.length} posts with distinct owners!`);

    process.exit(0);
}).catch(err => {
    console.error("Failed to seed data:", err);
    process.exit(1);
});

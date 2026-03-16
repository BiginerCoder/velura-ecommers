require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const connectDB = require("./db");

const products = [
  {
    name: "Velura Linen Blazer",
    description:
      "A tailored linen blazer crafted for effortless elegance. Perfect for office days or casual evenings, this piece drapes beautifully and breathes well in warm weather.",
    price: 3499,
    comparePrice: 4999,
    category: "Men",
    subCategory: "Blazers",
    tags: ["bestseller", "new"],
    stock: 40,
    sku: "VLB-001",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=600&q=80",
    ],
    variants: [
      { label: "Size", options: ["S", "M", "L", "XL", "XXL"] },
      { label: "Color", options: ["Beige", "Navy", "Olive"] },
    ],
    ratings: { average: 4.7, count: 128 },
    shippingInfo: "Ships in 2–3 business days. Free delivery on orders above ₹999.",
    metaTitle: "Velura Linen Blazer | Men's Premium Blazers",
    metaDescription: "Shop the Velura Linen Blazer — tailored fit, premium linen fabric.",
  },
  {
    name: "Velura Wrap Midi Dress",
    description:
      "A flowy wrap-style midi dress in soft georgette. Features a V-neckline, adjustable tie waist, and a graceful hemline. Ideal for brunches, date nights, and everything in between.",
    price: 2199,
    comparePrice: 3200,
    category: "Women",
    subCategory: "Dresses",
    tags: ["bestseller", "trending"],
    stock: 55,
    sku: "VWD-002",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    ],
    variants: [
      { label: "Size", options: ["XS", "S", "M", "L", "XL"] },
      { label: "Color", options: ["Dusty Rose", "Emerald", "Ivory"] },
    ],
    ratings: { average: 4.8, count: 214 },
    shippingInfo: "Ships in 1–2 business days. Free delivery on orders above ₹999.",
    metaTitle: "Velura Wrap Midi Dress | Women's Dresses",
    metaDescription: "Elegant wrap midi dress in georgette — flattering fit for every occasion.",
  },
  {
    name: "Urban Cargo Joggers",
    description:
      "Relaxed-fit cargo joggers with multiple utility pockets. Made from cotton-blend fabric for all-day comfort. Whether you're running errands or chilling at home, these have you covered.",
    price: 1799,
    comparePrice: 2499,
    category: "Men",
    subCategory: "Bottoms",
    tags: ["new"],
    stock: 80,
    sku: "UCJ-003",
    images: [
      "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=600&q=80",
    ],
    variants: [
      { label: "Size", options: ["S", "M", "L", "XL", "XXL"] },
      { label: "Color", options: ["Khaki", "Black", "Olive"] },
    ],
    ratings: { average: 4.5, count: 97 },
    shippingInfo: "Ships in 2–3 business days.",
    metaTitle: "Urban Cargo Joggers | Men's Bottoms",
    metaDescription: "Comfortable cargo joggers with utility pockets — casual wear redefined.",
  },
  {
    name: "Structured Tote Bag",
    description:
      "A minimalist structured tote in vegan leather. Spacious interior with a zip pocket and magnetic closure. Carries your essentials with effortless style.",
    price: 2799,
    comparePrice: 3999,
    category: "Accessories",
    subCategory: "Bags",
    tags: ["bestseller"],
    stock: 30,
    sku: "STB-004",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    ],
    variants: [
      { label: "Color", options: ["Camel", "Black", "White"] },
    ],
    ratings: { average: 4.6, count: 183 },
    shippingInfo: "Ships in 1–2 business days. Free delivery on orders above ₹999.",
    metaTitle: "Structured Tote Bag | Velura Accessories",
    metaDescription: "Minimalist vegan leather tote bag — your perfect everyday carry.",
  },
  {
    name: "Linen Co-ord Set",
    description:
      "A matching linen shirt and trouser set in breathable fabric. The relaxed silhouette and earthy tones make it summer-ready. Wear together or style individually.",
    price: 3999,
    comparePrice: 5500,
    category: "Women",
    subCategory: "Co-ords",
    tags: ["trending", "new"],
    stock: 45,
    sku: "LCS-005",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    ],
    variants: [
      { label: "Size", options: ["XS", "S", "M", "L"] },
      { label: "Color", options: ["Sand", "Terracotta", "White"] },
    ],
    ratings: { average: 4.9, count: 76 },
    shippingInfo: "Ships in 2–3 business days.",
    metaTitle: "Linen Co-ord Set | Women's Sets | Velura",
    metaDescription: "Breathable linen co-ord set — effortlessly stylish for summer days.",
  },
  {
    name: "Classic White Sneakers",
    description:
      "Clean, minimal white sneakers with a cushioned sole. Versatile enough to pair with everything — denim, dresses, or tailored trousers. A wardrobe staple.",
    price: 2499,
    comparePrice: 3200,
    category: "Footwear",
    subCategory: "Sneakers",
    tags: ["bestseller"],
    stock: 60,
    sku: "CWS-006",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    ],
    variants: [
      { label: "Size (UK)", options: ["5", "6", "7", "8", "9", "10", "11"] },
    ],
    ratings: { average: 4.7, count: 302 },
    shippingInfo: "Ships in 1–2 business days. Free delivery on orders above ₹999.",
    metaTitle: "Classic White Sneakers | Velura Footwear",
    metaDescription: "Timeless white sneakers with cushioned comfort — a wardrobe essential.",
  },
  {
    name: "Oversized Graphic Tee",
    description:
      "Dropped shoulders, relaxed fit, and a bold graphic print on 100% cotton. Wear it tucked, knotted, or loose — it's that easy.",
    price: 999,
    comparePrice: 1499,
    category: "Unisex",
    subCategory: "T-Shirts",
    tags: ["trending"],
    stock: 120,
    sku: "OGT-007",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    ],
    variants: [
      { label: "Size", options: ["S", "M", "L", "XL", "XXL"] },
      { label: "Color", options: ["White", "Black", "Slate Blue"] },
    ],
    ratings: { average: 4.4, count: 435 },
    shippingInfo: "Ships in 1–2 business days.",
    metaTitle: "Oversized Graphic Tee | Velura Unisex",
    metaDescription: "Bold oversized graphic tee in 100% cotton — casual made cool.",
  },
  {
    name: "Wide-Brim Sun Hat",
    description:
      "A woven straw hat with a wide brim and ribbon tie. UV-protective and stylish — your go-to summer accessory for the beach, brunch, or a garden day.",
    price: 1299,
    comparePrice: 1800,
    category: "Accessories",
    subCategory: "Hats",
    tags: ["new"],
    stock: 35,
    sku: "WBH-008",
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80",
    ],
    variants: [
      { label: "Color", options: ["Natural", "Black", "Ivory"] },
    ],
    ratings: { average: 4.5, count: 59 },
    shippingInfo: "Ships in 2–3 business days.",
    metaTitle: "Wide-Brim Sun Hat | Velura Accessories",
    metaDescription: "UV-protective woven sun hat — style meets sun care.",
  },
];

const seedDB = async () => {
  await connectDB();
  await Product.deleteMany({});
  await User.deleteMany({ role: "admin" });

  await Product.insertMany(products);
  console.log("✅ Products seeded");

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    firstName: "Admin",
    lastName: "Velura",
    email: "admin@velura.com",
    password: hashedPassword,
    role: "admin",
    phoneNumber: "9999999999",
  });
  console.log("✅ Admin user created: admin@velura.com / admin123");

  mongoose.connection.close();
  console.log("✅ Seed complete.");
};

seedDB().catch(console.error);

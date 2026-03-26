const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

const resolveCategoryFilter = (rawCategory) => {
  if (!rawCategory) return {};

  const normalized = String(rawCategory).trim().toLowerCase();
  if (!normalized || normalized === "all") return {};

  if (
    [
      "smartphone",
      "smartphones",
      "mobile",
      "mobiles",
      "phone",
      "phones",
    ].includes(normalized)
  ) {
    return {
      category: { $regex: "smart ?phones?|mobiles?|phones?", $options: "i" },
    };
  }

  return { category: { $regex: `^${normalized}$`, $options: "i" } };
};

// @desc  Get all products (with search/filter)
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const category = resolveCategoryFilter(req.query.category);
  const filter = { ...keyword, ...category };

  const sortOption = req.query.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc  Get featured products
// @route GET /api/products/featured
// @access Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).limit(8);
  res.json(products);
});

// @desc  Get product by ID
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc  Create product (admin)
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name || "Sample Product",
    description: req.body.description || "Sample description",
    price: req.body.price || 0,
    originalPrice: req.body.originalPrice || 0,
    image:
      req.body.image ||
      "https://placehold.co/400x400/1a1a2e/7c3aed?text=Product",
    category: req.body.category || "Electronics",
    brand: req.body.brand || "NeoCart",
    stock: req.body.stock || 10,
    featured: req.body.featured || false,
    badge: req.body.badge || "",
  });
  const created = await product.save();
  res.status(201).json(created);
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product removed" });
});

// @desc  Review product
// @route POST /api/products/:id/review
// @access Private
const reviewProduct = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString(),
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }
  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: "Review added" });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  reviewProduct,
};

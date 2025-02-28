const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const Firm = require('../models/Firm');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set filename with timestamp and original extension
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
      const { productName, price, category, bestSeller, description } = req.body;
      const firmId = req.params.firmId;
      
      console.log("Firm ID Received:", firmId);

      const firm = await Firm.findById(firmId);
      if (!firm) {
          return res.status(404).json({ message: "Firm not found" });
      }

      const image = req.file ? req.file.filename : undefined;

      const product = new Product({
          productName,
          price,
          category,
          bestSeller,
          description,
          image,
          firm: firm._id
      });

      const savedProduct = await product.save();
      console.log("Product Saved:", savedProduct);

      // ✅ Update the Firm's products array
      firm.products.push(savedProduct._id);
      await firm.save();

      res.status(201).json(savedProduct);
  } catch (error) {
      console.error("Error Saving Product:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    console.log("Fetching Products for Firm ID:", firmId);

    const firm = await Firm.findById(firmId).populate('products'); // ✅ Populate products
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    const restaurantName = firm.firmName;
    const products = await Product.find({ firm: firmId });
    res.status(200).json({ restaurantName, products });
    
  } catch (error) {
    console.error("Error Fetching Products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

 const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }}


module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById };

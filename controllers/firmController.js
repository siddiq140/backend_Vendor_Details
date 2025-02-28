const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path'); // Add path module

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set filename with timestamp and original extension
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage }); // Define the upload variable using multer

// Add Firm function
const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body; // Extract data from the body

    const image = req.file ? req.file.filename : undefined; // Get image filename if available

    // Assuming vendorId is in the request object
    const vendor = await Vendor.findById(req.vendorId); // Get vendor by ID from req.vendorId
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" }); // Return response if vendor not found
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id, // Use vendor ID
    });

    const savedFirm = await firm.save(); // Save the firm to the database
    vendor.firm.push(savedFirm)
    await vendor.save()

    res.status(200).json({ message: "Firm added successfully" }); // Success response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" }); // Error response
  }
};
const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deleteProduct = await Firm.findByIdAndDelete(firmId);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }}

// Export addFirm function with multer middleware for handling image uploads
module.exports = { addFirm: [upload.single('image'), addFirm],deleteFirmById }; // multer middleware to handle image upload

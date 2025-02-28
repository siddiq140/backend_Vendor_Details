const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Define routes for product
router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products', productController.getProductByFirm);

router.get('uploads/:imagename', (req, res) => {
    const imageName = req.params.imagename
    res.sentHeader('Content-Type', 'image/jpeg');
    res.sendFile(Path.join(__dirname, '../uploads', imageName));
});

router.delete('/delete-product/:productId', productController.deleteProductById);
module.exports = router;
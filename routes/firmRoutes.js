const express =require('express');
const firmControllers = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');


const router =express.Router()
router.post('/add-firm',verifyToken,firmControllers.addFirm)

router.get('uploads/:imagename', (req, res) => {
    const imageName = req.params.imagename
    res.sentHeader('Content-Type', 'image/jpeg');
    res.sendFile(Path.join(__dirname, '../uploads', imageName));
});
router.delete('/:firmId',firmControllers.deleteFirmById)

module.exports = router;
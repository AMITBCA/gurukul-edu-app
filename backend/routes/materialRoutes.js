const express = require('express');
const router = express.Router();
const {
    uploadMaterial,
    getBatchMaterials,
    deleteMaterial
} = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/', protect, authorize('teacher', 'admin'), upload.single('file'), uploadMaterial);
router.get('/batch/:batchId', protect, getBatchMaterials);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteMaterial);

module.exports = router;

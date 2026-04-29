const Material = require('../models/Material');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload new study material
// @route   POST /api/materials
// @access  Private/Teacher,Admin
exports.uploadMaterial = async (req, res) => {
    try {
        const { title, description, batchId, fileType } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const material = await Material.create({
            title,
            description,
            batchId,
            teacherId: req.user.id,
            fileUrl: req.file.path,
            fileType,
            publicId: req.file.filename // This is the public_id provided by CloudinaryStorage
        });

        // Emit real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('material:new', { batchId, title, fileType });
        }

        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all materials for a batch
// @route   GET /api/materials/batch/:batchId
// @access  Private
exports.getBatchMaterials = async (req, res) => {
    try {
        const materials = await Material.find({ 
            batchId: req.params.batchId 
        }).populate('teacherId', 'name').sort({ createdAt: -1 });

        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private/Teacher,Admin
exports.deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Check if user is the teacher who uploaded or an admin
        if (material.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(material.publicId);

        await material.deleteOne();
        res.json({ message: 'Material removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

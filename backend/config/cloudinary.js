const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key';

let upload;

if (isCloudinaryConfigured) {
    console.log('[Cloudinary] Using Cloudinary storage');
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            let folder = 'gurukul/others';
            let resource_type = 'auto';

            if (file.mimetype.startsWith('image/')) {
                folder = 'gurukul/images';
                resource_type = 'image';
            } else if (file.mimetype === 'application/pdf') {
                folder = 'gurukul/documents';
                resource_type = 'raw';
            } else if (file.mimetype.startsWith('video/')) {
                folder = 'gurukul/videos';
                resource_type = 'video';
            }

            return {
                folder,
                resource_type,
                public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
            };
        }
    });
    upload = multer({ storage });
} else {
    console.log('[Cloudinary] Not configured — using local disk storage for uploads');
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const diskStorage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadsDir),
        filename: (req, file, cb) => {
            const safeName = file.originalname.replace(/\s+/g, '_');
            cb(null, `${Date.now()}-${safeName}`);
        }
    });

    // Override req.file.path & req.file.filename to match cloudinary format
    const diskUpload = multer({ 
        storage: diskStorage,
        limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
    });

    // Wrap to inject fileUrl path and publicId in cloudinary-compatible format
    upload = {
        single: (fieldName) => (req, res, next) => {
            diskUpload.single(fieldName)(req, res, (err) => {
                if (err) return next(err);
                if (req.file) {
                    // Inject a URL that can be served from the backend
                    const fileUrl = `${process.env.FRONTEND_URL?.replace(':5173', ':5000') || 'http://localhost:5000'}/uploads/${req.file.filename}`;
                    req.file.path = fileUrl;
                    req.file.filename = req.file.filename;
                }
                next();
            });
        }
    };
}

module.exports = { cloudinary, upload };

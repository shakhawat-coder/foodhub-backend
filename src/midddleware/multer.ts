import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../lib/cloudinary.config';
import path from 'path';
import crypto from 'crypto';

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file) => {
        // Safe file name (remove special chars and spaces)
        const fileName = path.parse(file.originalname).name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-');

        // Short unique ID (4 chars) to prevent collisions
        const shortId = crypto.randomBytes(2).toString('hex');

        // Use user name/provider info in folder if authenticated, otherwise default to meals
        // Note: Requires auth middleware to be used BEFORE upload.single/array
        const subFolder = req.user?.name?.split(' ')[0].toLowerCase() || 'meals';
        const folder = `foodhub/${subFolder}`;

        return {
            folder: folder,
            public_id: `${shortId}-${fileName}`,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        };
    },
});

// File filter to allow only images
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

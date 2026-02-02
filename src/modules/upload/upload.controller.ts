import { Request, Response } from 'express';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: result.secure_url,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload file',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

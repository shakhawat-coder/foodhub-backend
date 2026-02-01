import { Request, Response } from "express";

const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const publicId = (req.file as any).filename;

        const cleanUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;

        res.status(200).json({ 
            message: "Image uploaded successfully",
            url: cleanUrl, 
            public_id: publicId,
        });
    } catch (error: any) { 
        console.error("Upload Error:", error);
        res.status(500).json({ error: error.message || "Failed to upload image" });
    }
};

export const uploadController = {
    uploadImage,
};

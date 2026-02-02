import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../lib/cloudinary';

/**
 * Uploads a file buffer to Cloudinary.
 * @param fileBuffer The buffer of the file to upload.
 * @param folder The folder in Cloudinary to store the image.
 * @returns A promise that resolves to the Cloudinary upload response.
 */
export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string = 'uploads'
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Cloudinary upload failed: No result returned'));
                resolve(result);
            }
        );

        // Write the buffer to the stream
        uploadStream.end(fileBuffer);
    });
};

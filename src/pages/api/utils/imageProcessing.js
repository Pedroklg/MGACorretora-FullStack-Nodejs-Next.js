import cloudinary from './cloudinaryConfig';
import sharp from 'sharp';

export default async function processAndStoreImage(file, folder) {
    try {
        const resizedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800, height: 600 })
            .jpeg({ quality: 90 })
            .toBuffer();

        const base64Image = resizedImageBuffer.toString('base64');

        const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
            folder,
        });

        return result.secure_url;
    } catch (error) {
        console.error('Error processing and storing image:', error);
        throw new Error('Failed to process and store image');
    }
}

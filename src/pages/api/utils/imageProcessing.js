import cloudinary from './cloudinaryConfig';
import sharp from 'sharp';

export default async function processAndStoreImage(file, folder) {
    try {
        // Resize and compress the image
        const resizedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800, height: 600 }) // Resize to 800x600 pixels
            .jpeg({ quality: 100 }) // Compress to JPEG format with 80% quality
            .toBuffer(); // Convert to buffer

        // Convert buffer to base64
        const base64Image = resizedImageBuffer.toString('base64');

        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
            folder,
        });

        // Return the image URL
        return result.secure_url;
    } catch (error) {
        console.error('Error processing and storing image:', error);
        throw new Error('Failed to process and store image');
    }
}

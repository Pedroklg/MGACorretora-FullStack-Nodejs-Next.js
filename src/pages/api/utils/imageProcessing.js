// Function to process and store image 
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default async function processAndStoreImage(file, folder) {
    try {
        // Create a directory for storing uploaded images if it doesn't exist
        const uploadDir = `./uploads/${folder}`;
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Resize and compress the image
        const resizedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800, height: 600 }) // Resize to 800x600 pixels
            .jpeg({ quality: 80 }) // Compress to JPEG format with 80% quality
            .toBuffer(); // Convert to buffer

        // Construct a unique filename
        const filename = `${Date.now()}-${file.originalname}`;
        const imagePath = path.join(uploadDir, filename);

        // Asynchronously write the resized and compressed image to disk
        await fs.promises.writeFile(imagePath, resizedImageBuffer);

        // Construct and return the image URL
        return `/uploads/${folder}/${filename}`;
    } catch (error) {
        console.error('Error processing and storing image:', error);
        throw new Error('Failed to process and store image');
    }
}
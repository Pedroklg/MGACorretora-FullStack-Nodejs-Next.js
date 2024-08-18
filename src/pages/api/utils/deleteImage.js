import cloudinary from './cloudinaryConfig';

const extractPublicId = (url) => {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1].split('.')[0];
    return publicIdWithExtension;
};

export const deleteImageFromCloudinary = async (url) => {
    if (url) {
        const publicId = extractPublicId(url);
        await cloudinary.uploader.destroy(publicId);
    }
};

export const deleteImagesFromCloudinary = async (imageUrls) => {
    await Promise.all(imageUrls.map(async (imageUrl) => {
        await deleteImageFromCloudinary(imageUrl);
    }));
};

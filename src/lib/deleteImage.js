import cloudinary from './cloudinary';

// https://res.cloudinary.com/<cloud>/image/upload/v123/uploads/empresas/abc.jpg -> uploads/empresas/abc
export const extractPublicId = (url) => {
    const match = String(url).match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    return match ? match[1] : null;
};

const isCloudinaryUrl = (url) => {
    try {
        return new URL(url).hostname === 'res.cloudinary.com';
    } catch {
        return false;
    }
};

export const deleteImageFromCloudinary = async (url) => {
    if (!url || !isCloudinaryUrl(url)) return;
    const publicId = extractPublicId(url);
    if (publicId) {
        await cloudinary.uploader.destroy(publicId);
    }
};

export const deleteImagesFromCloudinary = async (imageUrls) => {
    await Promise.all(imageUrls.map(async (imageUrl) => {
        await deleteImageFromCloudinary(imageUrl);
    }));
};

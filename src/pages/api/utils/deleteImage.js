import cloudinary from './cloudinaryConfig';

// Função para extrair o public ID a partir da URL do Cloudinary
const extractPublicId = (url) => {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1].split('.')[0];
    return publicIdWithExtension;
};

// Função para deletar imagem do Cloudinary
export const deleteImageFromCloudinary = async (url) => {
    if (url) {
        const publicId = extractPublicId(url);
        await cloudinary.uploader.destroy(publicId);
    }
};

// Função para deletar múltiplas imagens do Cloudinary
export const deleteImagesFromCloudinary = async (imageUrls) => {
    await Promise.all(imageUrls.map(async (imageUrl) => {
        await deleteImageFromCloudinary(imageUrl);
    }));
};

import nextConnect from 'next-connect';
import multer from 'multer';
import db from '@/lib/db';
import processAndStoreImage from '@/lib/imageProcessing';
import getCurrentDate from '@/lib/getCurrentDate';
import { deleteImageFromCloudinary } from '@/lib/deleteImage';
import { requireAuth } from '@/lib/session';
import { parseId } from '@/lib/listings';

const storage = multer.memoryStorage();

const uploadFields = [
    { name: 'imagem', maxCount: 1 }, 
    { name: 'details_images', maxCount: 9 },
];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/heic', 'image/heif'];

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 10, fields: 50, fieldSize: 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
        }
    },
});

const apiRoute = nextConnect({
    onError: (err, req, res) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Arquivo inválido ou grande demais' });
        }
        console.error(err.stack);
        res.status(500).json({ error: 'Something broke!' });
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    },
});

// Só aceita uploads de quem está autenticado
const uploadMiddleware = upload.fields(uploadFields);
apiRoute.use((req, res, next) => {
    if (req.method === 'GET') return next();
    return requireAuth(() => uploadMiddleware(req, res, next))(req, res);
});

apiRoute.get(async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM imoveis ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in GET /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to fetch imóveis' });
    }
});

apiRoute.post(requireAuth(async (req, res) => {
    try {
        const {
            titulo, area_construida, area_util, aceita_permuta, tem_divida,
            motivo_da_venda, valor_pretendido, condicoes, descricao,
            estado, cidade, bairro, aluguel, comodos
        } = req.body;

        let imageUrl = null;

        if (req.files?.imagem && req.files.imagem[0]) {
            imageUrl = await processAndStoreImage(req.files.imagem[0], 'uploads/imoveis');
        }

        const details_images = req.files?.details_images || [];
        const detailsImageUrls = await Promise.all(details_images.map(async (file) => {
            return await processAndStoreImage(file, 'uploads/imoveis');
        }));

        const data_registro = getCurrentDate();

        const result = await db.query(
            'INSERT INTO imoveis (titulo, imagem, area_construida, area_util, aceita_permuta, tem_divida, motivo_da_venda, valor_pretendido, condicoes, descricao, estado, cidade, bairro, aluguel, details_images, comodos, data_registro) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *',
            [
                titulo, imageUrl, area_construida, area_util, aceita_permuta, tem_divida,
                motivo_da_venda, valor_pretendido, condicoes, descricao, estado, cidade, bairro, aluguel, detailsImageUrls, comodos, data_registro
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to create imóvel' });
    }
}));

apiRoute.put(requireAuth(async (req, res) => {
    try {
        const id = parseId(req.query.id);
        if (!id) {
            return res.status(400).json({ error: 'ID not provided' });
        }
        const {
            titulo, area_construida, area_util, aceita_permuta, tem_divida,
            motivo_da_venda, valor_pretendido, condicoes, descricao,
            estado, cidade, bairro, aluguel, comodos
        } = req.body;

        let imageUrl = req.body.imagem;
        let oldImageUrl, oldDetailsImageUrls = [];

        const result = await db.query('SELECT imagem, details_images FROM imoveis WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        oldImageUrl = result.rows[0].imagem;
        oldDetailsImageUrls = result.rows[0].details_images || [];

        // A imagem principal só muda por upload; não aceita URLs arbitrárias vindas do formulário
        if (imageUrl !== oldImageUrl) {
            imageUrl = oldImageUrl || null;
        }

        if (req.files?.imagem && req.files.imagem[0]) {
            imageUrl = await processAndStoreImage(req.files.imagem[0], 'uploads/imoveis');
        }

        const details_images = req.files?.details_images || [];
        const newDetailsImageUrls = await Promise.all(details_images.map(async (file) => {
            return await processAndStoreImage(file, 'uploads/imoveis');
        }));

        let removedImages = [];
        try {
            removedImages = JSON.parse(req.body.removed_images || '[]');
        } catch {
            return res.status(400).json({ error: 'removed_images inválido' });
        }
        // Só permite apagar imagens que realmente pertencem a este anúncio
        removedImages = Array.isArray(removedImages) ? removedImages.filter((url) => oldDetailsImageUrls.includes(url)) : [];
        const updatedDetailsImageUrls = oldDetailsImageUrls
            .filter((url) => !removedImages.includes(url))
            .concat(newDetailsImageUrls);

        const updateResult = await db.query(
            'UPDATE imoveis SET titulo = $1, imagem = $2, area_construida = $3, area_util = $4, aceita_permuta = $5, tem_divida = $6, motivo_da_venda = $7, valor_pretendido = $8, condicoes = $9, descricao = $10, estado = $11, cidade = $12, bairro = $13, aluguel = $14, details_images = $15, comodos = $16 WHERE id = $17 RETURNING *',
            [
                titulo, imageUrl, area_construida, area_util, aceita_permuta, tem_divida,
                motivo_da_venda, valor_pretendido, condicoes, descricao, estado, cidade, bairro, aluguel, updatedDetailsImageUrls, comodos, id
            ]
        );

        if (oldImageUrl && oldImageUrl !== imageUrl) {
            await deleteImageFromCloudinary(oldImageUrl);
        }

        await Promise.all(removedImages.map(async (image) => {
            await deleteImageFromCloudinary(image);
        }));

        res.status(200).json(updateResult.rows[0]);
    } catch (error) {
        console.error('Error in PUT /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to update imóvel' });
    }
}));

export const config = {
    api: {
        bodyParser: false,
    },
};

export default apiRoute;
import nextConnect from 'next-connect';
import multer from 'multer';
import db from './utils/db';
import processAndStoreImage from './utils/imageProcessing';
import getCurrentDate from './utils/getCurrentDate';
import { deleteImageFromCloudinary } from './utils/deleteImage';
import requireAuth from './utils/authMiddleware';

const storage = multer.memoryStorage();

const uploadFields = [
    { name: 'imagem', maxCount: 1 }, 
    { name: 'details_images', maxCount: 9 },
];

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

const apiRoute = nextConnect({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something broke!' });
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    },
});

apiRoute.use(upload.fields(uploadFields));

apiRoute.get(async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM imoveis');
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

        if (req.files.imagem && req.files.imagem[0]) {
            imageUrl = await processAndStoreImage(req.files.imagem[0], 'uploads/imoveis');
        }

        const details_images = req.files.details_images || [];
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

apiRoute.put(require(async (req, res) => {
    try {
        const { id } = req.query;
        const {
            titulo, area_construida, area_util, aceita_permuta, tem_divida,
            motivo_da_venda, valor_pretendido, condicoes, descricao,
            estado, cidade, bairro, aluguel, comodos
        } = req.body;

        let imageUrl = req.body.imagem;
        let oldImageUrl, oldDetailsImageUrls = [];

        const result = await db.query('SELECT imagem, details_images FROM imoveis WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            oldImageUrl = result.rows[0].imagem;
            oldDetailsImageUrls = result.rows[0].details_images || [];
        }

        if (req.files.imagem && req.files.imagem[0]) {
            imageUrl = await processAndStoreImage(req.files.imagem[0], 'uploads/imoveis');
        }

        const details_images = req.files.details_images || [];
        const newDetailsImageUrls = await Promise.all(details_images.map(async (file) => {
            return await processAndStoreImage(file, 'uploads/imoveis');
        }));

        const removedImages = JSON.parse(req.body.removed_images || '[]');
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
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
        const result = await db.query('SELECT * FROM empresas ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in GET /api/empresas:', error.message);
        res.status(500).json({ error: 'Failed to fetch empresas' });
    }
});

apiRoute.post(requireAuth(async (req, res) => {
    try {
        const {
            titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido,
            condicoes, descricao, funcionamento, sobre_imovel, bairro, aceita_permuta, tem_divida,
            estado, cidade, categoria
        } = req.body;

        let imageUrl = null;

        if (req.files?.imagem && req.files.imagem[0]) {
            imageUrl = await processAndStoreImage(req.files.imagem[0], 'uploads/empresas');
        }

        const details_images = req.files?.details_images || [];
        const detailsImageUrls = await Promise.all(details_images.map(async (file) => {
            return await processAndStoreImage(file, 'uploads/empresas');
        }));

        const data_registro = getCurrentDate();

        const result = await db.query(
            'INSERT INTO empresas (titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido, condicoes, descricao, funcionamento, sobre_imovel, bairro, aceita_permuta, tem_divida, imagem, details_images, estado, cidade, categoria, data_registro) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *',
            [
                titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido,
                condicoes, descricao, funcionamento, sobre_imovel, bairro, aceita_permuta, tem_divida,
                imageUrl, detailsImageUrls, estado, cidade, categoria, data_registro
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST /api/empresas:', error.message);
        res.status(500).json({ error: 'Failed to create empresa' });
    }
}));

apiRoute.put(requireAuth(async (req, res) => {
    try {
        const id = parseId(req.query.id);
        if (!id) {
            return res.status(400).json({ error: 'ID not provided' });
        }
        const {
            titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido,
            condicoes, descricao, funcionamento, sobre_imovel, bairro, aceita_permuta, tem_divida,
            estado, cidade, categoria
        } = req.body;

        let imageUrl = req.body.imagem;
        let oldImageUrl, oldDetailsImageUrls = [];

        const result = await db.query('SELECT imagem, details_images FROM empresas WHERE id = $1', [id]);
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
            imageUrl = await processAndStoreImage(req.files.imagem[0], 'uploads/empresas');
        }

        const details_images = req.files?.details_images || [];
        const newDetailsImageUrls = await Promise.all(details_images.map(async (file) => {
            return await processAndStoreImage(file, 'uploads/empresas');
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
            `UPDATE empresas SET titulo = $1, tempo_de_mercado = $2, funcionarios = $3, motivo_da_venda = $4, valor_pretendido = $5, condicoes = $6, descricao = $7, funcionamento = $8, sobre_imovel = $9, bairro = $10, aceita_permuta = $11, tem_divida = $12, imagem = $13, details_images = $14, estado = $15, cidade = $16, categoria = $17 WHERE id = $18 RETURNING *`,
            [
                titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido,
                condicoes, descricao, funcionamento, sobre_imovel, bairro, aceita_permuta, tem_divida,
                imageUrl, updatedDetailsImageUrls, estado, cidade, categoria, id
            ]
        );

        await Promise.all(removedImages.map(async (image) => {
            await deleteImageFromCloudinary(image);
        }));

        if (oldImageUrl && oldImageUrl !== imageUrl) {
            await deleteImageFromCloudinary(oldImageUrl);
        }

        res.status(200).json(updateResult.rows[0]);
    } catch (error) {
        console.error('Error in PUT /api/empresas:', error.message);
        res.status(500).json({ error: 'Failed to update empresa' });
    }
}));

export const config = {
    api: {
        bodyParser: false,
    },
};

export default apiRoute;

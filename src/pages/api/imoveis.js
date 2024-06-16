import nextConnect from 'next-connect';
import multer from 'multer';
import db from './utils/db';
import processAndStoreImage from './utils/imageProcessing';
import getCurrentDateBr from './utils/getCurrentDateBr';

// Configure multer storage
const storage = multer.memoryStorage(); // Store images in memory for processing

// Upload fields configuration
const uploadFields = [
    { name: 'imagem', maxCount: 1 }, // Main image
    { name: 'details_images', maxCount: 6 }, // Additional images
];

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
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

// Middleware to handle file uploads
apiRoute.use(upload.fields(uploadFields));

// GET endpoint to fetch imoveis
apiRoute.get(async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM imoveis');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in GET /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to fetch imóveis' });
    }
});

// POST endpoint to create new imovel
apiRoute.post(async (req, res) => {
    try {
        const {
            titulo, area_construida, area_util, aceita_permuta, tem_divida,
            motivo_da_venda, valor_pretendido, condicoes, descricao,
            estado, cidade, bairro, aluguel
        } = req.body;

        let imageUrl = null;

        if (req.files.imagem && req.files.imagem[0]) {
            // Process and store the main image
            imageUrl = await processAndStoreImage(req.files.imagem[0], 'uploads/imoveis');
        }

        // Process and store additional images (details_images)
        const details_images = req.files.details_images || [];
        const detailsImageUrls = await Promise.all(details_images.map(async (file) => {
            return await processAndStoreImage(file, 'uploads/imoveis');
        }));

        // Get current date
        const data_registro = getCurrentDateBr();

        // Insert data into the database
        const result = await db.query(
            'INSERT INTO imoveis (titulo, imagem, area_construida, area_util, aceita_permuta, tem_divida, motivo_da_venda, valor_pretendido, condicoes, descricao, estado, cidade, bairro, aluguel, details_images, data_registro) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *',
            [
                titulo, imageUrl, area_construida, area_util, aceita_permuta, tem_divida,
                motivo_da_venda, valor_pretendido, condicoes, descricao, estado, cidade, bairro, aluguel, detailsImageUrls, data_registro
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to create imóvel' });
    }
});

// PUT endpoint to update existing imovel
apiRoute.put(async (req, res) => {
    try {
        const { id } = req.query;
        const {
            titulo, area_construida, area_util, aceita_permuta, tem_divida,
            motivo_da_venda, valor_pretendido, condicoes, descricao,
            estado, cidade, bairro, aluguel
        } = req.body;

        let imageUrl = req.body.imagem; // Default to existing image URL

        if (req.files.imagem && req.files.imagem[0]) {
            // Process and store the new image
            imageUrl = await processAndStoreImage(req.files.imagem[0], 'uploads/imoveis');
        }

        // Process and store additional images (details_images)
        const details_images = req.files.details_images || [];
        const detailsImageUrls = await Promise.all(details_images.map(async (file) => {
            return await processAndStoreImage(file, 'uploads/imoveis');
        }));

        // Update data in the database
        const result = await db.query(
            'UPDATE imoveis SET titulo = $1, imagem = $2, area_construida = $3, area_util = $4, aceita_permuta = $5, tem_divida = $6, motivo_da_venda = $7, valor_pretendido = $8, condicoes = $9, descricao = $10, estado = $11, cidade = $12, bairro = $13, aluguel = $14, details_images = $15 WHERE id = $16 RETURNING *',
            [
                titulo, imageUrl, area_construida, area_util, aceita_permuta, tem_divida,
                motivo_da_venda, valor_pretendido, condicoes, descricao, estado, cidade, bairro, aluguel, detailsImageUrls, id
            ]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in PUT /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to update imóvel' });
    }
});

// Export API route and configuration
export const config = {
    api: {
        bodyParser: false, // Disable body parsing, so multer can handle it
    },
};

export default apiRoute;

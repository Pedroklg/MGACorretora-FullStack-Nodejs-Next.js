import nextConnect from 'next-connect';
import multer from 'multer';
import db from './utils/db';
import processAndStoreImage from './utils/imageProcessing';

// Configure multer storage
const storage = multer.memoryStorage(); // Store images in memory for processing
const upload = multer({ storage });

const apiRoute = nextConnect({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(500).end('Something broke!');
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    },
});

apiRoute.use(upload.single('imagem'));

apiRoute.get(async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM imoveis');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in GET /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to fetch imóveis' });
    }
});

apiRoute.post(async (req, res) => {
    try {
        const {
            titulo, area_construida, area_util, aceita_permuta, tem_divida,
            motivo_da_venda, valor_pretendido, condicoes, sobre_o_imovel, estado, cidade, endereco, aluguel
        } = req.body;

        let imageUrl = null;

        if (req.file) {
            // Process and store the image
            imageUrl = await processAndStoreImage(req.file, 'imoveis');
        }

        // Insert data into the database
        const result = await db.query(
            'INSERT INTO imoveis (titulo, imagem, area_construida, area_util, aceita_permuta, tem_divida, motivo_da_venda, valor_pretendido, condicoes, sobre_o_imovel, estado, cidade, endereco, aluguel) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
            [
                titulo, imageUrl, area_construida, area_util, aceita_permuta, tem_divida,
                motivo_da_venda, valor_pretendido, condicoes, sobre_o_imovel, estado, cidade, endereco, aluguel
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to create imóvel' });
    }
});

apiRoute.put(async (req, res) => {
    try {
        const { id } = req.query;
        const {
            titulo, area_construida, area_util, aceita_permuta, tem_divida,
            motivo_da_venda, valor_pretendido, condicoes, sobre_o_imovel,
            estado, cidade, endereco, aluguel
        } = req.body;

        let imageUrl = req.body.imagem; // Default to existing image URL

        if (req.file) {
            // Process and store the new image
            imageUrl = await processAndStoreImage(req.file, 'imoveis');
        }

        // Update data in the database
        const result = await db.query(
            'UPDATE imoveis SET titulo = $1, imagem = $2, area_construida = $3, area_util = $4, aceita_permuta = $5, tem_divida = $6, motivo_da_venda = $7, valor_pretendido = $8, condicoes = $9, sobre_o_imovel = $10, estado = $11, cidade = $12, endereco = $13, aluguel = $14 WHERE id = $15 RETURNING *',
            [
                titulo, imageUrl, area_construida, area_util, aceita_permuta, tem_divida,
                motivo_da_venda, valor_pretendido, condicoes, sobre_o_imovel, estado, cidade, endereco, aluguel, id
            ]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in PUT /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to update imóvel' });
    }
});

export const config = {
    api: {
        bodyParser: false, // Disable body parsing, so multer can handle it
    },
};

export default apiRoute;

import nextConnect from 'next-connect';
import multer from 'multer';
import db from './utils/db';

// Configure multer storage
const storage = multer.diskStorage({
    destination: 'public/imgImoveis',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

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

apiRoute.post(async (req, res) => {
    try {
        console.log('POST Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        const {
            titulo, area_construida, area_util, aceita_permuta, tem_divida,
            motivo_da_venda, valor_pretendido, condicoes, sobre_o_imovel, estado, cidade, endereco, aluguel
        } = req.body;

        // Construct image URL
        const imageUrl = req.file ? `/imgImoveis/${req.file.filename}` : null;

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
            motivo_da_venda, valor_pretendido, condicoes, sobre_o_imovel, estado, cidade, endereco, aluguel
        } = req.body;

        // Construct image URL
        const imageUrl = req.file ? `/imgImoveis/${req.file.filename}` : null;

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

apiRoute.delete(async (req, res) => {
    try {
        const { id } = req.query;
        await db.query('DELETE FROM imoveis WHERE id = $1', [id]);
        res.status(200).json({ message: 'Imóvel deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /api/imoveis:', error.message);
        res.status(500).json({ error: 'Failed to delete imóvel' });
    }
});

export const config = {
    api: {
        bodyParser: false, // Disable body parsing, so multer can handle it
    },
};

export default apiRoute;

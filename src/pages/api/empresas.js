import nextConnect from 'next-connect';
import multer from 'multer';
import db from './utils/db';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

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
        const result = await db.query('SELECT * FROM empresas');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in GET /api/empresas:', error.message);
        res.status(500).json({ error: 'Failed to fetch empresas' });
    }
});

apiRoute.post(async (req, res) => {
    try {
        const {
            titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido,
            condicoes, sobre_o_imovel, endereco, aceita_permuta, tem_divida,
            estado, cidade, categoria
        } = req.body;

        let imageUrl = null;

        if (req.file) {
            // Process and store the image
            imageUrl = await processAndStoreImage(req.file, 'empresas');
        }

        // Insert data into the database
        const result = await db.query(
            'INSERT INTO empresas (titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido, condicoes, sobre_o_imovel, endereco, aceita_permuta, tem_divida, imagem, estado, cidade, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
            [
                titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido,
                condicoes, sobre_o_imovel, endereco, aceita_permuta, tem_divida,
                imageUrl, estado, cidade, categoria
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST /api/empresas:', error.message);
        res.status(500).json({ error: 'Failed to create empresa' });
    }
});

apiRoute.put(async (req, res) => {
    try {
        const { id } = req.query;
        const {
            titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido,
            condicoes, sobre_o_imovel, endereco, aceita_permuta, tem_divida,
            estado, cidade, categoria
        } = req.body;

        let imageUrl = req.body.imagem; // Default to existing image URL

        if (req.file) {
            // Process and store the new image
            imageUrl = await processAndStoreImage(req.file, 'empresas');
        }

        // Update data in the database
        const result = await db.query(
            'UPDATE empresas SET titulo = $1, tempo_de_mercado = $2, funcionarios = $3, motivo_da_venda = $4, valor_pretendido = $5, condicoes = $6, sobre_o_imovel = $7, endereco = $8, aceita_permuta = $9, tem_divida = $10, imagem = $11, estado = $12, cidade = $13, categoria = $14 WHERE id = $15 RETURNING *',
            [
                titulo, tempo_de_mercado, funcionarios, motivo_da_venda, valor_pretendido,
                condicoes, sobre_o_imovel, endereco, aceita_permuta, tem_divida,
                imageUrl, estado, cidade, categoria, id
            ]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in PUT /api/empresas:', error.message);
        res.status(500).json({ error: 'Failed to update empresa' });
    }
});

// Function to process and store image 
async function processAndStoreImage(file, folder) {
    // Create a directory for storing uploaded images if it doesn't exist
    const uploadDir = `./public/img${folder}`;
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Resize and compress the image
    const resizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 600 }) // Resize to 800x600 pixels
        .jpeg({ quality: 80 }) // Compress to JPEG format with 80% quality
        .toBuffer(); // Convert to buffer

    // Store the resized and compressed image
    const filename = `${Date.now()}-${file.originalname}`;
    const imagePath = path.join(uploadDir, filename);
    fs.writeFileSync(imagePath, resizedImageBuffer);

    // Construct image URL
    return `/img${folder}/${filename}`;
}

export const config = {
    api: {
        bodyParser: false, // Disable body parsing, so multer can handle it
    },
};

export default apiRoute;

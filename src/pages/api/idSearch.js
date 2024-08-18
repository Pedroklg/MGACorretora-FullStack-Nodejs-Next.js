import nextConnect from 'next-connect';
import db from './utils/db';
import { deleteImagesFromCloudinary } from './utils/deleteImage';
import requireAuth from './utils/authMiddleware';

const apiRoute = nextConnect({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(500).end('Something broke!');
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    },
});

apiRoute.get(async (req, res) => {
    try {
        const { id } = req.query;
        let result;

        if (id) {
            const empresa = await db.query('SELECT * FROM empresas WHERE id = $1', [id]);
            const imovel = await db.query('SELECT * FROM imoveis WHERE id = $1', [id]);

            if (empresa.rows.length > 0) {
                result = { tipo: 'Empresa', item: empresa.rows[0] };
            } else if (imovel.rows.length > 0) {
                result = { tipo: 'Imovel', item: imovel.rows[0] };
            } else {
                result = { tipo: null, item: null };
            }
        } else {
            result = { error: 'ID not provided' };
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in GET /api/idSearch:', error.message);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

apiRoute.delete(requireAuth(async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'ID not provided' });
        }

        let result = await db.query('SELECT id, imagem, details_images FROM empresas WHERE id = $1', [id]);
        let tableName = 'empresas';
        let imageUrls = [];

        if (result.rowCount === 0) {
            result = await db.query('SELECT id, imagem, details_images FROM imoveis WHERE id = $1', [id]);
            tableName = 'imoveis';

            if (result.rowCount === 0) {
                return res.status(404).json({ error: `No item found with ID ${id}` });
            }
        }

        if (result.rows.length > 0) {
            const { imagem, details_images } = result.rows[0];
            if (imagem) imageUrls.push(imagem);
            if (details_images && details_images.length > 0) imageUrls = imageUrls.concat(details_images);
        }

        await deleteImagesFromCloudinary(imageUrls);

        await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);

        res.status(200).json({ message: `Item deleted successfully from ${tableName} and associated images from Cloudinary` });
    } catch (error) {
        console.error('Error in DELETE /api/idSearch:', error.message);
        res.status(500).json({ error: 'Failed to delete item and associated images' });
    }
}));

export default apiRoute;
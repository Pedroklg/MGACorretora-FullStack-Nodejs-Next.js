import nextConnect from 'next-connect';
import db from './utils/db';

// Define API route
const apiRoute = nextConnect({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(500).end('Something broke!');
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    },
});

// GET route to fetch all items (empresas and imoveis)
apiRoute.get(async (req, res) => {
    try {
        const { id } = req.query;
        let result;

        if (id) {
            // Fetch item by ID
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
        console.error('Error in GET /api/empresasImoveis:', error.message);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

// DELETE route to delete an item (empresa or imovel)
apiRoute.delete(async (req, res) => {
    try {
        const { id } = req.query;
        
        if (!id) {
            res.status(400).json({ error: 'ID not provided' });
            return;
        }

        // Determine the table name based on the request URL
        const tableName = req.url.includes('empresas') ? 'empresas' : 'imoveis';

        // Delete the item from the appropriate table using the ID
        await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);

        res.status(200).json({ message: `Item deleted successfully from ${tableName}` });
    } catch (error) {
        console.error('Error in DELETE /api/empresasImoveis:', error.message);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

export default apiRoute;

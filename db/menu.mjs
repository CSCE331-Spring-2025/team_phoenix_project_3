import { fetchData, insertData } from './utils.js';
import express from 'express';

const router = express.Router();

router.get('/items', async (req, res) => {
    const result = await fetchData('menu_items');
    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(400).send('Unable to fetch menu items.');
    }
});

export default router;

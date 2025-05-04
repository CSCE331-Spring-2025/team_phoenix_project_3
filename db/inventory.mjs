import {
	fetchData,
	insertData,
	updateData,
	deleteData,
	callSqlFunction,
} from './utils.js';
import express from 'express';

const router = express.Router();

router.get('/items', async (req, res) => {
	const result = await fetchData('inventory');
	if (result.success) {
		res.status(200).json(result.data);
	} else {
		res.status(400).send('Unable to fetch inventory items.');
	}
});

router.post('/create', async (req, res) => {
	if (!req.body.item_name) {
		return res.status(400).send('item_name is required.');
	}

	const result = await insertData('inventory', req.body);
	if (result.success) {
		res.status(201).json(result.data);
	} else {
		res.status(500).send('Unable to insert into inventory.');
	}
});

router.patch('/edit/:id', async (req, res) => {
	const result = await updateData('inventory', req.body, {
		id: parseInt(req.params.id, 10),
	});
	if (result.success) {
		res.json(result.data);
	} else {
		res.status(500).send('Failed to update item.');
	}
});

router.delete('/delete/:id', async (req, res) => {
	const result = await deleteData('inventory', { id: req.params.id }, true);
	if (result.success) {
		res.json(result.data[0]);
	} else {
		res.status(500).send('Failed to delete item.');
	}
});

router.get('/boba', async (req, res) => {
	const result = await callSqlFunction('get_boba_info');
	if (result.success) {
		const { get_boba_info } = result.data[0];
		res.status(200).json(get_boba_info);
	} else {
		res.status(500).send('Unable to get boba information.');
	}
});

router.get('/sugar', async (req, res) => {
	const result = await callSqlFunction('get_sugar_info');
	if (result.success) {
		const { get_sugar_info } = result.data[0];
		res.status(200).json(get_sugar_info);
	} else {
		res.status(500).send('Unable to get sugar information.');
	}
});

router.get('/supplier/:id', async (req, res) => {
	const result = await callSqlFunction('get_supplier', [req.params.id]);
	if (result.success) {
		const { get_supplier } = result.data[0];
		res.status(200).json(get_supplier);
	} else {
		res.status(500).send('Unable to get sugar information.');
	}
});

router.get('/suppliers', async (req, res) => {
	const result = await callSqlFunction('get_suppliers');
	if (result.success) {
		const { get_suppliers } = result.data[0];
		res.status(200).json(get_suppliers);
	} else {
		res.status(500).send('Unable to get sugar information.');
	}
});

export default router;

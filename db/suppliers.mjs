import {
	callSqlFunction,
	deleteData,
	insertData,
	updateData,
} from './utils.js';
import express from 'express';

const router = express.Router();

router.get('/all', async (req, res) => {
	const result = await callSqlFunction('get_suppliers');
	if (result.success) {
		const { get_suppliers } = result.data[0];
		res.status(200).json(get_suppliers);
	} else {
		res.status(500).send('Unable to get suppliers information.');
	}
});

router.post('/create', async (req, res) => {
	const result = await insertData('suppliers', req.body);
	if (result.success) {
		res.status(201).json(result.data);
	} else {
		res.status(500).send('Unable to insert supplier.');
	}
});

router.patch('/edit', async (req, res) => {
	// console.log('query: ' + JSON.stringify(req.query));
	const result = await updateData('suppliers', req.body, req.query);
	if (result.success) {
		res.json(result.data);
	} else {
		res.status(500).send('Failed to update supplier.');
	}
});

router.delete('/delete', async (req, res) => {
	const result = await deleteData('suppliers', req.query);
	if (result.success) {
		res.json(result.data[0]);
	} else {
		res.status(500).send('Failed to delete supplier.');
	}
});

export default router;

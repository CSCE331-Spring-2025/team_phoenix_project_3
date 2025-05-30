import { updateData, deleteData, callSqlFunction } from './utils.js';
import express from 'express';

const router = express.Router();

router.get('/items', async (req, res) => {
	const result = await callSqlFunction('get_available_menu_items');
	if (result.success) {
		const { get_available_menu_items } = result.data[0];
		res.status(200).json(get_available_menu_items);
	} else {
		res.status(400).send('Unable to fetch menu items.');
	}
});

router.get('/ingredients/:id', async (req, res) => {
	const result = await callSqlFunction('get_ingredients', [req.params.id]);
	if (result.success) {
		const { get_ingredients } = result.data[0];
		res.status(200).json(get_ingredients);
	} else {
		res.status(400).send('Unable to fetch menu items.');
	}
});

router.post('/create', async (req, res) => {
	const result = await callSqlFunction('create_menu_item', [req.body]);
	if (result.success) {
		const { create_menu_item } = result.data[0];
		res.status(201).json(create_menu_item);
	} else {
		res.status(400).send('Unable to add menu item.');
	}
});

router.patch('/edit/:id', async (req, res) => {
	const result = await callSqlFunction('edit_menu_item', [
		req.params.id,
		req.body,
	]);
	if (result.success) {
		const { edit_menu_item } = result.data[0];
		res.status(201).json(edit_menu_item);
	} else {
		res.status(400).send('Unable to edit menu item.');
	}
});

router.delete('/delete/:id', async (req, res) => {
	const result = await deleteData('menu_items', { id: req.params.id });
	if (result.success) {
		res.status(200).json(result.data[0]);
	} else {
		res.status(500).send('Failed to delete item.');
	}
});

export default router;

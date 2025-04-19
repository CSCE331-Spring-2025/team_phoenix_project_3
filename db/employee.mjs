import { callSqlFunction } from './utils.js';
import express from 'express';

const router = express.Router();

router.get('/data', async (req, res) => {
	const result = await callSqlFunction('get_employees');
	if (result.success) {
		const { get_employees } = result.data[0];
		res.status(200).json(get_employees);
	} else {
		res.status(400).send('Unable to fetch employees.');
	}
});

router.post('/create', async (req, res) => {
	const result = await callSqlFunction('create_employee', req.body);
	if (result.success) {
		const { create_employee } = result.data[0];
		res.status(200).json(create_employee);
	} else {
		res.status(500).send('Unable to insert into employees.');
	}
});

router.patch('/edit/:id', async (req, res) => {
	const result = await callSqlFunction('edit_employee', [
		req.params.id,
		req.body,
	]);
	if (result.success) {
		const { edit_employee } = result.data[0];
		res.status(200).json(edit_employee);
	} else {
		res.status(500).send('Unable to update employee.');
	}
});

router.delete('/delete/:id', async (req, res) => {
	const result = await callSqlFunction('delete_employee', [req.params.id]);
	if (result.success) {
		const { delete_employee } = result.data[0];
		res.status(200).json(delete_employee);
	} else {
		res.status(500).send('Unable to delete employee.');
	}
});

export default router;

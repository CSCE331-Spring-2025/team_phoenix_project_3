import { callSqlFunction } from './utils.js';
import express from 'express';

const router = express.Router();

// X-Report
router.get('/x', async (req, res) => {
	const { day } = req.body;
	const paramAry = day ? [day] : [];
	const result = await callSqlFunction('x_report', paramAry);
	if (result.success) {
		const { x_report } = result.data[0];
		res.status(200).json(x_report);
	} else {
		res.status(400).send('Unable to fetch menu items.');
	}
});

// Z-Report
router.get('/x', async (req, res) => {
	const { day } = req.body;
	const paramAry = day ? [day] : [];
	const result = await callSqlFunction('z_report', paramAry);
	if (result.success) {
		const { z_report } = result.data[0];
		res.status(200).json(z_report);
	} else {
		res.status(400).send('Unable to fetch menu items.');
	}
});

export default router;

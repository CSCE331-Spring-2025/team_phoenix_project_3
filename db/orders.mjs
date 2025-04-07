import {
	fetchData,
	insertData,
	deleteData,
	bulkInsert,
	callSqlFunction,
} from './utils.js';
import express from 'express';

const router = express.Router();

/**
 * Creates a new order and adds menu items to it.
 *
 * @route POST /order/create
 * @param {express.Request} req - Should contain:
 *    - body.employee_id (integer): Required. The ID of the employee placing the order.
 *    - body.menu_ids (integer[]): Required. An array of menu item IDs to include in the order.
 * @param {express.Response} res - Returns a JSON object of the newly created order:
 *    - id (integer): The order ID.
 *    - total_cost (number): Total price of all menu items in the order.
 *    - employee_id (integer): The ID of the employee who placed the order.
 *    - time_placed (string): Timestamp of when the order was created.
 *    OR sends an error if creation fails at any step.
 * @description
 *    1. Inserts a new row into the 'orders' table with the employee_id.
 *    2. Inserts each menu_id into the 'items_in_order' junction table linked to the new order.
 *    3. Returns the full order row (from the 'orders' table) on success.
 *
 * @example Call:
 *    POST ./order/create
 *    Body:
 *    {
 *      "employee_id": 2,
 *      "menu_ids": [1, 4, 7]
 *    }
 *    Response:
 *    {
 *      "id": 105,
 *      "total_cost": 18.00,
 *      "employee_id": 2,
 *      "time_placed": "2024-04-05T15:32:12.000Z"
 *    }
 *
 * @returns {void}
 */
router.post('/create', async (req, res) => {
	try {
		const { employee_id, menu_ids } = req.body;

		if (!employee_id || !Array.isArray(menu_ids)) {
			console.log(
				`Invalid input to /order/create. employee_id: ${employee_id}, menu_ids: ${menu_ids}`
			);
			return res.status(400).send('Invalid input');
		}

		const result = await insertData('orders', { employee_id });

		if (!result.success || !result.data.length) {
			return res.status(500).send('Unable to create order.');
		}

		const { id } = result.data[0];
		const insertResult = await bulkInsert(
			'items_in_order',
			'order_id',
			id,
			'menu_id',
			menu_ids
		);

		if (!insertResult.success) {
			return res.status(500).send('Unable to insert into order.');
		}

		const orderResult = await fetchData('orders', { key: 'id', value: id });
		return orderResult.success
			? res.status(200).json(orderResult.data)
			: res.status(500).send('Server-side Error');
	} catch (err) {
		console.error('POST /create failed:', err);
		res.status(500).send('Server error');
	}
});

/**
 * Gets a list of menu items in a given order.
 *
 * @route GET /order/items/:id
 * @param {express.Request} req - Should contain:
 *    - params.id (integer): Required. The ID of the order to retrieve.
 *    - body is NOT used.
 * @param {express.Response} res - Returns a JSON array of objects. Each object contains:
 *    - menu_id (integer): The ID of the menu item.
 *    - item_name (string): The name of the menu item.
 *    - price (number): The price of the menu item.
 * @description Calls the SQL function `get_order_items(order_id)` and returns all associated menu items.
 *              Each item is returned as a full JSON object. This endpoint is used to display the contents of an order.
 *
 * @example Call:
 *    GET ./order/items/120
 *    Response:
 *    [
 *      { "menu_id": 1, "item_name": "Strawberry Lemonade Smoothie", "price": 6.00 },
 *      { "menu_id": 2, "item_name": "Mango Smoothie", "price": 6.00 },
 *      { "menu_id": 6, "item_name": "Lychee Milk Tea", "price": 6.00 }
 *    ]
 *
 * @returns {void}
 */
router.get('/items/:id', async (req, res) => {
	const orderId = parseInt(req.params.id, 10);
	const result = await callSqlFunction('get_order_items', [orderId]);

	if (result.success) {
		const items = result.data[0].get_order_items;
		res.json(items);
	} else {
		res.status(400).send(`Unable to fetch order #${req.params.id}.`);
	}
});

/**
 * Deletes an order by ID.
 *
 * @route DELETE /order/delete/:id
 * @param {express.Request} req - Should contain:
 *    - params.id (integer): Required. The ID of the order to delete.
 *    - body is NOT used.
 * @param {express.Response} res - Returns a JSON array:
 *    - On success: an array with the deleted order row.
 *    - If no match: an empty array.
 * @description Permanently deletes the order with the given ID from the 'orders' table.
 *              The response will include the deleted row if it existed, or be empty if no order matched the ID.
 *
 * @example Call:
 *    DELETE ./order/delete/42
 *    Response (if found):
 *    [
 *      { "id": 42, "employee_id": 3, "order_time": "2024-04-05T14:21:00.000Z" }
 *    ]
 *
 *    Response (if not found):
 *    []
 *
 * @returns {void}
 */
router.delete('/delete/:id', async (req, res) => {
	const result = await deleteData('orders', { id: req.params.id });
	if (result.success) {
		res.json(result.data);
	} else {
		res.status(500).send(`Failed to delete order #${req.params.id}.`);
	}
});

// TODO: for manager-ui
router.get('/daily-sales', async (req, res) => {
	const result = await fetchData('daily_sales', req.body);
	if (result.success) {
		res.json(result.data);
	} else {
		res.status(400).send(`Unable to fetch order #${req.params.id}.`);
	}
});

export default router;

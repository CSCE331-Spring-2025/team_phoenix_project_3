import {
	updateData,
	deleteData,
	callSqlFunction,
	insertData,
} from './utils.js';
import express from 'express';

const router = express.Router();

/**
 * Gets all menu items from the database.
 *
 * @route GET /menu/items
 * @param {express.Request} req - No parameters or body required.
 * @param {express.Response} res - Returns a JSON array of menu item objects,
 *                                 OR sends an error if the fetch fails.
 * @description Retrieves all rows from the 'menu_items' table. Used to display the current menu.
 * @returns {void}
 */
router.get('/items', async (req, res) => {
	const result = await callSqlFunction('get_available_menu_items');
	if (result.success) {
		const { get_available_menu_items } = result.data[0];
		res.status(200).json(get_available_menu_items);
	} else {
		res.status(400).send('Unable to fetch menu items.');
	}
});

/**
 * Creates a new menu item.
 *
 * @route POST /menu/create
 * @param {express.Request} req - Should contain:
 *    - body.item_name (string): Required. The name of the new menu item.
 *    - body.price (number): Required. The price of the new item.
 * @param {express.Response} res - Returns a JSON object of the newly inserted menu item,
 *                                 OR sends an error if insertion fails.
 * @description Adds a new row to the 'menu_items' table. Used when adding items to the cafe's menu.
 *
 * @example Call:
 *    POST ./menu/create
 *    Body:
 *    {
 *      "item_name": "Peach Green Tea",
 *      "price": 5.50
 *    }
 *    Response:
 *    {
 *      "menu_id": 7,
 *      "item_name": "Peach Green Tea",
 *      "price": 5.50
 *    }
 *
 * @returns {void}
 */
router.post('/create', async (req, res) => {
	const result = await callSqlFunction('create_menu_item', [req.body]);
	if (result.success) {
		const { create_menu_item } = result.data[0];
		res.status(201).json(create_menu_item);
	} else {
		res.status(400).send('Unable to add menu item.');
	}
});

/**
 * Updates a menu item by ID.
 *
 * @route PATCH /menu/edit/:id
 * @param {express.Request} req - Should contain:
 *    - params.id (integer): Required. The ID of the menu item to update.
 *    - body (object): Required. One or more key:value pairs matching columns in the 'menu_items' table.
 *                     Common updates include 'item_name' and 'price'.
 * @param {express.Response} res - Returns a JSON array with the updated menu item,
 *                                 OR sends an error if the update fails.
 * @description Updates fields of a specific menu item in the database.
 *              Only the fields provided in the request body will be changed.
 *
 * @example Call:
 *    PATCH ./menu/edit/2
 *    Body:
 *    {
 *      "price": 6.50
 *    }
 *    Response:
 *    {
 *      "menu_id": 2,
 *      "item_name": "Mango Smoothie",
 *      "price": 6.50
 *    }
 *
 * @returns {void}
 */
router.patch('/edit/:id', async (req, res) => {
	const result = await updateData('menu_items', req.body, {
		id: req.params.id,
	});
	if (result.success) {
		res.status(200).json(result.data[0]);
	} else {
		res.status(500).send('Failed to update item.');
	}
});

/**
 * Deletes a menu item by ID.
 *
 * @route DELETE /menu/delete/:id
 * @param {express.Request} req - Should contain:
 *    - params.id (integer): Required. The ID of the menu item to delete.
 *    - body is NOT used.
 * @param {express.Response} res - Returns a JSON array with the deleted row if successful,
 *                                 OR sends an error if the deletion fails.
 * @description Permanently deletes a menu item from the 'menu_items' table.
 *              This action cannot be undone.
 *
 * @example Call:
 *    DELETE ./menu/delete/7
 *    Response:
 *    {
 *      "menu_id": 7,
 *      "item_name": "Peach Green Tea",
 *      "price": 5.50
 *    }
 *
 * @returns {void}
 */
router.delete('/delete/:id', async (req, res) => {
	const result = await deleteData('menu_items', { id: req.params.id });
	if (result.success) {
		res.status(200).json(result.data[0]);
	} else {
		res.status(500).send('Failed to delete item.');
	}
});

export default router;

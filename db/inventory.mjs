import { fetchData, insertData, updateData, deleteData } from './utils.js';
import express from 'express';

const router = express.Router();

/**
 * Retrieves all items from the inventory table.
 *
 * @route GET /inventory/items
 * @param {express.Request} req The request object. This endpoint does not use any request parameters.
 * @param {express.Response} res The response object used to send back the inventory data or an error message.
 * @returns {void} Responds with a JSON array of inventory items or an error message.
 * @description This endpoint fetches all entries from the 'inventory' table and returns them in a JSON formatted array.
 *              It responds with HTTP status 200 if the operation is successful. If the data cannot be retrieved,
 *              it sends an HTTP status 400 with an error message. This is a read-only operation and does not
 *              modify any data in the database.
 */
router.get('/items', async (req, res) => {
	const result = await fetchData('inventory');
	if (result.success) {
		res.status(200).json(result.data);
	} else {
		res.status(400).send('Unable to fetch inventory items.');
	}
});

/**
 * Creates a new inventory item and returns the added item's details.
 *
 * @route POST /inventory/create
 * @param {express.Request} req - Should contain:
 *    - item_name (string): Required. The name of the item.
 *    - supplier_id (integer): Optional. The ID of the supplier.
 *    - quantity (integer): Optional. If omitted, defaults to 0 in the database.
 * @param {express.Response} res - Will contain JSON data on success:
 *    - id (integer): The database-generated ID of the new item.
 *    - item_name (string): The name of the new item.
 *    - supplier_id (integer): The ID of the supplier, if provided.
 *    - quantity (integer): The quantity of the item, defaults to 0 if not specified.
 *    - is_deleted (boolean): Indicates if the item is marked as deleted, typically false for new items.
 *    OR sends an error message on failure.
 * @description Adds a new item to the 'inventory' table using the data provided in the request body.
 *              This endpoint is optimized for front-end usage, ensuring straightforward creation of inventory items.
 *              Returns detailed item information or an appropriate error message in case of failure.
 * @returns {void} The response is directly managed by the server, sending either the item details or an error.
 */
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

/**
 * Updates one or more fields of an inventory item by ID.
 *
 * @route PATCH /inventory/update/:id
 * @param {express.Request} req - Should contain:
 *    - params.id (integer): Required. The ID of the inventory item to update.
 *    - body (object): Required. At least one key:value pair matching a column in the 'inventory' table.
 *                     Commonly used to update 'quantity'.
 * @param {express.Response} res - Returns a JSON array containing the updated inventory row.
 *    OR sends an error if the update fails.
 * @description Updates fields for a specific inventory item in the database.
 *              Front-end can use this to modify item data such as quantity or supplier.
 *
 * @example Call:
 *    PATCH ./inventory/update/8
 *    Body:
 *    { "quantity": 50 }
 *    Response:
 *    [
 *      {
 *        "id": 8,
 *        "item_name": "Tapioca Pearls",
 *        "supplier_id": 3,
 *        "quantity": 50
 *      }
 *    ]
 *
 * @returns {void}
 */
router.patch('/update/:id', async (req, res) => {
	const result = await updateData('inventory', req.body, {
		id: parseInt(req.params.id, 10),
	});
	if (result.success) {
		res.json(result.data);
	} else {
		res.status(500).send('Failed to update item.');
	}
});

/**
 * Soft deletes an inventory item by ID.
 *
 * @route DELETE /inventory/delete/:id
 * @param {express.Request} req - Should contain:
 *    - params.id (integer): Required. The ID of the inventory item to soft delete.
 *    - body is NOT used.
 * @param {express.Response} res - Returns a JSON array containing the updated inventory row,
 *                                 where the `is_deleted` column is now true.
 *                                 OR sends an error if the delete fails.
 * @description Performs a soft delete by setting `is_deleted = true` for the given inventory item.
 *              The item remains in the database but is flagged as deleted.
 *
 * @example Call:
 *    DELETE ./inventory/delete/8
 *    Response:
 *    {
 *      "id": 8,
 *      "item_name": "Tapioca Pearls",
 *      "supplier_id": 3,
 *      "quantity": 50,
 *      "is_deleted": true
 *    }
 *
 * @returns {void}
 */
router.delete('/delete/:id', async (req, res) => {
	const result = await deleteData('inventory', { id: req.params.id }, true);
	if (result.success) {
		res.json(result.data[0]);
	} else {
		res.status(500).send('Failed to delete item.');
	}
});

export default router;

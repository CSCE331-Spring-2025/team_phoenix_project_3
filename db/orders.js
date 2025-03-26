import { query } from "./utils";

/**
 * Creates a new empty order in orders table.
 *
 * @param employee_id The current cashier on till.
 * @return The order number for the new order.
 */
export async function createNewOrder(employeeId) {
	const statement = "INSERT INTO orders (employee_id) VALUES ($1) RETURNING id";
	const { success, data, error } = await query(statement, [employeeId]);
	if (success && data.length > 0) {
		return data[0].id;
	}
	console.error("Failed to create new order:", error);
	return -1;
}

/**
 * Add item to the order.
 *
 * @param order_id The order id.
 * @param menu_id  The menu item id.
 * @return {@code boolean} wheather order was successfully updated.
 */
export async function addToOrder(orderId, menuId) {
	const statement = "INSERT INTO items_in_order (order_id, menu_id) VALUES ($1, $2)";
	const result = await query(statement, [orderId, menuId]);
	return result.success;
}

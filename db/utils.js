import { pool } from "./config";

/**
 * Send a query to the database.
 *
 * @param {*} text
 * @param {*} params
 * @returns A list of rows as column name mapped to value or sends an error message to console.
 */
export async function query(text, ...params) {
	try {
		const res = await pool.query(text, params);
		return { success: true, data: res.rows };
	} catch (err) {
		console.error("Database operation failed:", err.stack);
        return { success: false, error: err.message };
	}
}

import pg from 'pg';

const pool = new pg.Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB,
	password: process.env.DB_PASSWORD,
	port: 5432,
});

/**
 * Send a query to the database.
 *
 * @param {string} text
 * @param {*[]} params
 * @returns A list of rows as column name mapped to value or sends an error message to console.
 */
export async function query(text, params) {
	try {
		const res = await pool.query(text, params);
		return { success: true, data: res.rows };
	} catch (err) {
		console.error('Database operation failed:', err.stack);
		return { success: false, error: err.message };
	}
}

/**
 * Fetches data from a specified table with optional filtering.
 *
 * @param {string} tableName - The name of the database table from which to fetch data.
 * @param {{ key: string, value: any }} [filter={}] - An optional filter to apply to the query. Should have 'key' and 'value' properties.
 * @returns {Promise<Object>} A promise that resolves with a query result object. The result object includes
 *                            a 'success' flag and, depending on success, either 'data' (array of rows) or 'error' message.
 */
export async function fetchData(tableName, filter = {}) {
	const { key, value } = filter;
	let baseQuery = `SELECT * FROM ${tableName}`;
	if (key && value) {
		baseQuery += ` WHERE ${key} = $1`;
		console.log('Executing query:', baseQuery, 'with params:', [value]);
		return query(baseQuery, [value]);
	}
	return query(baseQuery);
}

/**
 * Inserts data into a specified table and returns the inserted data.
 *
 * @param {string} tableName - The name of the table where data will be inserted.
 * @param {Object} data - An object where keys are column names and values are the data to be inserted into those columns.
 * @returns {Promise<Object>} A promise that resolves with a query result object containing either the inserted row
 *                            in the 'data' property if successful, or an 'error' message if the operation fails.
 */
export async function insertData(tableName, data) {
	const keys = Object.keys(data);
	const values = Object.values(data);
	const queryText = `
		INSERT INTO ${tableName}(${keys.join(', ')})
		VALUES(${keys.map((_, index) => `$${index + 1}`).join(', ')})
		RETURNING *;
	`;
	return query(queryText, values);
}

/**
 * Updates specified entries in a database table based on provided conditions.
 *
 * @param {string} tableName - The name of the table to update.
 * @param {Object} data - An object containing column-value pairs where each key is a column name
 *                        and each value is the new data to update in that column.
 * @param {Object} conditions - An object specifying the conditions that must be met for rows to be updated.
 *                              This should be in the form of column-value pairs.
 * @returns {Promise<Object>} A promise that resolves with a query result object. This object will contain
 *                            'data' with updated rows if successful, or an 'error' message if the update fails.
 */
export async function updateData(tableName, data, conditions) {
	const setClauses = Object.keys(data).map(
		(key, index) => `${key} = $${index + 1}`
	);
	const conditionClauses = Object.keys(conditions).map(
		(key, index) => `${key} = $${index + 1 + setClauses.length}`
	);
	const queryText = `
        UPDATE ${tableName}
        SET ${setClauses.join(', ')}
        WHERE ${conditionClauses.join(' AND ')}
      RETURNING *;
    `;
	const values = [...Object.values(data), ...Object.values(conditions)];
	return query(queryText, values);
}

/**
 * Deletes data from a table based on conditions, optionally using a soft delete approach.
 *
 * @param {string} tableName - The name of the table from which to delete data.
 * @param {Object} conditions - Conditions that specify which rows should be deleted, represented as column-value pairs.
 * @param {boolean} [softDelete=false] - Whether to perform a soft delete (i.e., update a flag on the row instead of removing it).
 * @param {string} [deleteColumn='is_deleted'] - The column to update if performing a soft delete.
 * @returns {Promise<Object>} A promise that resolves with a query result object. If successful, the 'data' property
 *                            contains the deleted or updated rows (in case of a soft delete), or an 'error' message if it fails.
 */
export async function deleteData(
	tableName,
	conditions,
	softDelete = false,
	deleteColumn = 'is_deleted'
) {
	if (softDelete) {
		const queryText = `
        UPDATE ${tableName}
        SET ${deleteColumn} = TRUE
        WHERE ${Object.keys(conditions)
			.map((key, index) => `${key} = $${index + 1}`)
			.join(' AND ')}
        RETURNING *;
        `;
		const values = Object.values(conditions);
		return query(queryText, values);
	} else {
		const queryText = `
        DELETE FROM ${tableName}
        WHERE ${Object.keys(conditions)
			.map((key, index) => `${key} = $${index + 1}`)
			.join(' AND ')}
        RETURNING *;
        `;
		const values = Object.values(conditions);
		return query(queryText, values);
	}
}

/**
 * Inserts multiple records into a specified table, primarily used for adding rows to junction tables.
 * This function allows for efficient batch insertion of multiple entries.
 *
 * @param {string} tableName - The name of the table where records will be inserted. (junction table)
 * @param {string} constColName - The name of the column that will receive the constant value across all rows.
 * @param {number} constId - The constant value that will be inserted into the constColName column for all rows.
 * @param {string} bulkColName - The name of the column that will receive an array of values.
 * @param {Array<number>} bulkIds - An array of IDs that will be inserted into the bulkColName column.
 * @returns {Promise<Object>} A promise that resolves with a query result object containing either the inserted row
 *                            in the 'data' property if successful, or an 'error' message if the operation fails.
 */
export async function bulkInsert(
	tableName,
	constColName,
	constId,
	bulkColName,
	bulkIds
) {
	const queryText = `
		INSERT INTO ${tableName} (${constColName}, ${bulkColName})
		SELECT $1, unnest($2::int[])
		ON CONFLICT DO NOTHING
	RETURNING *;
	`;
	return query(queryText, [constId, bulkIds]);
}

/**
 * Calls an SQL function using the existing query utility.
 *
 * @param {string} functionName The name of the SQL function.
 * @param {Array} params Parameters to pass to the function.
 * @returns {Promise<any>} The result of the function call.
 */
export async function callSqlFunction(functionName, params = []) {
	const placeholders = params.map((_, index) => `$${index + 1}`).join(', ');
	const queryText = `SELECT ${functionName}(${placeholders})`;
	return query(queryText, params);
}

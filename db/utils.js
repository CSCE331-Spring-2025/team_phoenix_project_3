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
 * @param {*} text
 * @param {*} params
 * @returns A list of rows as column name mapped to value or sends an error message to console.
 */
export async function query(text, ...params) {
    try {
        const res = await pool.query(text, params);
        return { success: true, data: res.rows };
    } catch (err) {
        console.error('Database operation failed:', err.stack);
        return { success: false, error: err.message };
    }
}

export async function fetchData(tableName, filters = {}) {
    const { key, value } = filters;
    let baseQuery = `SELECT * FROM ${tableName}`;
    if (key && value) {
        baseQuery += ` WHERE ${key} = $1`;
        return query(baseQuery, [value]);
    }
    return query(baseQuery);
}

export async function insertData(tableName, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const queryText = ```
		INSERT INTO ${tableName}(${keys.join(', ')})
		VALUES(${keys.map((_, index) => `$${index + 1}`).join(', ')})
	  RETURNING *;
	`;
    return query(queryText, values);
}

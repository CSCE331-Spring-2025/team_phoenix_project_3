import { query } from "./utils";

/**
 * Pull all item names from menu items table.
 *
 * @return A {@code Map} containing all menu item ids mapped to their
 *         respective names.
 */
export async function getMenuItems() {
    const statement = "SELECT * FROM menu_items ORDER BY id ASC";
    const { success, data, error } = await query(statement);
    if (success && data.length > 0) {
        return data;
    } else {
        console.error("Failed to retrieve menu items:", error);
    }
    
}

import * as db from "../../db/menu-items";

const items = db.getMenuItems();

function order(item) {
    const message = `You ordered: ${item}`;
    document.getElementById("order-message").textContent = message;
    console.log(message);
    console.log(items[0]);
}

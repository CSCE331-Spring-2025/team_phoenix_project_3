import { fetchData, updateData } from "./utils.js";

// Fetch suppliers from the database
async function fetchSuppliers() {
    const { success, data, error } = await fetchData("suppliers");

    if (success && data.length > 0) {
        return data; // Return the list of suppliers
    } else {
        console.error("Failed to retrieve suppliers:", error);
        return [];
    }
}

// Fetch inventory items for a specific supplier
async function fetchInventoryBySupplier(supplierId) {
    const { success, data, error } = await fetchData("inventory", { key: "supplier_id", value: supplierId });

    if (success && data.length > 0) {
        return data; // Return the inventory items
    } else {
        console.error("Failed to retrieve inventory items:", error);
        return [];
    }
}

// Populate the supplier dropdown
async function populateSupplierDropdown() {
    const supplierDropdown = document.getElementById("supplierDropdown");
    const suppliers = await fetchSuppliers();

    suppliers.forEach((supplier) => {
        const option = document.createElement("option");
        option.value = supplier.id; // Supplier ID
        option.textContent = supplier.supplier_name; // Supplier Name
        supplierDropdown.appendChild(option);
    });
}

// Fetch and display inventory items for the selected supplier
async function fetchAndDisplayInventory() {
    const supplierDropdown = document.getElementById("supplierDropdown");
    const supplierId = supplierDropdown.value; // Get selected supplier ID
    const inventoryContainer = document.getElementById("inventoryContainer");

    // Clear the inventory container
    inventoryContainer.innerHTML = "";

    if (!supplierId) {
        inventoryContainer.innerHTML = "<p>Please select a supplier to view inventory.</p>";
        return;
    }

    const inventory = await fetchInventoryBySupplier(supplierId);

    if (inventory.length === 0) {
        inventoryContainer.innerHTML = "<p>No inventory items found for this supplier.</p>";
        return;
    }

    inventory.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "inventory-item";

        itemDiv.innerHTML = `
            <p><strong>${item.name}</strong> (Current Quantity: ${item.quantity})</p>
            <input type="number" id="input-${item.id}" placeholder="Enter new quantity">
            <button onclick="updateItem(${item.id})">Update</button>
        `;

        inventoryContainer.appendChild(itemDiv);
    });
}

// Handle updating an inventory item
async function updateItem(itemId) {
    const inputField = document.getElementById(`input-${itemId}`);
    const newQuantity = inputField.value;

    if (newQuantity === "") {
        alert("Please enter a quantity.");
        return;
    }

    const { success, data, error } = await updateData("inventory", { quantity: newQuantity }, { id: itemId });

    if (success) {
        alert(`Item updated successfully! New quantity: ${data[0].quantity}`);
    } else {
        console.error("Failed to update item:", error);
        alert("Failed to update item.");
    }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    populateSupplierDropdown();
});



let inventoryData = [];
const suppliersMap = new Map(); // Map to store supplier IDs and names
let currentSupplier = null;

const supplierDropdown = document.getElementById('supplierDropdown');
const inventoryContainer = document.getElementById('inventoryContainer');

// Fetch supplier data and populate the dropdown
fetch('/inventory/suppliers')
  .then((response) => response.json())
  .then((suppliers) => {
    console.log("Suppliers Data:", suppliers); // Debugging line

    suppliers.forEach(supplier => {
      suppliersMap.set(supplier.id, supplier.supplier_name); // Map supplier ID to name
    });

    // Populate the dropdown with supplier names
    for (let [supplierID, supplierName] of suppliersMap) {
      const option = document.createElement('option');
      option.value = supplierID;
      option.textContent = supplierName;
      supplierDropdown.appendChild(option);
    }
  })
  .catch((err) => console.error("Error loading suppliers:", err));

// Fetch inventory data
fetch('/inventory/items')
  .then((response) => response.json())
  .then((data) => {
    inventoryData = data;
    console.log("Inventory Data:", inventoryData); // Debugging line
  })
  .catch((err) => console.error("Error loading inventory:", err));

// Handle supplier selection
supplierDropdown.addEventListener('change', () => {
  currentSupplier = supplierDropdown.value;
  displayItemsBySupplier(currentSupplier);
});

function displayItemsBySupplier(supplierId) {
  inventoryContainer.innerHTML = '';

  const filteredItems = inventoryData.filter(item => item.supplier_id == supplierId && !item.is_deleted);

  filteredItems.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = "inventoryCard";

    itemDiv.innerHTML = `
      <p><strong>${item.item_name}</strong> (Current: ${item.quantity})</p>
      <input type="number" id="input-${item.id}" placeholder="Quantity to add" min="0" />
      <button class="deliverBtn" onclick="updateQuantity(${item.id})">Deliver</button>
      <button class="deleteBtn" onclick="deleteInventoryItem(${item.id})">Delete</button>
    `;

    inventoryContainer.appendChild(itemDiv);
  });
}

window.updateQuantity = async function (itemId) {
  const input = document.getElementById(`input-${itemId}`);
  const addQty = parseInt(input.value);

  if (isNaN(addQty) || addQty < 0) {
    alert("Enter a valid number to deliver.");
    return;
  }

  const item = inventoryData.find(i => i.id === itemId);
  const newQty = item.quantity + addQty;

  try {
    const res = await fetch(`/inventory/edit/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty })
    });

    if (!res.ok) throw new Error("Update failed");

    const updated = await res.json();
    alert(`${updated[0].item_name} updated to quantity ${updated[0].quantity}`);

    // Update in memory and re-render
    item.quantity = updated[0].quantity;
    displayItemsBySupplier(currentSupplier);
  } catch (err) {
    console.error("Failed to update:", err);
    alert("Failed to update item quantity.");
  }
};

window.addSupplier = async function () {
  const supplierIdInput = document.getElementById('supplierIdInput');
  const supplierNameInput = document.getElementById('supplierNameInput');
  const supplierPhoneInput = document.getElementById('supplierPhoneInput');

  const supplierId = parseInt(supplierIdInput.value);
  const supplierName = supplierNameInput.value.trim();
  const phoneNumber = supplierPhoneInput.value.trim();

  // Validate inputs
  if (isNaN(supplierId) || !supplierName || !phoneNumber) {
    alert("Please provide valid inputs for all fields.");
    return;
  }

  // Check if the supplier ID already exists
  if (suppliersMap.has(supplierId)) {
    alert(`Supplier ID ${supplierId} is already taken. Please choose a different ID.`);
    return;
  }

  try {
    const response = await fetch('/suppliers/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: supplierId,
        supplier_name: supplierName,
        phone_number: phoneNumber,
      }),
    });

    if (!response.ok) throw new Error(`Failed to add supplier. Status: ${response.status}`);

    const newSupplier = await response.json();
    alert(`Supplier "${newSupplier.supplier_name}" added successfully!`);

    // Update the dropdown with the new supplier
    const option = document.createElement('option');
    option.value = newSupplier.id;
    option.textContent = newSupplier.supplier_name;
    supplierDropdown.appendChild(option);

    // Update the suppliersMap and supplier ID list
    suppliersMap.set(newSupplier.id, newSupplier.supplier_name);
    updateSupplierIdList();

    // Clear the input fields
    supplierIdInput.value = '';
    supplierNameInput.value = '';
    supplierPhoneInput.value = '';
  } catch (err) {
    console.error("Error adding supplier:", err);
    alert("Failed to add supplier. Please try again.");
  }
}

function updateSupplierIdList() {
  const supplierIdList = document.getElementById('supplierIdList');
  supplierIdList.innerHTML = '';

  for (let supplierId of suppliersMap.keys()) {
    const listItem = document.createElement('li');
    listItem.textContent = supplierId;
    supplierIdList.appendChild(listItem);
  }
}

// Call this function after fetching suppliers
fetch('/inventory/suppliers')
  .then((response) => response.json())
  .then((suppliers) => {
    suppliers.forEach(supplier => {
      suppliersMap.set(supplier.id, supplier.supplier_name);
    });
    updateSupplierIdList(); // Update the list in the UI
  })
  .catch((err) => console.error("Error loading suppliers:", err));

window.addInventoryItem = async function () {
  const itemNameInput = document.getElementById('itemNameInput');
  const itemQuantityInput = document.getElementById('itemQuantityInput');
  const itemSupplierIdInput = document.getElementById('itemSupplierIdInput');

  const itemName = itemNameInput.value.trim();
  const itemQuantity = parseInt(itemQuantityInput.value);
  const supplierId = parseInt(itemSupplierIdInput.value);

  // Validate inputs
  if (!itemName || isNaN(itemQuantity) || isNaN(supplierId)) {
    alert("Please provide valid inputs for all fields.");
    return;
  }

  // Check if the item name already exists in the inventory
  const existingItem = inventoryData.find(item => {
    return item && item.item_name.toLowerCase() === itemName.toLowerCase();
  });
  console.log("Item Name Input:", itemName); // Debugging line
  if (existingItem) {
    alert(`An item with the name "${itemName}" already exists in the inventory.`);
    return;
  }

  // Check if the supplier ID exists
  if (!suppliersMap.has(supplierId)) {
    alert(`Supplier ID ${supplierId} does not exist. Please provide a valid Supplier ID.`);
    return;
  }

  try {
    const response = await fetch('/inventory/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_name: itemName,
        quantity: itemQuantity,
        supplier_id: supplierId,
      }),
    });

    if (!response.ok) throw new Error(`Failed to add inventory item. Status: ${response.status}`);

    const newItem = await response.json();
    alert(`Item "${newItem.item_name}" added successfully!`);

    // Update the inventory data and re-render the items
    inventoryData.push(newItem);
    if (currentSupplier === supplierId.toString()) {
      displayItemsBySupplier(currentSupplier);
    }

    // Clear the input fields
    itemNameInput.value = '';
    itemQuantityInput.value = '';
    itemSupplierIdInput.value = '';
   } catch (err) {
    console.error("Error adding inventory item:", err);
    alert("Failed to add inventory item. Please try again.");
  }
};

window.deleteInventoryItem = async function (itemId) {
  if (!confirm(`Are you sure you want to delete this item?`)) {
      return;
  }

  try {
      const response = await fetch(`/inventory/delete/${itemId}`, {
          method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Failed to delete inventory item. Status: ${response.status}`);

      alert(`Item with ID ${itemId} deleted successfully!`);

      // Remove the item from the local inventory data
      inventoryData = inventoryData.filter(item => item.id !== itemId);

      // Re-render the items for the current supplier
      displayItemsBySupplier(currentSupplier);
  } catch (err) {
      console.error("Error deleting inventory item:", err);
      alert("Failed to delete inventory item. Please try again.");
  }
};

function displayAllSuppliers() {
  const supplierListContainer = document.getElementById('supplierListContainer');
  supplierListContainer.innerHTML = ''; // Clear the container

  fetch('/inventory/suppliers')
      .then(response => response.json())
      .then(suppliers => {
          if (suppliers.length === 0) {
              supplierListContainer.innerHTML = '<p>No suppliers found.</p>';
              return;
          }

          suppliers.forEach(supplier => {
              const supplierDiv = document.createElement('div');
              supplierDiv.className = 'supplierCard';

              supplierDiv.innerHTML = `
                  <p><strong>ID:</strong> ${supplier.id}</p>
                  <p><strong>Name:</strong> ${supplier.supplier_name}</p>
                  <p><strong>Phone Number:</strong> ${supplier.phone_number}</p>
              `;

              supplierListContainer.appendChild(supplierDiv);
          });
      })
      .catch(err => {
          console.error('Error fetching suppliers:', err);
          supplierListContainer.innerHTML = '<p>Failed to load suppliers. Please try again later.</p>';
      });
}

// Call this function after fetching suppliers
document.addEventListener('DOMContentLoaded', displayAllSuppliers);
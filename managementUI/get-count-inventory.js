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
      <input type="number" id="input-${item.id}" placeholder="Quantity to count" min="0" />
      <button class="countBtn" onclick="updateQuantity(${item.id})">Count</button>
    `;

    inventoryContainer.appendChild(itemDiv);
  });
}

window.updateQuantity = async function (itemId) {
  const input = document.getElementById(`input-${itemId}`);
  const countedQty = parseInt(input.value);

  if (isNaN(countedQty) || countedQty < 0) {
    alert("Enter a valid number to count the number of items.");
    return;
  }

  const item = inventoryData.find(i => i.id === itemId);
  const newQty = countedQty;

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
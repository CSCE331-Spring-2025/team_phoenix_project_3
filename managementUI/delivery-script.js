let inventoryData = [];
let suppliersSet = new Set();
let currentSupplier = null;

const supplierDropdown = document.getElementById('supplierDropdown');
const inventoryContainer = document.getElementById('inventoryContainer');

// Fetch all inventory items and populate supplier dropdown
fetch('/inventory/items')
  .then((response) => response.json())
  .then((data) => {
    inventoryData = data;

    data.forEach(item => {
      if (!item.is_deleted && item.supplier_id) {
        suppliersSet.add(item.supplier_id);
      }
    });

    for (let supplier of suppliersSet) {
      const option = document.createElement('option');
      option.value = supplier;
      option.textContent = `Supplier ${supplier}`;
      supplierDropdown.appendChild(option);
    }
  })
  .catch((err) => console.error("Error loading inventory:", err));

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



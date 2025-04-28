let menuItemsData = [];
let categorySet = new Set();
let currentCategory = null;

const menuItemDropdown = document.getElementById('menuItemDropdown');
const menuItemContainer = document.getElementById('menuItemContainer');

fetch('/menu/items')
    .then((response) => response.json())
    .then((data) => {
        menuItemsData = data;

        data.forEach(item => {
            if (!item.is_deleted && item.menu_item_id) {
                categorySet.add(item.menu_item_id);
            }
        });

        for (let menuItem of categorySet) {
            const option = document.createElement('option');
            option.value = menuItem;
            option.textContent = `Menu Item ${menuItem}`;
            menuItemDropdown.appendChild(option);
        }
    })
    .catch((err) => console.error("Error loading menu items:", err));

menuItemDropdown.addEventListener('change', () => {
    currentMenuItem = menuItemDropdown.value;
    displayItemsByCategory(currentCategory);
});

function displayItemsByCategory(itemCategory) {
    menuItemContainer.innerHTML = '';

    const filteredItems = menuItemsData.filter(item => item.category == itemCategory && !item.is_deleted);
    
    filteredItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = "menuItemCard";

        itemDiv.innerHTML = `
           <p><strong>${item.item_name}</strong></p>
              <p>Price: ${item.price}</p>
              <p>Category: ${item.category}</p>
              <p>Ingredients: ${item.ingredients}</p>
        `;
        menuItemContainer.appendChild(itemDiv);
    });
}

function addMenuItem(itemName, itemPrice, itemCategory, ingredients) {
    // fecth (`/manage/menu`, {)
    fetch(`/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_name: itemName, price: itemPrice, category: itemCategory, ingredients })
    })
        .then(response => response.json())
        .then(() => {
            alert("Menu item added successfully!");
            location.reload(); // Reload the page to see the updated menu items
        })
        .catch(err => console.error("Error adding menu item:", err));
}

function removeMenuItem(itemId) {
    //fecth (`/manage/menu/${itemId}`, {)
    fetch(`/delete/${itemId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(() => {
            alert("Menu item removed successfully!");
            location.reload(); // Reload the page to see the updated menu items
        })
        .catch(err => console.error("Error removing menu item:", err));
}

function updateMenuItem(itemId) {
    const itemDiv = document.getElementById(`menuItem-${itemId}`);
    const itemName = itemDiv.querySelector('.itemName').value;
    const itemPrice = itemDiv.querySelector('.itemPrice').value;
    const itemCategory = itemDiv.querySelector('.itemCategory').value;
    const ingredients = itemDiv.querySelector('.ingredients').value;

    // fecth (`/manage/menu/${itemId}`, {)
    fetch(`/edit/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_name: itemName, price: itemPrice, category: itemCategory, ingredients })
    })
        .then(response => response.json())
        .then(() => {
            alert("Menu item updated successfully!");
            location.reload(); // Reload the page to see the updated menu items
        })
        .catch(err => console.error("Error updating menu item:", err));
}
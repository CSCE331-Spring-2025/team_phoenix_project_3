let menuItemsData = [];
let categorySet = new Set();
let currentCategory = null;

const menuItemDropdown = document.getElementById('menuItemDropdown');
const menuItemContainer = document.getElementById('menuItemContainer');

fetch('/menu/items')
    .then((response) => response.json())
    .then((data) => {
        menuItemsData = data;
        console.log("Menu items data loaded:", menuItemsData);
        data.forEach(item => {
            if (!item.is_deleted) { //&& item.menu_item_id
                categorySet.add(item.category);
            }
        });

        for (let category of categorySet) {
            const option = document.createElement('option');
            option.value = category
            option.textContent = category;
            menuItemDropdown.appendChild(option);
        }
    })
    .catch((err) => console.error("Error loading menu items:", err));

menuItemDropdown.addEventListener('change', () => {
    const currentCategory = menuItemDropdown.value;
    displayItemsByCategory(currentCategory);
});

function displayItemsByCategory(itemCategory) {
    menuItemContainer.innerHTML = '';

    const filteredItems = menuItemsData.filter(item => item.category == itemCategory && !item.is_deleted);
    
    filteredItems.forEach(async (item) => {
        const ingredients = await fetch(`/menu/ingredients/${item.id}`)
            .then(response => response.json())
            .catch(err => `Error ingredients: ${err}`);
        console.log("Ingredients List:", ingredients); // debugging line
        /*const ingredients = ingredientsList.array.forEach(element => {
            element.ingredients
        });
        */
        // Extract and join the ingredients into a string
        // const ingredients = ingredientsList.map(ingredient => ingredient.ingredients).join(', ');

        // console.log(ingredients);
        const itemDiv = document.createElement('div');
        itemDiv.className = "menuItemCard";
        itemDiv.id = `menuItem-${item.id}`; // Unique ID for each menu item

        itemDiv.innerHTML = `
            <p><strong>Item Name: </strong> <input type="text" class="itemName" value="${item.item_name}"></p>
            <label>Price: <input type="number" class="itemPrice" value="${item.price.toFixed(2)}"></label>
            <p>Category: <input type="string" class="itemCategory" value="${item.category}"</p>
            <p>Ingredients: <input type="text" class="ingredients" value="${ingredients.join(', ')}"></p>
            <button class="updateBtn" onclick="updateMenuItem(${item.id})">Update Price</button>
            <button class="deleteBtn" onclick="removeMenuItem(${item.id})">Remove Item</button>
        `;
        menuItemContainer.appendChild(itemDiv);
    });
}

let availableIngredients = [];

// Fetch available ingredients
fetch('/inventory/items')
    .then(response => response.json())
    .then(data => {
        availableIngredients = data; // Store the list of ingredients
        console.log("Available Ingredients:", availableIngredients); // Debugging line
    })
    .catch(err => console.error("Error loading ingredients:", err));

function addMenuItem() {
    const itemName = document.getElementById('newItemName').value;
    const itemPrice = parseFloat(document.getElementById('newItemPrice').value);
    const itemCategory = document.getElementById('newItemCategory').value;
    const ingredientNames = document.getElementById('newItemIngredients').value
        .split(',')
        .map(name => name.trim().toLowerCase()); // Convert comma-separated string to an array of names

    // Map ingredient names to their corresponding IDs
    const ingredients = ingredientNames.map(name => {
        const ingredient = availableIngredients.find(ing => ing.item_name.toLowerCase() === name);
        return ingredient ? ingredient.id : null; // Return the ID or null if not found
    }).filter(id => id !== null); // Remove any null values

    if (ingredients.length !== ingredientNames.length) {
        alert("Some ingredients could not be found. Please check the names.");
        return;
    }

    fetch(`/menu/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_name: itemName, price: itemPrice, category: itemCategory, ingredients }),
    })
        .then(response => response.json())
        .then(() => {
            alert("Menu item added successfully!");
            location.reload(); // Reload the page to see the updated menu items
        })
        .catch(err => console.error("Error adding menu item:", err));
}

/*
function addMenuItem() {
    const itemName = document.getElementById('newItemName').value;
    const itemPrice = parseFloat(document.getElementById('newItemPrice').value);
    const itemCategory = document.getElementById('newItemCategory').value;
    const ingredients = document.getElementById('newItemIngredients').value
        .split(',')
        .map(id => parseInt(id.trim())); // Convert comma-separated string to an array of integers

    fetch(`/menu/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_name: itemName, price: itemPrice, category: itemCategory, ingredients }),
    })
        .then(response => response.json())
        .then(() => {
            alert("Menu item added successfully!");
            location.reload(); // Reload the page to see the updated menu items
        })
        .catch(err => console.error("Error adding menu item:", err));
}
*/

function removeMenuItem(itemId) {
    //fecth (`/manage/menu/${itemId}`, {)
    fetch(`/menu/delete/${itemId}`, {
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
    const itemPrice = parseFloat(itemDiv.querySelector('.itemPrice').value);
    const itemCategory = itemDiv.querySelector('.itemCategory').value;
    const ingredientNames = itemDiv.querySelector('.ingredients').value
        .split(',')
        .map(name => name.trim().toLowerCase()); // Convert comma-separated string to an array of names
    // Map ingredient names to their corresponding IDs
    const ingredients = ingredientNames.map(name => {
        const ingredient = availableIngredients.find(ing => ing.item_name.toLowerCase() === name);
        return ingredient ? ingredient.id : null; // Return the ID or null if not found
    }).filter(id => id !== null); // Remove any null values

    if (ingredients.length !== ingredientNames.length) {
        alert("Some ingredients could not be found. Please check the names.");
        return;
    }

    fetch(`/menu/edit/${itemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_name: itemName, price: itemPrice, category: itemCategory, ingredients }),
    })
        .then(response => response.json())
        .then(() => {
            alert("Menu item updated successfully!");
            location.reload(); // Reload the page to see the updated menu items
        })
        .catch(err => console.error("Error updating menu item:", err));
}

window.addMenuItem = addMenuItem;
window.removeMenuItem = removeMenuItem;
window.updateMenuItem = updateMenuItem;
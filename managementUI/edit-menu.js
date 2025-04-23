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
    
}
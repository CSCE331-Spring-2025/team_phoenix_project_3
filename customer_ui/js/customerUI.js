// customerUI.js
import * as API from './api.js';

let order = {
	employee_id: 30,
	order_items: [], // each drink: { id, item_name, price, boba, sugar }
};

let currentDrink = {
	id: -1,
	item_name: '',
	price: 0,
	boba: false,
	sugar: 100,
};

function sugarIntToString(sugarPercent) {
	let sgrLvl = '';
	switch (sugarPercent) {
		case 0:
			sgrLvl = 'Zero';
			break;
		case 50:
			sgrLvl = 'Half';
			break;
		case 100:
			sgrLvl = 'Regular';
			break;
		case 150:
			sgrLvl = 'Extra';
			break;
	}
	return sgrLvl;
}

function updateCartDisplay() {
	const cartPanel = document.getElementById('cartPanel');
	cartPanel.innerHTML = '<h3>Your Order:</h3>';
	const cartItems = document.createElement('div');
	cartItems.classList.add('cartItems');

	if (order.order_items.length === 0) {
		cartItems.innerHTML += '<p>No items in order.</p>';
		cartPanel.appendChild(cartItems);
		cartPanel.innerHTML += `<p class="subtotal">
            <strong>Subtotal: $0.00</strong>
        </p>`;
		return;
	}

	order.order_items.forEach((drink) => {
		const cartItem = document.createElement('div');
		cartItem.classList.add('cartItem');

		const mainRow = document.createElement('div');
		mainRow.classList.add('cartItemMain');

		const drinkName = document.createElement('span');
		drinkName.classList.add('cartDrinkName');
		drinkName.textContent = drink.item_name;

		const drinkPrice = document.createElement('span');
		drinkPrice.classList.add('cartDrinkPrice');
		drinkPrice.textContent = `$${drink.price.toFixed(2)}`;

		mainRow.appendChild(drinkName);
		mainRow.appendChild(drinkPrice);

		const sgrLvl = sugarIntToString(drink.sugar);
		const details = document.createElement('div');
		details.classList.add('cartItemDetails');
		details.innerHTML = `
        &nbsp;&nbsp;- ${drink.boba ? 'With Boba' : 'Without Boba'}<br/>
        &nbsp;&nbsp;- ${sgrLvl} Sugar
        `;

		const removeBtn = document.createElement('button');
		removeBtn.textContent = 'X';
		removeBtn.classList.add('removeItemBtn');

		cartItem.appendChild(mainRow);
		cartItem.appendChild(details);
		cartItem.appendChild(removeBtn);

		cartItems.appendChild(cartItem);
	});

	cartPanel.appendChild(cartItems);

	const total = order.order_items.reduce((sum, d) => sum + d.price, 0);
	cartPanel.innerHTML += `<p class="subtotal">
        <strong>Subtotal: $${total.toFixed(2)}</strong>
    </p>`;
	localStorage.setItem('savedCart', JSON.stringify(order));

	document.querySelectorAll('.removeItemBtn').forEach((btn, index) => {
		btn.onclick = () => {
			order.order_items.splice(index, 1);
			localStorage.setItem('savedCart', JSON.stringify(order));
			updateCartDisplay();
		};
	});
}

function addDrinkToOrder(drink) {
	order.order_items.push(drink);
	updateCartDisplay();
}

document.getElementById('cartPanel').addEventListener('click', function (e) {
	if (e.target.classList.contains('removeItemBtn')) {
		const idToRemove = parseInt(e.target.dataset.id);
		order.order_items = order.order_items.filter(
			(drink) => drink.id !== idToRemove
		);
		localStorage.setItem('savedCart', JSON.stringify(order));
		updateCartDisplay();
	}
});

function showCustomization(name, id, price) {
	currentDrink.item_name = name;
	currentDrink.id = id;
	currentDrink.price = price;
	document.getElementById('customization').style.display = 'flex';
	document.querySelector('.cartPanel').style.display = 'none';
	document.querySelector('.drinkName').textContent = name;
	document.querySelector('.drinkPrice').textContent = `$${price.toFixed(2)}`;
}

function hideCustomization() {
	document.querySelector('.bobaStatus').textContent =
		'Please choose if you want boba';
	document.querySelector('.sugarStatus').textContent =
		'Please enter a sugar level';
	currentDrink.boba = false;
	currentDrink.sugar = 100;
	document.getElementById('customization').style.display = 'none';
	document.querySelector('.cartPanel').style.display = 'inline-block';
}

async function displayMenu(category = '') {
	const categories = ['Milk Tea', 'Tea', 'Smoothie', 'LTO'];
	const menuItems = await API.getMenuItems();
	if (!menuItems) {
		alert('Connection Error: try again later.');
		return;
	}

	const container = document.getElementById('menu');

	// Clear previous buttons
	container.innerHTML = '';

	// Filter menu by category if valid, else show all
	const filteredItems = categories.includes(category)
		? menuItems.filter((item) => item.category === category)
		: menuItems;
	// console.log(filteredItems);

	// Generate buttons
	filteredItems.forEach((item) => {
		const button = document.createElement('button');
		button.textContent = item.item_name;
		button.classList.add('allButtons');

		button.onclick = () => {
			showCustomization(item.item_name, item.id, item.price);
		};

		container.appendChild(button);
	});
}

function selectMenu(id) {
	document.querySelectorAll('.sidebarButtons').forEach((btn) => {
		btn.classList.remove('active');
	});
	document.querySelector(id).classList.add('active');
}

function backOut() {
	const saved = localStorage.getItem('savedCart');
	const savedParsed = JSON.parse(saved);
	if (
		!saved ||
		savedParsed.order_items.length == 0 ||
		confirm('Would you like to cancel the order?')
	) {
		localStorage.removeItem('savedCart');
		window.location.href = 'customer_landing.html';
	}
}

window.onload = () => {
	displayMenu();
	const saved = localStorage.getItem('savedCart');
	if (saved) {
		order = JSON.parse(saved);
		// console.log(JSON.stringify(order));
	}
	updateCartDisplay();

	document.querySelector('#back').onclick = () => {
		backOut();
	};

	document.querySelector('#allBtn').onclick = () => {
		selectMenu('#allBtn');
		displayMenu();
	};

	document.querySelector('#ltoBtn').onclick = () => {
		selectMenu('#ltoBtn');
		displayMenu('LTO');
	};

	document.querySelector('#teaBtn').onclick = () => {
		selectMenu('#teaBtn');
		displayMenu('Tea');
	};

	document.querySelector('#milkTeaBtn').onclick = () => {
		selectMenu('#milkTeaBtn');
		displayMenu('Milk Tea');
	};

	document.querySelector('#smoothieBtn').onclick = () => {
		selectMenu('#smoothieBtn');
		displayMenu('Smoothie');
	};

	document.querySelector('.addDrink').onclick = () => {
		addDrinkToOrder({ ...currentDrink });
		hideCustomization();
	};

	document.querySelector('.cancel').onclick = () => hideCustomization();

	document.querySelector('.withBoba').onclick = async () => {
		const bobaInfo = await checkBoba();
	    if(bobaInfo.quantity < 1){
			alert(
				'Out of boba stock. Please notify a manager or employee.'
			);
			currentDrink.boba = false;
			document.querySelector('.bobaStatus').textContent = 'Includes No Boba';
		}
		else{
			currentDrink.boba = true;
			document.querySelector('.bobaStatus').textContent = 'Includes Boba';
		}
	};

	document.querySelector('.withoutBoba').onclick = () => {
		currentDrink.boba = false;
		document.querySelector('.bobaStatus').textContent = 'Includes No Boba';
	};

	document.querySelectorAll('.sugar').forEach((btn) => {
		btn.onclick = () => {
			const val = parseInt(btn.id.replace('sugar', ''));
			currentDrink.sugar = val;
			const sgrLvl = sugarIntToString(val);
			// console.log(btn);
			// console.log(sgrLvl);
			document.querySelector(
				'.sugarStatus'
			).textContent = `Sugar level: ${sgrLvl}`;
		};
	});
};

async function checkBoba(){
	const bobaStock = await API.getBobaStock();
	return bobaStock;
}
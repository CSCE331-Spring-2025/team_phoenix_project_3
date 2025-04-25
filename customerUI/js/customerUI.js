// customerUI.js

let order = {
	employee_id: 30,
	drinks: [], // each drink: { id, item_name, price, boba, sugar }
};

function updateCartDisplay() {
	const cartPanel = document.getElementById('cartPanel');
	cartPanel.innerHTML = '<h3>Your Order:</h3>';

	if (order.drinks.length === 0) {
		cartPanel.innerHTML += '<p>No items in order.</p>';
		return;
	}

	order.drinks.forEach((drink, index) => {
		const entry = document.createElement('div');
		entry.classList.add('cartItemEntry');

		const text = document.createElement('div');
		let sgrLvl = '';
		switch (drink.sugar) {
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
		text.innerHTML = `
        ${drink.item_name}<br/>
        &nbsp;&nbsp;- ${drink.boba ? 'With Boba' : 'Without Boba'}<br/>
        &nbsp;&nbsp;- Sugar: ${sgrLvl}%<br/>
        &nbsp;&nbsp;- $${drink.price.toFixed(2)}
        `;

		const removeBtn = document.createElement('button');
		removeBtn.textContent = 'X';
		removeBtn.classList.add('removeItemBtn');
		removeBtn.onclick = () => {
			order.drinks.splice(index, 1);
			localStorage.setItem('savedCart', JSON.stringify(order));
			updateCartDisplay();
		};

		entry.appendChild(text);
		entry.appendChild(removeBtn);
		cartPanel.appendChild(entry);
	});

	const total = order.drinks.reduce((sum, d) => sum + d.price, 0);
	cartPanel.innerHTML += `<p><strong>Subtotal: $${total.toFixed(
		2
	)}</strong></p>`;
	localStorage.setItem('savedCart', JSON.stringify(order));
}

function addDrinkToOrder(drink) {
	order.drinks.push(drink);
	updateCartDisplay();
}

window.onload = () => {
	const saved = localStorage.getItem('savedCart');
	if (saved) {
		order = JSON.parse(saved);
		updateCartDisplay();
	}

	document.querySelector('.addDrink').onclick = () => {
		addDrinkToOrder({ ...currentDrink });
		hideCustomization();
	};

	document.querySelector('.cancel').onclick = () => hideCustomization();

	document.querySelector('.withBoba').onclick = () => {
		currentDrink.boba = true;
		document.querySelector('.bobaStatus').textContent = 'Boba: Yes';
	};

	document.querySelector('.withoutBoba').onclick = () => {
		currentDrink.boba = false;
		document.querySelector('.bobaStatus').textContent = 'Boba: No';
	};

	document.querySelectorAll('.sugar').forEach((btn) => {
		btn.onclick = () => {
			const val = parseInt(btn.id.replace('sugar', ''));
			currentDrink.sugar = val;
			document.querySelector(
				'.sugarStatus'
			).textContent = `Sugar level: ${val}%`;
		};
	});
};

let currentDrink = {
	id: -1,
	item_name: '',
	price: 0,
	boba: false,
	sugar: 100,
};

function showCustomization(name, id, price) {
	currentDrink.item_name = name;
	currentDrink.id = id;
	currentDrink.price = price;
	document.getElementById('customization').style.display = 'inline-block';
	document.querySelector('.cartPanel').style.display = 'none';
	document.querySelector('.drinkName').textContent = name;
}

function hideCustomization() {
	document.getElementById('customization').style.display = 'none';
	document.querySelector('.cartPanel').style.display = 'inline-block';
}

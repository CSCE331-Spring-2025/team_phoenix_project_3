import * as API from './api.js'; // if you set up api.js

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

function loadCart() {
	const cartPanel = document.getElementById('checkoutPanel');
	const checkoutTotals = document.getElementById('checkoutTotals');

	const cartItems = document.createElement('div');
	cartItems.classList.add('cartItems');
	cartItems.classList.add('checkoutItems');

	const cart = JSON.parse(localStorage.getItem('savedCart')) || { drinks: [] };

	if (cart.order_items.length === 0) {
		cartItems.innerHTML = '<p>No items in order.</p>';
		cartPanel.appendChild(cartItems);

		const totalsSection = document.createElement('div');
		totalsSection.innerHTML = `
			<div class="checkoutsSubtotal">
				<span class="checkoutLabel">Subtotal:</span>
				<span class="checkoutAmount">$0.00</span>
			</div>
			<div class="checkoutsTax">
				<span class="checkoutLabel">Tax:</span>
				<span class="checkoutAmount">$0.00</span>
			</div>
			<div class="checkoutTotal">
				<span class="checkoutLabel">Total:</span>
				<span class="checkoutAmount">$0.00</span>
			</div>
		`;
		checkoutTotals.appendChild(totalsSection);
		return;
	}

	cart.order_items.forEach((drink) => {
		const cartItem = document.createElement('div');
		cartItem.classList.add('cartItem');
		cartItem.classList.add('checkoutItem');

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

		cartItem.appendChild(mainRow);
		cartItem.appendChild(details);

		cartItems.appendChild(cartItem);
	});

	cartPanel.appendChild(cartItems);

	const subtotal = cart.order_items.reduce((sum, d) => sum + d.price, 0);
	const tax = subtotal * 0.0825;
	const total = subtotal + tax;

	const totalsSection = document.createElement('div');
	totalsSection.innerHTML = `
		<div class="checkoutsSubtotal">
			<span class="checkoutLabel">Subtotal:</span>
            <span class="checkoutAmount">$${subtotal.toFixed(2)}</span>
		</div>
		<div class="checkoutsTax">
			<span class="checkoutLabel">Tax:</span>
            <span class="checkoutAmount">$${tax.toFixed(2)}</span>
		</div>
		<div class="checkoutTotal">
			<span class="checkoutLabel">Total:</span>
            <span class="checkoutAmount">$${total.toFixed(2)}</span>
		</div>
	`;
	checkoutTotals.appendChild(totalsSection);
}

async function finishOrder() {
	const cart = JSON.parse(localStorage.getItem('savedCart'));
	if (!cart || !cart.order_items.length) {
		alert('Cart is empty!');
		return;
	}

	const result = await API.submitOrder(cart);
	if (result) {
		const { id } = result;
		const orderNumber = id % 1000;
		const now = new Date();
		const hour = now.getHours();

		alert(
			`Order placed successfully! Your order number is ${hour}-${orderNumber}.`
		);
		localStorage.removeItem('savedCart');
		window.location.href = 'index.html';
	} else {
		alert(
			'Failed to place order. Please try again or ask an employee for assistance.'
		);
	}
}

window.onload = () => {
	loadCart();
	document.getElementById('finishOrder').onclick = finishOrder;
};

// api.js

// GET /menu/items
export async function getMenuItems() {
	try {
		const res = await fetch('/menu/items');
		return await res.json();
	} catch (err) {
		console.error('Error fetching menu items:', err);
		return null;
	}
}

// GET /inventory/boba
export async function getBobaStock() {
	try {
		const res = await fetch('/inventory/boba');
		return await res.json();
	} catch (err) {
		console.error('Error fetching boba stock:', err);
		return null;
	}
}

// GET /inventory/sugar
export async function getSugarStock() {
	try {
		const res = await fetch('/inventory/sugar');
		return await res.json();
	} catch (err) {
		console.error('Error fetching sugar stock:', err);
		return null;
	}
}

// POST /order/create
export async function submitOrder(order) {
	return await fetch('/order/create', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(order),
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error('Error submitting order:', err);
			return null; // failed request
		});
}

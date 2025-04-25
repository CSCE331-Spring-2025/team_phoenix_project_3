// api.js

export async function fetchMenuItems() {
	try {
		const res = await fetch('/menu/items');
		if (!res.ok) throw new Error('Failed to fetch menu items');
		return await res.json();
	} catch (err) {
		console.error('Menu fetch error:', err);
		return [];
	}
}

export async function fetchBobaStock() {
	try {
		const res = await fetch('/inventory/boba');
		if (!res.ok) throw new Error('Failed to fetch boba stock');
		return await res.json();
	} catch (err) {
		console.error('Boba stock error:', err);
		return { quantity: 0 };
	}
}

export async function postOrder(order) {
	try {
		const res = await fetch('/order/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(order),
		});
		if (!res.ok) throw new Error('Failed to submit order');
		return await res.json();
	} catch (err) {
		console.error('Order post error:', err);
		return null;
	}
}

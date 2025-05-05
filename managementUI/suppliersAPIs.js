export async function fetchSuppliers() {
	return await fetch('/suppliers/all')
		.then((res) => res.json())
		.catch((err) => {
			console.error('Error fetching suppliers:', err);
			return null;
		});
}

// id = int
// updataData = { supplier_name: "string" }
// AND/OR
// updataData = { phone_number: "string" }
export async function editSupplier(id, updateData) {
	return await fetch(`/suppliers/edit?id=${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updateData),
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error('Error editing supplier:', err);
			return null;
		});
}

// supplier = { supplier_name: "string", phone_number: "string" }
export async function addSupplier(supplier) {
	return await fetch('/suppliers/add', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(supplier),
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error('Error adding supplier:', err);
			return null;
		});
}

// id = int
export async function deleteSupplier(id) {
	return await fetch(`/suppliers/delete?id=${id}`, {
		method: 'DELETE',
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error('Error deleting supplier:', err);
			return null;
		});
}

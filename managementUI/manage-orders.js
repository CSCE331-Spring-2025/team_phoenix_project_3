// Fetch and display order details based on entered order ID
window.fetchOrderDetails = async function () {
    const orderIdInput = document.getElementById('orderIdInput');
    const orderId = parseInt(orderIdInput.value);

    // Validate the input
    if (isNaN(orderId) || orderId <= 0) {
        alert("Please enter a valid Order ID.");
        return;
    }

    try {
        const response = await fetch(`/order/items/${orderId}`);
        if (!response.ok) throw new Error(`Failed to fetch details for order #${orderId}.`);

        const orderItems = await response.json();
        console.log(`Order #${orderId} Details:`, orderItems); // Debugging line

        // Display order details in the container
        const orderDetailsContainer = document.getElementById('orderDetailsContainer');
        orderDetailsContainer.innerHTML = `
            <h3>Order #${orderId} Details</h3>
            <ul>
                ${orderItems.map(item => `
                    <li>
                        <strong>${item.item_name}</strong> - $${item.price.toFixed(2)}
                    </li>
                `).join('')}
            </ul>
        `;
    } catch (err) {
        console.error(`Error fetching details for order #${orderId}:`, err);
        alert(`Failed to load details for order #${orderId}.`);
    }
}


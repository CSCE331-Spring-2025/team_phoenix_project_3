const dailySalesContainer = document.getElementById('dailySalesContainer');

// Fetch and display daily sales
async function fetchDailySales() {
    try {
        const response = await fetch('/order/daily-sales');
        if (!response.ok) throw new Error('Failed to fetch daily sales.');

        const dailySales = await response.json();
        console.log('Daily Sales:', dailySales); // Debugging line

        // Clear the container
        dailySalesContainer.innerHTML = '';

        // Display daily sales
        dailySales.forEach(sale => {
            const saleDiv = document.createElement('div');
            saleDiv.className = 'dailySalesCard';

            saleDiv.innerHTML = `
                <p><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</p>
                <p><strong>Total Sales:</strong> $${sale.total_sales.toFixed(2)}</p>
                <p><strong>Total Orders:</strong> ${sale.total_orders}</p>
            `;

            dailySalesContainer.appendChild(saleDiv);
        });
    } catch (err) {
        console.error('Error fetching daily sales:', err);
        dailySalesContainer.innerHTML = '<p>Failed to load daily sales.</p>';
    }
}

// Initialize the page by fetching daily sales
fetchDailySales();

// Fetch and display order details
async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`/order/items/${orderId}`);
        if (!response.ok) throw new Error(`Failed to fetch details for order #${orderId}.`);

        const orderItems = await response.json();
        console.log(`Order #${orderId} Details:`, orderItems); // Debugging line

        // Display order details in a modal or a separate section
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

// Initialize the page by fetching the order history
fetchOrderHistory();
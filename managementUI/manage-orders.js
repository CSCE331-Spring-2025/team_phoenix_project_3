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
                <p><strong>Total Sales:</strong> $${sale.total_sales}</p>
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

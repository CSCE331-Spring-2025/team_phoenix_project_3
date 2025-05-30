// Function to display X-Report
/*function displayXReport(hourData) {
    const xReportContainer = document.getElementById('xReportContainer');
    xReportContainer.innerHTML = '<h2>X-Report (Hourly Data)</h2>';
    xReportContainer.innerHTML =`
            <div class="report-item">
                <p><strong>Hour:</strong> ${hourData.hour}</p>
                <p><strong>Total Sales:</strong> $${hourData.total_sales.toFixed(2)}</p>
                <p><strong>Credit Card Sales:</strong> 100%</p>
                <p><strong>Cash Sales:</strong> 0%</p>
                <hr>
            </div>
        `;;
}*/

function displayXReport(hourData) {
    const xReportContainer = document.getElementById('xReportContainer');
    xReportContainer.innerHTML = '<h2>X-Report (Hourly Data)</h2>';

    // Check if hourData is an object
    if (!hourData || typeof hourData !== 'object') {
        xReportContainer.innerHTML += `<p>Error: X-Report data is not in the expected format.</p>`;
        console.error("Invalid X-Report data:", hourData);
        return;
    }

    // Iterate over the keys of the object
    Object.keys(hourData).forEach((hour) => {
        const totalSales = parseFloat(hourData[hour]); // Convert the sales value to a number
        if (isNaN(totalSales)) {
            console.error(`Invalid sales value for hour ${hour}:`, hourData[hour]);
            return;
        }

        xReportContainer.innerHTML += `
            <div class="report-item">
                <p><strong>Hour:</strong> ${hour}</p>
                <p><strong>Total Sales:</strong> $${totalSales.toFixed(2)}</p>
                <p><strong>Credit Card Sales:</strong> 100%</p>
                <p><strong>Cash Sales:</strong> 0%</p>
                <hr>
            </div>
        `;
    });
}

// Function to display Z-Report
function displayZReport(zReportData) {
    const zReportContainer = document.getElementById('zReportContainer');
    zReportContainer.innerHTML = `
        <h2>Z-Report (Daily Summary)</h2>
        <p><strong>Store Name: Phoenix Boba Shop</strong></p>
        <p><strong>Address:</strong> 123 Boba Street, Galveston, TX</p>
        <p><strong>Terminal ID:</strong> POS-01</p>
        <p><strong>Register ID:</strong> Reg-07</p>
        <p><strong>Total Sales:</strong> $${zReportData.total_sales.toFixed(2)}</p>
        <p><strong>Total Tax:</strong> $${(zReportData.total_sales * 0.0825).toFixed(2)}</p>
        <p><strong>Total Credit Card Sales:</strong> $${zReportData.total_sales.toFixed(2)}</p>
        <p><strong>Total Cash Sales:</strong> $0.00</p>
        <hr>
    `;
}

// Fetch and display X-Report
async function fetchXReport() {
    try {
        const xResponse = await fetch('/report/x', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (xResponse.ok) {
            const xReportData = await xResponse.json();
            console.log("X-Report Data:", xReportData); // Debugging line
            displayXReport(xReportData);
        } else {
            console.error("Failed to fetch X-Report.");
        }
    } catch (error) {
        console.error("Error fetching X-Report:", error);
    }
}

// Fetch and display Z-Report
async function fetchZReport() {
    try {
        const zResponse = await fetch('/report/z', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (zResponse.ok) {
            const zReportData = await zResponse.json();
            displayZReport(zReportData);
        } else {
            console.error("Failed to fetch Z-Report.");
        }
    } catch (error) {
        console.error("Error fetching Z-Report:", error);
    }
}

// Add event listeners to the buttons
document.getElementById('generateXReportButton').addEventListener('click', fetchXReport);
document.getElementById('generateZReportButton').addEventListener('click', fetchZReport);
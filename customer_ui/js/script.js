fetch('/menu/items')
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));

function order(item) {
    const message = `You ordered: ${item}`;
    document.getElementById('order-message').textContent = message;
    console.log(message);
}

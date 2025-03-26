function order(item) {
    const message = `You ordered: ${item}`;
    document.getElementById('order-message').textContent = message;
    console.log(message);
}

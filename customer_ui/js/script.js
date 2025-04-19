fetch('/menu/items')
    .then((response) => response.json())
    .then((data) => {
        for(let i = 0; i < data.length; i++){
            var newButton = document.createElement("button");
            newButton.innerHTML = data[i].item_name;
            newButton.className += "allButtons"
            if(document.getElementById("allDrinks")) {
                document.getElementById("allDrinks").appendChild(newButton);
            }
            newButton.addEventListener('click', event => drinkID(data[i].id));
        }

        for(let i = 0; i < document.getElementsByClassName("allButtons").length; i++){
            document.getElementsByClassName("allButtons")[i].addEventListener('click', event => drinkName(data[i].item_name));
        }
        for(let i = 0; i < document.getElementsByClassName("ltoButtons").length; i++){
            document.getElementsByClassName("ltoButtons")[i].addEventListener('click', event => drinkName(document.getElementsByClassName("ltoButtons")[i].innerHTML));
        }
        for(let i = 0; i < document.getElementsByClassName("teaButtons").length; i++){
            document.getElementsByClassName("teaButtons")[i].addEventListener('click', event => drinkName(document.getElementsByClassName("teaButtons")[i].innerHTML));
        }
        for(let i = 0; i < document.getElementsByClassName("milkTeaButtons").length; i++){
            document.getElementsByClassName("milkTeaButtons")[i].addEventListener('click', event => drinkName(document.getElementsByClassName("milkTeaButtons")[i].innerHTML));
        }
        for(let i = 0; i < document.getElementsByClassName("smoothieButtons").length; i++){
            document.getElementsByClassName("smoothieButtons")[i].addEventListener('click', event => drinkName(document.getElementsByClassName("smoothieButtons")[i].innerHTML));
        }

        for(let i = 0; i < document.getElementsByClassName("allButtons").length; i++){
            document.getElementsByClassName("allButtons")[i].addEventListener('click', event => showCustomization(data[i].item_name));
        }
    })
    .catch((error) => console.error('Error:', error));

var currentSugar = 0;
var currentBoba = false;
var currentName = "";
var currentId = -1;

function Drink(id, boba, sugar){
    this.id = id;
    this.boba = boba;
    this.sugar = sugar;
}

const order = {
    employee_id: 30,
    order_items: [],
    drinkNames: []
}

function ShowButtons(id){
    var allElement = document.getElementById("allDrinks");
    var ltoElement = document.getElementById("lto");
    var teaElement = document.getElementById("teas");
    var milkTeaElement = document.getElementById("milkTeas");
    var smoothieElement = document.getElementById("smoothies");

    if(id === "allDrinks"){
        allElement.style.display = "inline-block";
        ltoElement.style.display = "none";
        teaElement.style.display = "none";
        milkTeaElement.style.display = "none";
        smoothieElement.style.display = "none";
    }
    else if(id === "lto"){
        allElement.style.display = "none";
        ltoElement.style.display = "inline-block";
        teaElement.style.display = "none";
        milkTeaElement.style.display = "none";
        smoothieElement.style.display = "none";
    }
    else if(id === "teas"){
        allElement.style.display = "none";
        ltoElement.style.display = "none";
        teaElement.style.display = "inline-block";
        milkTeaElement.style.display = "none";
        smoothieElement.style.display = "none";
    }
    else if(id === "milkTeas"){
        allElement.style.display = "none";
        ltoElement.style.display = "none";
        teaElement.style.display = "none";
        milkTeaElement.style.display = "inline-block";
        smoothieElement.style.displsay = "none";
    }
    else if(id === "smoothies"){
        allElement.style.display = "none";
        ltoElement.style.display = "none";
        teaElement.style.display = "none";
        milkTeaElement.style.display = "none";
        smoothieElement.style.display = "inline-block";
    }
}

if(document.getElementsByClassName("sidebarButtons").length > 0){
    document.getElementById("allBtn").addEventListener('click', event => ShowButtons("allDrinks"));
    document.getElementById("ltoBtn").addEventListener('click', event => ShowButtons("lto"));
    document.getElementById("teaBtn").addEventListener('click', event => ShowButtons("teas"));
    document.getElementById("milkTeaBtn").addEventListener('click', event => ShowButtons("milkTeas"));
    document.getElementById("smoothieBtn").addEventListener('click', event => ShowButtons("smoothies"));
}

function displaySubtotal(){
    document.getElementById("subtotal").innerHTML = "";
    document.getElementById("subtotal").insertAdjacentText('beforeend', "Subtotal:");
    document.getElementById("subtotal").insertAdjacentElement('beforeend', document.createElement("br"));
    for(let i = 0; i < order.order_items.length; i++){
        let tempNum = i+1;
        document.getElementById("subtotal").insertAdjacentText('beforeend', tempNum + ". " + order.drinkNames[i]);
        document.getElementById("subtotal").insertAdjacentElement('beforeend', document.createElement("br"));
        if(order.order_items[i].boba === true){
            document.getElementById("subtotal").insertAdjacentText('beforeend', " - With Boba");
        }
        else{
            document.getElementById("subtotal").insertAdjacentText('beforeend', " - Without Boba");
        }
        document.getElementById("subtotal").insertAdjacentElement('beforeend', document.createElement("br"));
        document.getElementById("subtotal").insertAdjacentText('beforeend', " - Sugar:" + order.order_items[i].sugar + "%");
        document.getElementById("subtotal").insertAdjacentElement('beforeend', document.createElement("br"));
    }
    localStorage.setItem("savedSubtotal", JSON.stringify(order));
}

function orderAppend(){
    const newDrink = new Drink(currentId, currentBoba, currentSugar);
    order.order_items.push(newDrink);
    order.drinkNames.push(currentName);
}

let drinksArray = [];
let orderItem;
let namesArray = [];

window.onload = function reloadSubtotal(){
    if(localStorage.getItem("savedSubtotal")){
        orderItem = JSON.parse(localStorage.getItem("savedSubtotal"));
        order.order_items = orderItem.order_items;
        order.drinkNames = orderItem.drinkNames;
        console.log(orderItem);
        document.getElementsByClassName("subtotal")[0].innerHTML = "Subtotal:";
        document.getElementsByClassName("subtotal")[0].insertAdjacentElement('beforeend', document.createElement("br"));
        for(let i = 0; i < order.order_items.length; i++){
            let tempNum = i+1;
            document.getElementsByClassName("subtotal")[0].insertAdjacentText('beforeend', tempNum + ". " + order.drinkNames[i]);
            document.getElementsByClassName("subtotal")[0].insertAdjacentElement('beforeend', document.createElement("br"));
            if(order.order_items[i].boba === true){
                document.getElementsByClassName("subtotal")[0].insertAdjacentText('beforeend', " - With Boba");
            }
            else{
                document.getElementsByClassName("subtotal")[0].insertAdjacentText('beforeend', " - Without Boba");
            }
            document.getElementsByClassName("subtotal")[0].insertAdjacentElement('beforeend', document.createElement("br"));
            document.getElementsByClassName("subtotal")[0].insertAdjacentText('beforeend', " - Sugar:" + order.order_items[i].sugar + "%");
            document.getElementsByClassName("subtotal")[0].insertAdjacentElement('beforeend', document.createElement("br"));
        }
    }
}

function clearLocalStorage(){
    localStorage.clear();
}

if(document.getElementById("finishOrder")){
    document.getElementById("finishOrder").addEventListener('click', clearLocalStorage);
}
if(document.getElementById("back")){
    document.getElementById("back").addEventListener('click', clearLocalStorage);
}

function boba(choice){
    if(choice === true){
        document.getElementsByClassName("bobaStatus")[0].innerHTML = "Boba: Yes";
    }
    else{
        document.getElementsByClassName("bobaStatus")[0].innerHTML = "Boba: No";
    }
    currentBoba = choice;
}

if(document.getElementsByClassName("withoutBoba").length > 0){
    document.getElementsByClassName("withoutBoba")[0].addEventListener('click', event => boba(false));
}
if(document.getElementsByClassName("withBoba").length > 0){
    document.getElementsByClassName("withBoba")[0].addEventListener('click', event => boba(true));
}

function sugar(level){
    document.getElementsByClassName("sugarStatus")[0].innerHTML = "Sugar level: " + level + "%";
    currentSugar = level;
}

if(document.getElementsByClassName("sugar").length > 0){
    document.getElementsByClassName("sugar")[0].addEventListener('click', event => sugar(0));
    document.getElementsByClassName("sugar")[1].addEventListener('click', event => sugar(50));
    document.getElementsByClassName("sugar")[2].addEventListener('click', event => sugar(100));
    document.getElementsByClassName("sugar")[3].addEventListener('click', event => sugar(150));
}

function showCustomization(name){
    document.getElementById("customization").style.display = "inline-block";
    document.getElementsByClassName("subtotal")[0].style.display = "none";
    document.getElementsByClassName("drinkName")[0].innerHTML = name;
}

function hideCustomization(){
    document.getElementById("customization").style.display = "none";
    document.getElementsByClassName("subtotal")[0].style.display = "inline-block";
}

if(document.getElementsByClassName("cancel").length > 0){
    document.getElementsByClassName("cancel")[0].addEventListener('click', hideCustomization);
    document.getElementsByClassName("cancel")[0].addEventListener('click', event => drinkName("none"));
    
}

function drinkName(name){
    currentName = name;
}

function drinkID(id){
    currentId = id;
}

if(document.getElementsByClassName("addDrink").length > 0){
    document.getElementsByClassName("addDrink")[0].addEventListener('click', hideCustomization);
    document.getElementsByClassName("addDrink")[0].addEventListener('click', event => orderAppend());
    document.getElementsByClassName("addDrink")[0].addEventListener('click', event => displaySubtotal());
    document.getElementsByClassName("addDrink")[0].addEventListener('click', event => drinkName("none"));
}

if(document.getElementById("finishOrder")){
    const saved = localStorage.getItem("savedSubtotal")
    document.getElementById("finishOrder").addEventListener('click',  event => createOrder(saved));
}

function createOrder(order){
    fetch('/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: order,
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            // easiest way to get the values from the data
            const { id, subtotal, time_placed } = data;
            console.log('Order created:', data);
        })
        .catch((err) => {
            console.error('Failed to create order:', err);
        });
    
}

var orderIndex;

if(document.getElementsByClassName("remove").length > 0){
    document.getElementsByClassName("remove")[0].addEventListener('click', event => {
        orderIndex = document.getElementsByClassName("removeText")[0].value;
        if(isNaN(parseInt(orderIndex))){
            // idk maybe do something like warn the user i guess
        }
        else{
            removeFromOrder(orderIndex);
        }
    });
}

function removeFromOrder(num){
    if(num > 0){
        order.order_items.splice(num-1, 1);
        order.drinkNames.splice(num-1, 1);
        localStorage.setItem("savedSubtotal", JSON.stringify(order));
        displaySubtotal();
    }
}
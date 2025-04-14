fetch('/menu/items')
    .then((response) => response.json())
    .then((data) => {
        for(let i = 0; i < data.length; i++){
            var newButton = document.createElement("button");
            newButton.innerHTML = data[i].item_name;
            newButton.className += "allButtons"
            if(document.getElementById("allDrinks") !== null) {
                document.getElementById("allDrinks").appendChild(newButton);
            }
        }

        for(let i = 0; i < document.getElementsByClassName("allButtons").length; i++){
            document.getElementsByClassName("allButtons")[i].addEventListener('click', event => drinkName(document.getElementsByClassName("allButtons")[i].innerHTML));
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
            document.getElementsByClassName("allButtons")[i].addEventListener('click', showCustomization);
        }
    })
    .catch((error) => console.error('Error:', error));

var currentSugar = 0;
var currentBoba = false;
var currentName = "";
var currentId = -1;

function Drink(id, boba, sugar, name){
    this.id = id;
    this.boba = boba;
    this.sugar = sugar;
    this.name = name;
}

const order = {
    employee_id: 30,
    drinks: []
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
    for(let i = 0; i < order.drinks.length; i++){
        document.getElementById("subtotal").insertAdjacentText('beforeend', order.drinks[i].name);
        document.getElementById("subtotal").insertAdjacentElement('beforeend', document.createElement("br"));
        if(order.drinks[i].boba === true){
            document.getElementById("subtotal").insertAdjacentText('beforeend', " - With Boba");
        }
        else{
            document.getElementById("subtotal").insertAdjacentText('beforeend', " - Without Boba");
        }
        document.getElementById("subtotal").insertAdjacentElement('beforeend', document.createElement("br"));
        document.getElementById("subtotal").insertAdjacentText('beforeend', " - Sugar:" + order.drinks[i].sugar + "%");
        document.getElementById("subtotal").insertAdjacentElement('beforeend', document.createElement("br"));
    }
    localStorage.setItem("savedSubtotal", JSON.stringify(order));
}

function orderAppend(){
    const newDrink = new Drink(-1, currentBoba, currentSugar, currentName);
    order.drinks.push(newDrink);
}

let drinksArray = [];
let orderItem;

window.onload = function reloadSubtotal(){
    if(localStorage.getItem("savedSubtotal") !== null){
        orderItem = JSON.parse(localStorage.getItem("savedSubtotal"));
        drinksArray = orderItem.drinks;
        document.getElementsByClassName("subtotal")[0].innerHTML = "Subtotal:";
        document.getElementsByClassName("subtotal")[0].insertAdjacentElement('beforeend', document.createElement("br"));
        for(let i = 0; i < drinksArray.length; i++){
            document.getElementsByClassName("subtotal")[0].insertAdjacentText('beforeend', drinksArray[i].name);
            document.getElementsByClassName("subtotal")[0].insertAdjacentElement('beforeend', document.createElement("br"));
            if(drinksArray[i].boba === true){
                document.getElementsByClassName("subtotal")[0].insertAdjacentText('beforeend', " - With Boba");
            }
            else{
                document.getElementsByClassName("subtotal")[0].insertAdjacentText('beforeend', " - Without Boba");
            }
            document.getElementsByClassName("subtotal")[0].insertAdjacentElement('beforeend', document.createElement("br"));
            document.getElementsByClassName("subtotal")[0].insertAdjacentText('beforeend', " - Sugar:" + drinksArray[i].sugar + "%");
            document.getElementsByClassName("subtotal")[0].insertAdjacentElement('beforeend', document.createElement("br"));
        }
    }
}

function clearLocalStorage(){
    localStorage.clear();
}

if(document.getElementById("finishOrder") !== null){
    document.getElementById("finishOrder").addEventListener('click', clearLocalStorage);
}
if(document.getElementById("back") !== null){
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

if(document.getElementsByClassName("withoutBoba")[0] !== null){
    document.getElementsByClassName("withoutBoba")[0].addEventListener('click', event => boba(false));
}
if(document.getElementsByClassName("withBoba")[0] !== null){
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

function showCustomization(){
    document.getElementById("customization").style.display = "inline-block";
    document.getElementsByClassName("subtotal")[0].style.display = "none";
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

if(document.getElementsByClassName("addDrink").length > 0){
    document.getElementsByClassName("addDrink")[0].addEventListener('click', hideCustomization);
    document.getElementsByClassName("addDrink")[0].addEventListener('click', event => orderAppend());
    document.getElementsByClassName("addDrink")[0].addEventListener('click', event => displaySubtotal());
    document.getElementsByClassName("addDrink")[0].addEventListener('click', event => drinkName("none"));
}

if(document.getElementById("finishOrder") === true){
    document.getElementById("finishOrder").addEventListener('click', event => createOrder(order));
}

function createOrder(order){
    fetch('/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            employee_id: order.employee_id,
            order_items: order.drinks,
        }),
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
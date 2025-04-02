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
    })
    .catch((error) => console.error('Error:', error));

function ShowLTO(id){
    var allElement = document.getElementById("allDrinks");
    var ltoElement = document.getElementById("lto");
    var teaElement = document.getElementById("teas");
    var coffeeElement = document.getElementById("coffee");
    var smoothieElement = document.getElementById("smoothies");
    var milkshakeElement = document.getElementById("milkshakes");

    if(id === "allDrinks"){
        allElement.style.display = "inline-block";
        ltoElement.style.display = "none";
        teaElement.style.display = "none";
        coffeeElement.style.display = "none";
        smoothieElement.style.display = "none";
        milkshakeElement.style.display = "none";
    }
    else if(id === "lto"){
        allElement.style.display = "none";
        ltoElement.style.display = "inline-block";
        teaElement.style.display = "none";
        coffeeElement.style.display = "none";
        smoothieElement.style.display = "none";
        milkshakeElement.style.display = "none";
    }
    else if(id === "teas"){
        allElement.style.display = "none";
        ltoElement.style.display = "none";
        teaElement.style.display = "inline-block";
        coffeeElement.style.display = "none";
        smoothieElement.style.display = "none";
        milkshakeElement.style.display = "none";
    }
    else if(id === "coffee"){
        allElement.style.display = "none";
        ltoElement.style.display = "none";
        teaElement.style.display = "none";
        coffeeElement.style.display = "inline-block";
        smoothieElement.style.display = "none";
        milkshakeElement.style.display = "none";
    }
    else if(id === "smoothies"){
        allElement.style.display = "none";
        ltoElement.style.display = "none";
        teaElement.style.display = "none";
        coffeeElement.style.display = "none";
        smoothieElement.style.display = "inline-block";
        milkshakeElement.style.display = "none";
    }
    else if(id === "milkshakes"){
        allElement.style.display = "none";
        ltoElement.style.display = "none";
        teaElement.style.display = "none";
        coffeeElement.style.display = "none";
        smoothieElement.style.display = "none";
        milkshakeElement.style.display = "inline-block";
    }
}

if(document.getElementsByClassName("sidebarButtons").length > 0){
    document.getElementById("allBtn").addEventListener('click', event => ShowLTO("allDrinks"));
    document.getElementById("ltoBtn").addEventListener('click', event => ShowLTO("lto"));
    document.getElementById("teaBtn").addEventListener('click', event => ShowLTO("teas"));
    document.getElementById("coffeeBtn").addEventListener('click', event => ShowLTO("coffee"));
    document.getElementById("smoothieBtn").addEventListener('click', event => ShowLTO("smoothies"));
    document.getElementById("milkshakeBtn").addEventListener('click', event => ShowLTO("milkshakes"));
}

let subtotalArray = ["Total:"];

for(let i = 0; i < document.getElementsByClassName("teaButtons").length; i++){
    document.getElementsByClassName("teaButtons")[i].addEventListener('click', event => subtotalAppend(document.getElementsByClassName("teaButtons")[i].innerHTML));
}

function subtotalAppend(text){
    subtotalArray.push(text);

    document.getElementById("subtotal").innerHTML = "";
    for(let i = 0; i < subtotalArray.length; i++){
        document.getElementById("subtotal").insertAdjacentText('beforeend', subtotalArray[i]);
        document.getElementById("subtotal").insertAdjacentElement('beforeend', document.createElement("br"));
    }
    localStorage.setItem("savedSubtotal", JSON.stringify(subtotalArray));
}

window.onload = function reloadSubtotal(){
    if(localStorage.getItem("savedSubtotal") !== null){
        subtotalArray = JSON.parse(localStorage.getItem("savedSubtotal"));
        document.getElementsByClassName("subtotal")[0].innerHTML = "";
        for(let i = 0; i < subtotalArray.length; i++){
            document.getElementsByClassName("subtotal")[0].insertAdjacentText('beforeend', subtotalArray[i]);
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
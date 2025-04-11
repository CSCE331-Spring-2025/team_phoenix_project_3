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
            document.getElementsByClassName("allButtons")[i].addEventListener('click', event => updateCurrentDrink(document.getElementsByClassName("allButtons")[i].innerHTML));
        }
        for(let i = 0; i < document.getElementsByClassName("ltoButtons").length; i++){
            document.getElementsByClassName("ltoButtons")[i].addEventListener('click', event => updateCurrentDrink(document.getElementsByClassName("ltoButtons")[i].innerHTML));
        }
        for(let i = 0; i < document.getElementsByClassName("teaButtons").length; i++){
            document.getElementsByClassName("teaButtons")[i].addEventListener('click', event => updateCurrentDrink(document.getElementsByClassName("teaButtons")[i].innerHTML));
        }
        for(let i = 0; i < document.getElementsByClassName("milkTeaButtons").length; i++){
            document.getElementsByClassName("milkTeaButtons")[i].addEventListener('click', event => updateCurrentDrink(document.getElementsByClassName("milkTeaButtons")[i].innerHTML));
        }
        for(let i = 0; i < document.getElementsByClassName("smoothieButtons").length; i++){
            document.getElementsByClassName("smoothieButtons")[i].addEventListener('click', event => updateCurrentDrink(document.getElementsByClassName("smoothieButtons")[i].innerHTML));
        }

        for(let i = 0; i < document.getElementsByClassName("allButtons").length; i++){
            document.getElementsByClassName("allButtons")[i].addEventListener('click', showCustomization);
        }
    })
    .catch((error) => console.error('Error:', error));


const currentDrink = {
    id: -1,
    boba: false,
    sugar: 0,
    name: "none"
};

function ShowLTO(id){
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
        smoothieElement.style.display = "none";
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
    document.getElementById("allBtn").addEventListener('click', event => ShowLTO("allDrinks"));
    document.getElementById("ltoBtn").addEventListener('click', event => ShowLTO("lto"));
    document.getElementById("teaBtn").addEventListener('click', event => ShowLTO("teas"));
    document.getElementById("milkTeaBtn").addEventListener('click', event => ShowLTO("milkTeas"));
    document.getElementById("smoothieBtn").addEventListener('click', event => ShowLTO("smoothies"));
}

let subtotalArray = ["Total:"];

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

function boba(choice){
    if(choice === true){
        document.getElementsByClassName("bobaStatus")[0].innerHTML = "Boba: Yes";
    }
    else{
        document.getElementsByClassName("bobaStatus")[0].innerHTML = "Boba: No";
    }
    currentDrink.boba = choice;
}

if(document.getElementsByClassName("withoutBoba")[0] !== null){
    document.getElementsByClassName("withoutBoba")[0].addEventListener('click', event => boba(false));
}
if(document.getElementsByClassName("withBoba")[0] !== null){
    document.getElementsByClassName("withBoba")[0].addEventListener('click', event => boba(true));
}

function sugar(level){
    document.getElementsByClassName("sugarStatus")[0].innerHTML = "Sugar level: " + level + "%";
    currentDrink.sugar = level;
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
    document.getElementsByClassName("cancel")[0].addEventListener('click', event => updateCurrentDrink("none"));
    
}



function updateCurrentDrink(drink){
    currentDrink.name = drink;
}

if(document.getElementsByClassName("addDrink").length > 0){
    document.getElementsByClassName("addDrink")[0].addEventListener('click', hideCustomization);
    document.getElementsByClassName("addDrink")[0].addEventListener('click', event => subtotalAppend(currentDrink.name));
    if(currentDrink.name === true){
        document.getElementsByClassName("addDrink")[0].addEventListener('click', event => subtotalAppend(" - With boba"));
    }
    else{
        document.getElementsByClassName("addDrink")[0].addEventListener('click', event => subtotalAppend(" - No boba"));
    }
    document.getElementsByClassName("addDrink")[0].addEventListener('click', event => subtotalAppend(" - " + currentDrink.sugar + "% sugar"));
    document.getElementsByClassName("addDrink")[0].addEventListener('click', event => updateCurrentDrink("none"));
}

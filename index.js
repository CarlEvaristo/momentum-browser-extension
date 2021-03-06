const key = "l64Sk4kAeygdViL7Pku6kGTbBV6QMV5X0cWVblAnduI"

const cryptoBox = document.getElementById("crypto")
const nameInput = document.getElementById("nameInput")
const deleteBtn =  document.getElementById("delete")

const cryptoInput = document.getElementById("cryptoInput")
const cryptoPlus = document.getElementById("cryptoPlus")

const quoteText = document.getElementById("quoteTxt")
const quoteAuthor = document.getElementById("quoteAuthor")


//render background image and author's name
async function backgroundImage() {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=miami%20beach&client_id=${key}`)
        // const response = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
        const data = await response.json()
        // render author's name and photo location (if available) on bottom left of screen
        document.getElementById("author").textContent = `Photo by: ${data.user.name}. ${(data.location.name === null) ? "" : "Location: " + data.location.name}`
        document.body.style.backgroundImage = `url(${data.urls.full})`
    } 
    catch (err) {
        document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1458966480358-a0ac42de0a7a?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMzg3MDR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTU0NTg0ODA&ixlib=rb-1.2.1&q=80)"
        console.log(`Displays default image due to error: ${err}.`)
    }
}


//render crypto prices
async function renderCryptoHtml() {
    let coins = JSON.parse(localStorage.getItem("coins"));
    if (coins.length > 4) {
        cryptoPlus.style.display= "none"
    }
    try {
        cryptoBox.innerHTML = ""    
        for (let item of coins) {
            // code to request coin id
            let response1 = await fetch(`https://api.coingecko.com/api/v3/coins/list`, {
                headers: {
                    "Content-Type": "application/json",
                    "mode":'no-cors'
                }
            })

            let data1 = await response1.json()
            let coin = data1.filter(coin => coin.name === item)[0]
            // code to request coin price
            let response3 = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "mode":'no-cors'
                }
            })
            let data3 = await response3.json()
            let coinPrice = data3.market_data.current_price.usd   // 4 deciaml places
            let coinImg = data3.image.thumb
            // code to create/append html element
            let newCoinEl = document.createElement("li")
            let coinImgEl = document.createElement("img")
            coinImgEl.src = coinImg
            let coinTextEl = document.createElement("p")
            coinTextEl.textContent = `${coin.name}: $ ${coinPrice}`
            coinTextEl.classList.add("coin-text")
            
            //remove button (was difficult)
            let coinBtnEl = document.createElement("button")
            coinBtnEl.id = coin.name
            coinBtnEl.className = "delete"
            coinBtnEl.innerHTML = "x"

            newCoinEl.appendChild(coinImgEl)
            newCoinEl.appendChild(coinTextEl)
            newCoinEl.appendChild(coinBtnEl)
            cryptoBox.appendChild(newCoinEl)
        }
        for (let item of coins) {
            document.getElementById(item).addEventListener("click", event => removeCoin(event.target.id))
        }
    } catch(err) {console.log("Error: ", err)}
}

//remove crypto coin 
function removeCoin(coinName) {
    let coins = JSON.parse(localStorage.getItem("coins"));
    coins = coins.filter(coin => coin !== coinName)
    localStorage.setItem("coins", JSON.stringify(coins));
    console.log("Coin removed")
    renderCryptoHtml()
    if (coins.length <= 5) {
        cryptoPlus.style.display= "inline"
        cryptoInput.style.display = "none"
    }
}

//save crypto coin
async function saveCoin(coinName) {
    try {
       let coins = JSON.parse(localStorage.getItem("coins"));
       if (!coins.includes(coinName)) {

            //check if coin exists
            let res = await fetch(`https://api.coingecko.com/api/v3/coins/list`, {
                headers: {
                    "Content-Type": "application/json",
                    "mode":'no-cors'
                }
            })
            let data = await res.json()
            let coin = data.filter(coin => coin.name === coinName)[0]

            if (coin !== undefined) {
                coins = [...coins, coinName]
                localStorage.setItem("coins", JSON.stringify(coins));
                console.log("Coin saved")
                renderCryptoHtml()
                cryptoPlus.style.display= "inline"
                cryptoInput.style.display = "none"
                if (coins.length > 4) {
                    cryptoPlus.style.display= "none"
                }
            }
        } else {
            console.log("Coin already in list")
        }
    } catch {
        console.log("No movies yet, created new list in storage")
        let coins = [coinName]
        localStorage.setItem("coins", JSON.stringify(coins));
        renderCryptoHtml()
    }
}


//welcome message + get username
function welcomeMessage(newDate) {
    let userName
    if (localStorage.getItem("momentum-name") === null) {
        userName = ""
        nameInput.style.display = "inline"
        deleteBtn.style.display = "none"
    } else {
        userName = localStorage.getItem("momentum-name")
        nameInput.style.display = "none"
        deleteBtn.style.display = "inline"
    }

    return (newDate.getHours() < 6) ? `Good night, ${userName}` : 
            (newDate.getHours() < 12) ? `Good morning, ${userName}` : 
            (newDate.getHours() < 18) ? `Good afternoon, ${userName}` : 
            `Good evening, ${userName}`
}

//render weather
async function getWeather(position) {
    const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=b1970f8b5bfac16ba049630faed3055e`)
    const data = await weatherData.json()
    document.getElementById("weather-temperature").innerHTML = ` <img class="weather-img" src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"><p class="weather-temp">${(data.main.temp - 273.15).toFixed(1)}??</p> `
    document.getElementById("weather-location").textContent = data.name
}

async function getQuote() {
    const quoteData = await fetch("https://type.fit/api/quotes")
    const data = await quoteData.json()
    let randomNum = Math.floor(Math.random() * 1600);
    quoteText.textContent = data[randomNum].text
    quoteAuthor.textContent = data[randomNum].author
}

//RUN CODE

backgroundImage()
navigator.geolocation.getCurrentPosition(position => getWeather(position))
getQuote()
renderCryptoHtml()

nameInput.setAttribute('size', nameInput.getAttribute('placeholder').length-2);
nameInput.focus();

cryptoPlus.addEventListener("click", () => {
    cryptoInput.style.display = "inline"
    cryptoPlus.style.display = "none"
})


if (localStorage.getItem("coins") === null) {
    localStorage.setItem("coins", JSON.stringify(['Bitcoin', 'Ethereum']))
    renderCryptoHtml()
}

if (JSON.parse(localStorage.getItem("coins")).length === 0) {
    localStorage.removeItem("coins")
    location.reload()
}

// add crypto coins to list and call crypto render function
cryptoInput.addEventListener("change", () => {
    saveCoin(cryptoInput.value)
    cryptoInput.value = ""
})

//render time and welcome message
setInterval(()=>{
    let newDate = new Date 
    let hours = ((newDate.getHours() < 10) ? "0" : "") + (newDate.getHours())
    let minutes = ((newDate.getMinutes() < 10) ? "0" : "") + (newDate.getMinutes())
    document.getElementById("time").textContent = `${hours}:${minutes}`
    document.getElementById("welcome-message").textContent = welcomeMessage(newDate)
},1000)

//set username by pressing enter key
nameInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        if (nameInput.value !== "") {
            localStorage.setItem("momentum-name", nameInput.value)
            nameInput.style.display = "none"
            deleteBtn.style.display = "inline"
            nameInput.value = ""
        }
    }
});

//remove username
deleteBtn.addEventListener("click", () => {
    localStorage.removeItem("momentum-name")
})





/**
 * URL: https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature
 * https://css-tricks.com/perfect-full-page-background-image/#awesome-easy-progressive-css3-way)
 */

const key = "l64Sk4kAeygdViL7Pku6kGTbBV6QMV5X0cWVblAnduI"
// const secret = "9yfrd_b0bbZNCnA2stl0UfqVWRVC1xn81OcVH7x8t8A"

const cryptoBox = document.getElementById("crypto")
const inputBtn = document.getElementById("inputBtn")

const nameInput = document.getElementById("nameInput")
const deleteBtn =  document.getElementById("delete")

const cryptoInput = document.getElementById("cryptoInput")
const cryptoBtn =  document.getElementById("cryptoBtn")

const quoteText = document.getElementById("quoteTxt")
const quoteAuthor = document.getElementById("quoteAuthor")

//render background image and author's name
async function backgroundImage() {
    try {
        // const response = await fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=${key}`)
        const response = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
        const data = await response.json()
        
        // render author's name bottom left of screen
        document.getElementById("author").textContent = `Photo by: ${data.user.name}`
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

    try {
        cryptoBox.innerHTML = ""    
        for (let item of coins) {
            // code to request coin id
            let response1 = await fetch(`https://api.coingecko.com/api/v3/coins/list`)
            let data1 = await response1.json()
            let coin = data1.filter(coin => coin.name === item)[0]
            // code to request coin price
            let response3 = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`)
            let data3 = await response3.json()
            let coinPrice = data3.market_data.current_price.usd   // 4 deciaml places
            let coinImg = data3.image.small
            // code to create/append html element
            let newCoinEl = document.createElement("li")
            let coinImgEl = document.createElement("img")
            coinImgEl.src = coinImg
            let coinNameEl = document.createElement("p")
            coinNameEl.textContent = `${coin.name}: $ ${coinPrice}`
            
            //remove button (was difficult)
            let coinBtnEl = document.createElement("button")
            coinBtnEl.id = coin.name
            coinBtnEl.className = "fa-solid fa-trash-can delete"

            newCoinEl.appendChild(coinImgEl)
            newCoinEl.appendChild(coinNameEl)
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
    if (coins.length <= 3) {
        cryptoBtn.style.display= "inline"
        cryptoInput.style.display= "inline"
    }
}

//save crypto coin
async function saveCoin(coinName) {
    try {
       let coins = JSON.parse(localStorage.getItem("coins"));
       if (!coins.includes(coinName)) {

            //check if coin exists
            let res = await fetch(`https://api.coingecko.com/api/v3/coins/list`)
            let data = await res.json()
            let coin = data.filter(coin => coin.name === coinName)[0]

            if (coin !== undefined) {
                coins = [...coins, coinName]
                localStorage.setItem("coins", JSON.stringify(coins));
                console.log("Coin saved")
                renderCryptoHtml()
                if (coins.length > 3) {
                    cryptoBtn.style.display= "none"
                    cryptoInput.style.display= "none"
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
        inputBtn.style.display = "inline"
        nameInput.style.display = "inline"
        deleteBtn.style.display = "none"
    } else {
        userName = localStorage.getItem("momentum-name")
        inputBtn.style.display = "none"
        nameInput.style.display = "none"
        deleteBtn.style.display = "inline"
    }

    return (newDate.getHours() < 6) ? `Good night ${userName}` : 
            (newDate.getHours() < 12) ? `Good morning ${userName}` : 
            (newDate.getHours() < 18) ? `Good afternoon ${userName}` : 
            `Good evening ${userName}`
}

//render weather
async function getWeather(position) {
    const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=b1970f8b5bfac16ba049630faed3055e`)
    const data = await weatherData.json()
    document.getElementById("weather-temperature").innerHTML = ` <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"><p>${(data.main.temp - 273.15).toFixed(1)}°</p> `
    document.getElementById("weather-location").textContent = data.name
}

async function getQuote() {
    const quoteData = await fetch("https://type.fit/api/quotes")
    const data = await quoteData.json()
    let randomNum = Math.floor(Math.random() * 1600);
    quoteText.textContent = data[randomNum].text
    quoteAuthor.textContent = data[randomNum].author
}

backgroundImage()
navigator.geolocation.getCurrentPosition(position => getWeather(position))
getQuote()
renderCryptoHtml()

if (JSON.parse(localStorage.getItem("coins")).length === 0) {
    localStorage.removeItem("coins")
    location.reload()
}

if (localStorage.getItem("coins") === null) {
    JSON.parse(localStorage.setItem("coins", JSON.stringify(["Bitcoin", "Ethereum"])));
    renderCryptoHtml()
}


// add crypto coins to list and call crypto render function
cryptoBtn.addEventListener("click", () => {
    saveCoin(cryptoInput.value)
    cryptoInput.value = ""
})

//render time and welcome message
setInterval(()=>{
    let newDate = new Date
    document.getElementById("time").textContent = newDate.toLocaleTimeString()
    document.getElementById("welcome-message").textContent = welcomeMessage(newDate)
},1000)

//set username
inputBtn.addEventListener("click", () => {
    localStorage.setItem("momentum-name", nameInput.value)
    inputBtn.style.display = "none"
    nameInput.style.display = "none"
    deleteBtn.style.display = "inline"
    nameInput.value = ""
})

//remove username
deleteBtn.addEventListener("click", () => {
    localStorage.removeItem("momentum-name")
})





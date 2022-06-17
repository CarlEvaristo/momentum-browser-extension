/**
 * URL: https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature
 * https://css-tricks.com/perfect-full-page-background-image/#awesome-easy-progressive-css3-way)
 */

const key = "l64Sk4kAeygdViL7Pku6kGTbBV6QMV5X0cWVblAnduI"
// const secret = "9yfrd_b0bbZNCnA2stl0UfqVWRVC1xn81OcVH7x8t8A"

async function backgroundImage() {
    try {
        // const response = await fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=${key}`)
        const response = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
        const data = await response.json()
        
        // render author's name bottom left of screen
        document.getElementById("author").textContent = `By: ${data.user.name}`
        document.body.style.backgroundImage = `url(${data.urls.full})`
    } 
    catch (err) {
        document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1458966480358-a0ac42de0a7a?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMzg3MDR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTU0NTg0ODA&ixlib=rb-1.2.1&q=80)"
        console.log(`Displays default image due to error: ${err}.`)
    }
}

async function cryptoPrices(arrayOfCoins) {
    for (let item of arrayOfCoins) {
        // code to request coin id
        const response1 = await fetch(`https://api.coingecko.com/api/v3/coins/list`)
        const data1 = await response1.json()
        let coin = data1.filter(coin => coin.name === item)[0]

        // code to request coin price
        const response3 = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`)
        const data3 = await response3.json()
        let coinPrice = data3.market_data.current_price.usd   // 4 deciaml places
        let coinImg = data3.image.small

        // code to create/append html element
        let newCoin = document.createElement("li")
        newCoin.innerHTML = `
        <img src="${coinImg}" class="li-img">
        ${coin.name}: ${coinPrice}
        `
        document.getElementById("crypto").appendChild(newCoin)
    }
}

//render crypto prices
cryptoPrices(["Dogecoin", "Bitcoin"])

//render background image and author's name
backgroundImage()

//render time 
const time = document.getElementById("time")
time.textContent = (new Date).toLocaleTimeString()


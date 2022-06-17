/**
 * URL: https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature
 * https://css-tricks.com/perfect-full-page-background-image/#awesome-easy-progressive-css3-way)
 */

const key = "l64Sk4kAeygdViL7Pku6kGTbBV6QMV5X0cWVblAnduI"
// const secret = "9yfrd_b0bbZNCnA2stl0UfqVWRVC1xn81OcVH7x8t8A"

const time = document.getElementById("time")
time.textContent = (new Date).toLocaleTimeString()

fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=${key}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("author").textContent = `By: ${data.user.name}`
        document.body.style.backgroundImage = `url(${data.urls.full})`
    })

/**
 * Challenge: get a random image from Unsplash and set it as the background
 * 
 * Part 1:
 * 
 * URL: https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature
 * (You can change the "query" at the end to whatever theme you want)
 * 
 * Change the body's backgroundImage to: 
 * `url(<insert the URL of the iamge from the API here>)`
 * 
 * (You may need to dig around the response body a bit to find this URL)
 * 
 * (Note I've already added some CSS to resize the image within the window.
 * Instructions for this were found on CSS Tricks: 
 * https://css-tricks.com/perfect-full-page-background-image/#awesome-easy-progressive-css3-way)
 */

const key = "l64Sk4kAeygdViL7Pku6kGTbBV6QMV5X0cWVblAnduI"
//SECREET 9yfrd_b0bbZNCnA2stl0UfqVWRVC1xn81OcVH7x8t8A

fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=${key}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        document.body.style.backgroundImage = `url(${data.urls.regular})`
    })
 
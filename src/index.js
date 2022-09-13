import "./index.css"
const bgvideo = document.getElementById("video-display");
const menuHeader = document.getElementById("menu-header");
const locationHead = document.getElementById("location-header")

bgvideo.src = `videos/Aerial Shot Of Sunset.mp4`
navigator.geolocation.getCurrentPosition((position) => {
    console.log(position)
        // fetch(`http://api.positionstack.com/v1/reverse?access_key=318fd985651cadfd43ac296705714d48&query=${position.coords.latitude},${position.coords.longitude}`)
        //     .then((data) => data.json())
        //     .then((res) => {
        //         console.log(res)
        //     });


    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=db59d7740041baff03be425019205efb&unit=metric`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            localStorage.setItem("forcast", JSON.stringify(data))
                // menuHeader.innerText = data.city
        })

    // fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=5&appid=db59d7740041baff03be425019205efb`)
    //     .then(res => res.json())
    //     .then(data => console.log(data))
})
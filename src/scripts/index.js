import "../styles/index.css"

const summaryDom = document.getElementById("summary")
const forcastDom = document.getElementById("forcast")
const weatherTime = document.getElementById("weathertime")
const currentWeatherImg = document.getElementById("current-weather-img")
const currentWeatherSummary = document.getElementById("current-weather-sum")
const currentWeatherDesc = document.getElementById("current-weather-desc")
const map = document.getElementById("map")
const city = document.getElementById("city-name")
const loading = document.getElementById("loading")
const infoBtns = document.querySelectorAll(".info-btn")
const info = document.getElementById("info")

// add click event to info buttons for small screens //
infoBtns.forEach(btn => btn.addEventListener("click", (e) => {
    info.classList.toggle("active")

    const closeEV = (e) => {
        if (e.target !== info) return
        info.classList.remove("active")
        info.removeEventListener("click", closeEV)
    }

    info.addEventListener("click", closeEV)
}))


// a relation between properties of wather data and their values //
const dataProperties = {
    snow: "Snow",
    rain: "Rain",
    temp: "Temperature",
    uvi: "UV Index",
    clouds: "Cloud",
    wind_speed: "Wind Speed",
    humidity: "Humidity",
    pressure: "Atmospheric Pressure"
}

// a relation between weather property data and their units //
const dataUnits = {
    snow: "mm/h",
    rain: "mm/h",
    temp: "\xB0C",
    clouds: "%",
    wind_speed: "m/s",
    humidity: "%",
    pressure: "hPa"
}

// a relation between weather data and thier description //
const dataDesc = {
    snow: "The average amount of snow per hour",
    rain: "The average amount of rain per hour",
    uvi: "The amount of UV radiation by the sun",
    humidity: "The amount of moisture trapped in the atmosphere",
    pressure: "The amount of force exerted on a surface of the earth by the air",
    wind_speed: "The speed at which the wind blows",
    clouds: "The percentage of the sky that is covered by clouds",
    temp: "It shows how hot or cold the atmosphere is during the day time"
}

// display the map //
function renderMap(lat, lon) {
    map.setAttribute("src", `https://www.google.com/maps/embed/v1/view?key=AIzaSyD1fwGE54-J_4Jy_FTQqOlPS8dMfxZlc0E&center=${lat},${lon}&zoom=12`)
}

// render function for weather current weather data //
function renderSummary(data) {
    summaryDom.innerText = ""

    weatherTime.innerText = new Date(data.dt * 1000).toLocaleTimeString()

    currentWeatherImg.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png) center`

    currentWeatherSummary.innerText = data.weather[0].description

    for (const [prop, propName] of Object.entries(dataProperties)) {
        if (!data[prop]) continue
        const sumEl = document.createElement("div")

        sumEl.innerHTML = `
            <div class="flex flex-col gap-4 items-center w-fit max-w-[210px] overflow-hidden">
                <div class="rounded-[28px] w-[73px] h-[68px] bg-slate-400 flex justify-center items-center bg-center text-white font-extrabold text-xl">${data[prop]["1h"] ? data[prop]["1h"] : data[prop]}</div>
                <span class="text-sm text-center whitespace-nowrap" >${propName}${dataUnits[prop] ? ` (${dataUnits[prop]})` : ""}</span>
            </div>
        `
        summaryDom.appendChild(sumEl)
    }
}

// render City name //
function renderCityName(timezone) {
    city.innerText = timezone.split("/")[1] + ","
}

// render function for weather forcast data //
function renderForecast(weatherData) {
    currentWeatherDesc.innerText = weatherData[1].summary
    const getDate = (date) => {
        const today = new Date(Date.now())
        const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24)
        const tommorow = new Date(Date.now() + 1000 * 60 * 60 * 24)
        const weatherDate = new Date(date * 1000)

        if (
            (yesterday.getDay() === weatherDate.getDay()) &&
            (yesterday.getDate() === weatherDate.getDate())
        ) {
            return "Yesterday"
        } else if (
            (tommorow.getDay() === weatherDate.getDay()) &&
            (tommorow.getDate() === weatherDate.getDate())
        ) {
            return "Tommorow"
        } else if (
            (today.getDay() === weatherDate.getDay()) &&
            (today.getDate() === weatherDate.getDate())
        ) {
            return "Today"
        } else {
            return weatherDate.toDateString()
        }
    }

    forcastDom.innerHTML = `
        ${weatherData.map(data => `
            <div class="bg-[#4ACAF4] min-w-[400px] max-w-[calc(100vw-10px)] rounded-[28px] h-[calc(100dvh-45px)] p-7 overflow-hidden flex flex-col">
                <h2 class="text-2xl text-white font-bold mb-[20px]">${getDate(data.dt)}</h2>
                <div class="overflow-auto  h-full flex flex-col gap-7">
                    ${Object.keys(dataProperties).filter(prop => data[prop]).map(prop => `
                        <div class="flex items-center gap-7">
                            <div class="bg-slate-400 min-w-[73px] h-[68px] rounded-[28px] flex justify-center items-center text-xl font-extrabold text-white">
                                ${data[prop]}
                            </div>
                            <div>
                                <h3 class="font-bold text-[#52697F]" >${dataProperties[prop]}${dataUnits[prop] ? ` (${dataUnits[prop]})` : ""}</h3>
                                <span class="text-[10px]">${dataDesc[prop]}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `).join("")}
    `
}

// fetch data from api and render them //
function fetchData() {
    loading.classList.add("active")
    navigator.geolocation.getCurrentPosition((position) => {
        const yesterday = Math.floor((Date.now() - (1000 * 60 * 60 * 24)) / 1000)

        const weatherData = []

        const req1 = fetch(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=db59d7740041baff03be425019205efb&units=metric&dt=${yesterday}`)
            .then(res => res.json())
            .then(data => {
                weatherData.unshift(data.data[0])
            })

        const req2 = fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=db59d7740041baff03be425019205efb&units=metric`)
            .then(res => res.json())
            .then(data => {
                // format the data so that it is consistent with the others and render them// 
                weatherData.push(...data.daily.map(d => {
                    d.temp = d.temp.day
                    return d
                }))
                renderSummary(data.current)
                renderMap(data.lat, data.lon)
                renderCityName(data.timezone)
            })

        Promise.all([req1, req2]).then(() => {
            renderForecast(weatherData)
            loading.classList.remove("active")
        }).catch((err) => {
            console.log(err)
        })
    }, (error) => {
        console.log(error)
    })
}


// start the app //
const start = () => {
    fetchData()
    setInterval(fetchData, 1000 * 60 * 10)
}


start()
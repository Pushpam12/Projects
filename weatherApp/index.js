let city = document.querySelector('#city_name');
let form = document.querySelector('form');

let weather_data = document.querySelector('.weather_data')
let msg = document.querySelector('.msg')
let output = document.querySelector('.output')

let weatherloc = document.querySelector('.location')
let weather_type = document.querySelector('.weather_type')
let weather_desc = document.querySelector('.weather_desc')
let temp = document.querySelector('.temp')
let temp_min = document.querySelector('.temp_min')
let temp_max = document.querySelector('.temp_max')
let icons = document.querySelectorAll('.weather_icon')
let wind_speed = document.querySelector('.wind')
let humidity = document.querySelector('.humidity')


const key = "ac57c0c2c4e5492c006c9e6759c6fdb7";

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${key}&units=metric`;

    fetch(api).
        then((res) => res.json()).
        then((data) => {
            console.log(data);
            insertData(true, data)
        }).
        catch((e) => {
            insertData(false, e)
        })

})


function insertData(o, data) {
    if ( o && data.cod !== '404' ) {
        msg.style.display = 'none';
        weather_data.style.display = 'flex';
        output.classList.remove('output_bg');

        weatherloc.innerText = `${data.name}, ${data.sys.country}`
        weather_type.innerText = data.weather[0].main
        weather_desc.innerText = data.weather[0].description;

        for (const icon of icons) {
            icon.setAttribute('src',
                `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        }

        temp.innerText = data.main.temp
        temp_max.innerText = data.main.temp_max
        temp_min.innerText = data.main.temp_min
        wind_speed.innerText = data.wind.speed
        humidity.innerText = data.main.humidity

    } else {
        msg.style.display = 'flex';
        weather_data.style.display = 'none';
        output.classList.add('output_bg');

        msg.innerHTML = `
        <div>
        <div class='big'>Oops...</div>
        <p class='error'> Error : ${data.message} .</p>
        </div> `

        msg.innerHTML += `<img src="https://cdn.vectorstock.com/i/preview-1x/40/83/puzzled-brain-confused-and-baffled-mind-character-vector-43444083.webp"
        class= "weather_confusion_image">`;
    }
}



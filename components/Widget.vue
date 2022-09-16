<template>
  <!-- decide if widget pic should be warm or cold dependending on temperature-->
  <div id="app" :class="typeof weather.main != 'undefined' && ((weather.main.temp > 16 &&  weather.weather[0].main.toLowerCase() === 'snow' ?  'warmSnow' : '')
                                                            || (weather.main.temp > 16 &&  weather.weather[0].main.toLowerCase() === 'clouds' ?  'warmClouds' : '')
                                                            || (weather.main.temp > 16 &&  weather.weather[0].main.toLowerCase() === 'clear' ?  'warmClear' : '')
                                                            || (weather.main.temp > 16 &&  weather.weather[0].main.toLowerCase() === 'rain' ?  'warmRain' : '')
                                                            || (weather.main.temp > 16 &&  weather.weather[0].main.toLowerCase() === 'drizzle' ?  'warmDrizzle' : '')
                                                            || (weather.main.temp > 16 &&  weather.weather[0].main.toLowerCase() === 'thunderstorm' ?  'warmThunderstorm' : '')
                                                            || ((weather.main.temp <= 16 &&  weather.weather[0].main.toLowerCase() === 'snow' ?  'coldSnow' : '')
                                                            || (weather.main.temp <= 16 &&  weather.weather[0].main.toLowerCase() === 'clouds' ?  'coldClouds' : '')
                                                            || (weather.main.temp <= 16 &&  weather.weather[0].main.toLowerCase() === 'clear' ?  'coldClear' : '')
                                                            || (weather.main.temp <= 16 &&  weather.weather[0].main.toLowerCase() === 'rain' ?  'coldRain' : '')
                                                            || (weather.main.temp <= 16 &&  weather.weather[0].main.toLowerCase() === 'drizzle' ?  'coldDrizzle' : '')
                                                            || (weather.main.temp <= 16 &&  weather.weather[0].main.toLowerCase() === 'thunderstorm' ?  'coldThunderstorm' : '')))">

    <main>
      <div class="search-box">
        <input type="text" class="search-bar" placeholder="Search..." v-model="query"
               @keypress="fetchWeather"/>  <!-- if pressed then call fetchWeather-->
      </div>

      <div v-if="typeof weather.main != 'undefined'"> <!-- if weather is found then show details -->
        <div class="location-box">
          <div class="location">{{ weather.name }}, {{ weather.sys.country }}</div>  <!-- country  -->
          <div class="date">{{ dateBuilder() }}</div>     <!-- date with function -->
        </div>

        <div class="weather-box">
          <div class="temp">{{ Math.round(weather.main.temp) }}°C</div>  <!-- temperature -->
          <div class="weather">{{ weather.weather[0].main }}</div>      <!-- main weather  -->
          <div class="weather">{{ weather.wind.speed }} m/s</div>  <!-- wind speed -->
          <div class="weather">{{ weather.clouds.all }} % cloudiness</div>    <!-- clouds in % -->
        </div>
      </div>
    </main>

  </div>
</template>

<script>
import api from 'raw-loader!@/apiKeys.txt'; //gather the text from the textfile (server saved)
const Crypto = require('crypto');

export default {
  name: 'app',
  data() { //Data is the private memory of each component where you can store any variables you need
    return {
      api_key: '',
      url_base: 'https://api.openweathermap.org/data/2.5/',
      query: '',
      weather: {},
      //encryption/decyption
      encryptionMethod: 'AES-256-CBC', //symmetrical method of encrypting data, which is one of the most widely used and at the same time most secure methods of encryption today
      key: Crypto.createHash('sha512').update('fd85b494-aaaa', 'utf8').digest('hex').substr(0,32), //key file must only on the corresponding data file
      iv:  Crypto.createHash('sha512').update('smslt', 'utf8').digest('hex').substr(0,16), // initialization vector (IV)
    }
  },
  methods: {

    decryptAPIKey(encryptedMessage, encryptionMethod, secret, iv)
    {
      const buff = Buffer.from(encryptedMessage, 'base64');
      encryptedMessage = buff.toString('utf8');
      let decryptor = Crypto.createDecipheriv(encryptionMethod, secret,iv);
      return decryptor.update(encryptedMessage, 'base64','utf8') + decryptor.final('utf8');
    },

    async setApiKey() {
      const apiArray = api.split(/\r?\n|\r|\n/g);
      this.api_key=apiArray[0]; //set API key from txt document
      this.api_key = this.decryptAPIKey(this.api_key, this.encryptionMethod, this.key, this.iv); //overwrite encrypted API key via decryption method
    },
    //request the weather on specific query and get response back
    async fetchWeather(e) {
      if (e.key === "Enter") {
        fetch(`${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}`) //get from the API the weather data
          .then(res => { //if the request was successful go further with then
            if (res.statusText === 'Not Found') {
              this.$noty.error("Please enter a valid city!")
            }
            return res.json();  //get response in .json and deserialize to use it and then save it to this.weather
          }).then(this.setResults);
      }
    },
    setResults(response) {
      this.weather = response;  //set result from fetch to actual weather
    },
    //get date back for widget
    dateBuilder() {
      let d = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${date} ${month} ${year}`;
    }},
    async created()
    {
      await this.setApiKey();
    },
}
</script>

<style>
#app {
  background-image: url('../assets/img/warm.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
  background-position: center right; /* shrink from right to left (better design at less px screen*/
}
/* different background for each possibility */
#app.warmSnow {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.0)), url('../assets/img/warmsnow.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.warmClouds {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.0)), url('../assets/img/warmclouds.png');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.warmClear {
  background-image: url('../assets/img/warm.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.warmRain {
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.0)), url('../assets/img/warmrain.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.warmDrizzle {
  background-image: url('../assets/img/warmdrizzle.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.warmThunderstorm {
  background-image: url('../assets/img/warmthunderstorm.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.coldSnow {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.0)), url('../assets/img/coldsnow.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.coldClouds {
  background-image: url('../assets/img/coldcloud.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.coldClear {
  background-image: url('../assets/img/cold.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.coldRain {
  background-image: url('../assets/img/coldrain.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.coldDrizzle {
  background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url('../assets/img/colddrizzle.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
#app.coldThunderstorm {
  background-image: url('../assets/img/coldthunderstorm.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
}
main {
  min-height: 100%; /* main content 100% of screen*/
  padding: 25px; /* distance adjusted*/
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)); /*darker background image*/
}
.search-box {
  width: 100%; /* search box has full width*/
  margin-top: 60px; /* distance from top*/
}
.search-box .search-bar {
  width: 100%;  /* search bar has full width*/
  padding: 15px; /* top padding (inner distance) */
  color: #313131;
  font-size: 20px;
  outline: none; /* border around none*/
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25); /*shadow around search bar*/
  background: rgba(255, 255, 255, 0.5) none; /*white transparent color of search bar*/
  border-radius: 8px;
  transition: 0.4s; /*time where it changes to other state*/
}
.search-box .search-bar:focus {
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
}
.location-box .location {
  color: #FFF;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  margin-top: 50px; /* distance from top*/
}
.location-box .date {
  color: #FFF;
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  text-align: center;
}
.weather-box {
  text-align: center;
}
.weather-box .temp {
  display: inline-block; /* display list items horizontally and set width and height */
  padding: 10px 25px; /* inner distance top and right - so that box is bigger */
  color: #FFF;
  font-size: 80px;
  font-weight: 900;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  margin: 30px;
  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
.weather-box .weather {
  color: #FFF;
  font-size: 30px;
  font-weight: 700;
  font-style: italic;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  margin-bottom: 20px;
}
</style>

<template>
  <!-- decide if widget pic should be warm or cold dependending on temperature-->
  <div class="headline"> <!-- weathercoin div -->
    <h1>BETTING</h1>
    <div :class="typeof weather.main != 'undefined'">  <!-- show if weather is NOT undefined -->

      <div class="searchBox">
        <input
          type="text"
          class="searchBar"
          placeholder="Search..."
          v-model="query"
          @keypress="fetchWeather"/>  <!-- if pressed then call fetchWeather-->
      </div>
    </div>

    <div class="weatherData" v-if="typeof weather.main != 'undefined'"> <!-- show if weather is NOT undefined -->
      <v-simple-table style="background-color: #1e1e1e; border-radius: 10px" class="table" v-if="showData===true"> <!-- just show data if you had betted already!-->
        <thead>
        <tr>
          <th style="text-align: center; font-size: 15px; color: white">City</th>
          <th style="text-align: center; font-size: 15px; color: white">Degrees</th>
          <th style="text-align: center; font-size: 15px; color: green">1,5x Odds Bottom</th>
          <th style="text-align: center; font-size: 15px; color: green">1,5x Odds Top</th>
          <th style="text-align: center; font-size: 15px; color: orange">2x Odds Bottom</th>
          <th style="text-align: center; font-size: 15px; color: orange">2x Odds Top</th>
          <th style="text-align: center; font-size: 15px; color: red">3x Odds Bottom</th>
          <th style="text-align: center; font-size: 15px; color: red">3x Odds Top</th>
          <!--  <th style="text-align: center; font-size: 15px; color: white">Deadline</th>  date where it calculates -->
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="td">{{ weather.name }}</td>  <!-- fixed data from API-->
          <td class="td">{{ weather.main.temp }}° C</td>  <!-- fixed data from API-->

          <td class="td">{{ parseFloat(weather.main.temp - 1.5).toFixed(2) }}° C</td>
          <!-- predicted data -° (round to two decimals)-->
          <td class="td">{{ parseFloat(weather.main.temp + 1.5).toFixed(2) }}° C</td>
          <!-- predicted data +° (round to two decimals)-->

          <td class="td">{{ parseFloat(weather.main.temp - 1).toFixed(2) }}° C</td>
          <!-- predicted data -° (round to two decimals)-->
          <td class="td">{{ parseFloat(weather.main.temp + 1).toFixed(2) }}° C</td>
          <!-- predicted data +° (round to two decimals)-->

          <td class="td">{{ parseFloat(weather.main.temp - 0.5).toFixed(2) }}° C</td>
          <!-- predicted data -° (round to two decimals)-->
          <td class="td">{{ parseFloat(weather.main.temp + 0.5).toFixed(2) }}° C</td>
          <!-- predicted data +° (round to two decimals)-->

          <!--  <td class="td">{{ dateBuilderModified() }}</td> deadline where we evaluate -->
        </tr>
        </tbody>
      </v-simple-table>

      <v-card v-if="showBetCard" class="mx-auto" max-width="400" max-height="1000" loading loader-height="1" outlined shaped>
        <v-card-title primary-title class="justify-center">PLACE YOUR BET</v-card-title>
        <v-text-field id="txtFieldTemperature" class="txtField" v-model="predictedTemp" :rules="validateTemp"
                      label="temperature"></v-text-field>
        <v-text-field id="txtFieldAmount" class="txtField" v-model="bettedCoins" :rules="validateCoins"
                      label="weathercoins"></v-text-field>
        <input id="timePicker" style="color: white; font-size: 18px; background-color: #364848; border-radius: 4px"
               type="datetime-local" max="2022-12-31T00:00" value="2022-09-01T00:00">
        <v-card-actions class="justify-center">
          <v-btn class="bettingButtons" dark text color="success" @click="setBet(1.5)">1,5x</v-btn>
          <v-btn class="bettingButtons" dark text color="warning" @click="setBet(2)">2x</v-btn>
          <v-btn class="bettingButtons" dark text color="error" @click="setBet(3)">3x</v-btn>
        </v-card-actions>
      </v-card>


    </div>
  </div>
</template>

<script>
import api from 'raw-loader!@/apiKeys.txt'; //gather the text from the textfile (server saved)
const Crypto = require('crypto');

export default {
  data: () => ({
    weathercoin: 0,
    api_key: '',
    url_base: 'https://api.openweathermap.org/data/2.5/',
    query: '',
    weather: {},
    actualTemp: null,   // actualTemp fetched by the API
    predictedTemp: null, //predictedTemp by the user input
    bettedCoins: null, // later insert document.getElementById('txtFieldAmount').value
    showData: false,
    showBetCard: false,
    //encryption/decyption
    encryptionMethod: 'AES-256-CBC', //symmetrical method of encrypting data, which is one of the most widely used and at the same time most secure methods of encryption today
    key: Crypto.createHash('sha512').update('fd85b494-aaaa', 'utf8').digest('hex').substr(0,32), //key file must only on the corresponding data file
    iv:  Crypto.createHash('sha512').update('smslt', 'utf8').digest('hex').substr(0,16), // initialization vector (IV)

    validateTemp: [
      (v) => !!v || "required field",
    ],
    validateCoins: [
      (v) => !!v || "required field",
    ],
  }),

  methods: {

    decryptAPIKey(encryptedMessage, encryptionMethod, secret, iv)
    {
      const buff = Buffer.from(encryptedMessage, 'base64');
      encryptedMessage = buff.toString('utf8');
      let decryptor = Crypto.createDecipheriv(encryptionMethod, secret,iv);
      return decryptor.update(encryptedMessage, 'base64','utf8') + decryptor.final('utf8');
    },

    async setApiKey() {
      const apiArray = api.split(/\r?\n|\r|\n/g); //split in our case linebreak
      this.api_key=apiArray[0]; //set API key from txt document
      this.api_key = this.decryptAPIKey(this.api_key, this.encryptionMethod, this.key, this.iv); //overwrite encrypted API key via decryption method
    },

    fetchWeather(e) {
      if (e.key === "Enter") {
        fetch(`${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}`) //fetch the weather if the key enter is pressed
          .then(res => { //if the request was successful go further with then
            if (res.statusText === 'Not Found') { //get response in .json and deserialize to use it and then save it to this.weather
              this.$noty.error("Please enter a valid city!")
            }
            return res.json();
          }).then(this.setResults);
      }
    },
    setResults(results) {
      this.weather = results; // write results into variable
      this.showData = false; // if we fetch new data, data should not be visible
      this.showBetCard = true;
    },
    dateBuilderModified() { /*modified to date we want to predict */
      let d = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let day = days[d.getDay()];
      let date = d.getDate(); /* modified here the days */
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${date} ${month} ${year}`;
    },
    setBet(odds) {
      if (document.getElementById('txtFieldAmount').value >= 1 && document.getElementById('txtFieldAmount').value <= this.weathercoin &&
        document.getElementById('txtFieldAmount').value !== "") {
        if (this.predictedTemp == null) {
          this.predictedTemp = 0; //if no temp is entered then set it to zero
        }
        else {
          this.predictedTemp = this.predictedTemp.replace(',', '.'); //replace , to .
        }
        this.actualTemp = this.weather.main.temp; // get actual temperature and write it into the variable
        this.bet(odds); //--> determine which button was pressed (1.5 OR 2 OR 3) with 'odds' var

        // show message
        /*this.delay(2000).then(() => {
          this.$noty.info("Please be a fair player and select a new city to bet!")
        });*/
      } else {
        this.$noty.error("Error, please check!") //more cases why error is happened -> when we have backend
      }
    },
    //sleep function
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    // the betting logic
    async bet(odds) {
      let timestamp = new Date(document.getElementById("timePicker").value);
      if (timestamp <= Date.now()){
        this.$noty.error("Please select a date in the future!");
        return 0
      }
      let doc = {
        betObj: {
          bettedCoins: parseFloat(this.bettedCoins),
          predictedTemp: parseFloat(this.predictedTemp),
          location: this.query,
          odds: odds,
          time: timestamp
        }
      }
      let docRef = this.$fire.firestore.collection("/bets").doc(this.$fire.auth.currentUser.uid)
      await docRef.set(doc, {merge: false})//update values in firebase trought firebase, when we do new bet
      this.$noty.success("Bet placed!");
      this.showData = true; //show the results in the table
      this.showBetCard = false;
    }
  },


  /* gets instantly called*/
  async created() {
    await this.setApiKey();
    // get user data from document
    const ref = this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid); //get the collection from database
    let document = ref.get();
    this.weathercoin = (await document).get("weatherCoin");  //get the weathercoins
  }


};

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'montserrat', sans-serif;
}

.headline {
  margin-top: 100px; /* distance from top of div*/
  text-align: center;
}

.searchBox {
  padding: 25px;
  width: 50%;
  text-align: center;
  transform: translate(50%, 10%)
}

.searchBox .searchBar {
  display: block;
  width: 100%;
  padding: 15px;

  color: #313131;
  font-size: 20px;
  appearance: none;
  border: none;
  outline: none;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.5) none;
  border-radius: 8px;
  transition: 0.4s;
}


.searchBox .searchBar:focus {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
}


h1 {
  color: #fff;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.15em;

  display: inline-block;
  padding: 15px 20px;
  position: relative;
  font-size: 1.5rem;
}

h1:after {
  bottom: 0;
  content: "";
  display: block;
  height: 2px;
  left: 50%;
  position: absolute;
  background: #fff;
  transition: width 0.3s ease 0s, left 0.3s ease 0s;
  width: 0;
}

h1:hover:after {
  width: 100%; /* full text get's the effect*/
  left: 0; /* begin left at text*/
}

.weatherData {
  margin-top: 60px; /* distance from top */
  width: 80%; /*so that it isn't too long*/
  transform: translate(12.5%, 0%); /* make it into the middle*/
}


.txtField {
  margin-right: 100px;
  margin-left: 100px;
  margin-bottom: 16px;
}

.bettingButtons {
  margin-bottom: 12px;
  margin-right: 0;
}

.mx-auto {
  margin-top: 10px;
  margin-bottom: 150px;
}


tr:hover {
  background-color: transparent !important; /* transparent if you hover over table entry color */
}

</style>

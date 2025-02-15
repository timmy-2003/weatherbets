<template>
  <div class="headline">
    <h1>BETTING</h1>
    <div :class="typeof weather.main != 'undefined'">

      <div class="searchBox">
        <input
          type="text"
          class="searchBar"
          placeholder="Search..."
          v-model="query"
          @keypress="fetchWeather"/>
      </div>
    </div>

      <v-card v-if="showBetCard" class="mx-auto" max-width="400" max-height="1000" loading loader-height="1" outlined shaped>
        <v-card-title primary-title class="justify-center">PLACE YOUR BET</v-card-title>
        <v-text-field prepend-icon="mdi-thermometer" id="txtFieldTemperature" class="txtField" v-model="predictedTemp" :rules="validateTemp"
                      label="temperature"></v-text-field>
        <v-text-field prepend-icon="mdi-bitcoin" id="txtFieldAmount" class="txtField" v-model="bettedCoins" :rules="validateCoins"
                      label="weathercoin"></v-text-field>
        <input id="timePicker" style="color: white; font-size: 18px; background-color: #364848; border-radius: 4px"
               type="datetime-local" max="2022-12-31T00:00" value="2022-09-01T00:00">
        <v-card-actions class="justify-center">
          <v-btn class="bettingButtons" dark text color="success" @click="setBet(1.5)">1,5x</v-btn>
          <v-btn class="bettingButtons" dark text color="warning" @click="setBet(2)">2x</v-btn>
          <v-btn class="bettingButtons" dark text color="error" @click="setBet(3)">3x</v-btn>
        </v-card-actions>
      </v-card>


    </div>
</template>

<script>
import api from 'raw-loader!@/apiKeys.txt';
const Crypto = require('crypto');

export default {
  data: () => ({
    weathercoin: 0,
    existingBets: [],
    api_key: '',
    url_base: 'https://api.openweathermap.org/data/2.5/',
    query: '',
    weather: {},
    actualTemp: null,
    predictedTemp: null,
    bettedCoins: null,
    showData: false,
    showBetCard: false,

    encryptionMethod: 'AES-256-CBC',
    key: Crypto.createHash('sha512').update('fd85b494-aaaa', 'utf8').digest('hex').substr(0,32),
    iv:  Crypto.createHash('sha512').update('smslt', 'utf8').digest('hex').substr(0,16),

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
      const apiArray = api.split(/\r?\n|\r|\n/g);
      this.api_key=apiArray[0];
      this.api_key = this.decryptAPIKey(this.api_key, this.encryptionMethod, this.key, this.iv);
    },

    fetchWeather(e) {
      if (e.key === "Enter") {
        fetch(`${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}`)
          .then(res => {
            if (res.statusText === 'Not Found') {
              this.$noty.error("Please enter a valid city!")
            }
            return res.json();
          }).then(this.setResults);
      }
    },
    setResults(results) {
      this.weather = results;
      this.showData = false;
      this.showBetCard = true;
    },
    dateBuilderModified() {
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
          this.predictedTemp = 0;
        }
        else {
          this.predictedTemp = this.predictedTemp.replace(',', '.');
        }
        this.actualTemp = this.weather.main.temp;
        this.bet(odds);
      } else {
        this.$noty.error("Error, please check!");
      }
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async bet(odds) {
      let timestamp = new Date(document.getElementById("timePicker").value);
      if (timestamp <= Date.now()){
        this.$noty.error("Please select a date in the future!");
        return 0
      }

      let betObj =  {
        bettedCoins: parseFloat(this.bettedCoins),
        predictedTemp: parseFloat(this.predictedTemp),
        location: this.query,
        odds: odds,
        time: timestamp
      }

        this.existingBets.push(betObj)

        let doc = {
          bets: this.existingBets
        }

        let docRef = this.$fire.firestore.collection("/bets").doc(this.$fire.auth.currentUser.uid)
        await docRef.set(doc, {merge: false})
        this.$noty.success("Bet placed!");
        this.showData = true;
        this.showBetCard = false;



    }
  },


  /* gets instantly called*/
  async created() {
    await this.setApiKey();
    const ref = this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid);
    let document = ref.get();
    this.weathercoin = (await document).data().weatherCoin;
    let docRef = this.$fire.firestore.collection("/bets").doc(this.$fire.auth.currentUser.uid);
    docRef.get().then(async (doc) => {
      if (doc.exists) {
        this.existingBets = doc.data().bets;
      } else {
        console.log("No bets found for this user");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
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
  margin-top: 100px;
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
  width: 100%;
  left: 0;
}

.weatherData {
  margin-top: 60px;
  width: 80%;
  transform: translate(12.5%, 0%);
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
  background-color: transparent !important;
}

</style>

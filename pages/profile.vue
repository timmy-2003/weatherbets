<template>
  <v-app> <!-- The Vuetify v-app component is an essential component and required in all applications made with the framework -->
    <div id="app">
      <nav-bar/>
      <v-main> <!-- Sizes your content based upon application components (dynamically sized based on the structure of layout elements)-->


          <v-card v-if="dataLoaded" id="card" class="mx-auto" outlined max-height="500" max-width="600"> <!-- show if the dataloaded=true -->
            <v-card-title id="greetUser" class="justify-center">Hello {{ username }}!              <v-img v-if="dataLoaded" max-height="50" max-width="50" :src="imageSrc"></v-img>
            </v-card-title>
            <v-card-text>
              <h3 class="text">Your weatherCoin balance: {{ weathercoin }}</h3>
              <h3 class="text">Level: {{userLevel}}</h3>
            </v-card-text>
            <v-text-field @keyup.enter="saveToDatabase" style="margin: 10px" dense outlined v-model="newUsername" v-if="showTextField" label="Enter new username"
                          append-icon="mdi-checkbox-marked-circle" @click:append="saveToDatabase"></v-text-field>
            <v-card-actions class="justify-center">
              <v-btn @click="getBetDocument">Evaluate my bets!</v-btn>
            </v-card-actions>
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-card-actions class="justify-center">
                  <v-btn v-bind="attrs" v-on="on" class="buttons">
                    Delete my bets
                  </v-btn>
                </v-card-actions>
              </template>

              <v-card>
                <v-card-title>
                  Are you sure?
                </v-card-title>

                <v-card-text>
                  This will delete all your current bets from the database. This action cannot be reversed!
                </v-card-text>

                <v-card-actions class="justify-center">
                  <v-btn style="background-color: rgba(232,33,33,0.5);" @click="deleteAllBets(notifyDelete)">
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-card-actions class="justify-center">
              <v-btn v-if="!showTextField" class="buttons" @click="changeName">
                Change username
              </v-btn>
              <v-btn class="buttons" @click="logoutUser" id="logoutButton">
                Logout
              </v-btn>
            </v-card-actions>

            <br>

          </v-card>


        <v-snackbar color="green" timeout="1500" v-model="showSnackBar">
          <div style="color: black">{{ msg }}</div>
          <template v-slot:action="{ attrs }"> <!-- so that the button is at the same line as error message -->
            <v-btn style="color: black" dark text v-bind="attrs" @click="showSnackBar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import api from 'raw-loader!@/apiKeys.txt';
const Crypto = require('crypto');
import {arrayUnion} from "firebase/firestore"
export default {

  name: "profile",

  data() {
    return {
      username: "",
      numOfBets: null,
      weathercoin: 0,
      showTextField: false,
      newUsername: "",
      showSnackBar: false,
      msg: "",
      dataLoaded: false,
      imageSrc: require("assets/img/normalUser.png"),
      userLevel: "",
      base_url: "https://api.openweathermap.org/geo/1.0/direct?",
      api_key: '',
      base_url_weather: "https://api.openweathermap.org/data/3.0/onecall/timemachine?",
      api_key_weather: '',
      actualTemp: 0,
      time: '',
      dialog: false,
      encryptionMethod: 'AES-256-CBC',
      key: Crypto.createHash('sha512').update('fd85b494-aaaa', 'utf8').digest('hex').substr(0,32),
      iv:  Crypto.createHash('sha512').update('smslt', 'utf8').digest('hex').substr(0,16),
    }
  },


  methods: {
    async deleteAllBets(){
      this.dialog = false;
      await fetch("/api/delete/" + this.$fire.auth.currentUser.uid, {
        method: 'DELETE'
      }).then(res => {
        if (res.ok){
          this.showSnackBar = true;
          this.msg = "Successfully deleted your bets!"
        }
      })
    },

    decryptAPIKey(encryptedMessage, encryptionMethod, secret, iv)
    {
      const buff = Buffer.from(encryptedMessage, 'base64');
      encryptedMessage = buff.toString('utf8');
      let decryptor = Crypto.createDecipheriv(encryptionMethod, secret,iv);
      return decryptor.update(encryptedMessage, 'base64','utf8') + decryptor.final('utf8');
    },

    async setApiKey() {
      const apiArray = api.split(/\r?\n|\r|\n/g);
      let apiKey1 = apiArray[0];
      let apiKey2 = apiArray[1];
      this.api_key=apiKey1;
      this.api_key_weather=apiKey2;
      this.api_key = this.decryptAPIKey(this.api_key, this.encryptionMethod, this.key, this.iv);
      this.api_key_weather = this.decryptAPIKey(this.api_key_weather, this.encryptionMethod, this.key, this.iv);
    },

    getBetDocument() {
      let docRef = this.$fire.firestore.collection("/bets").doc(this.$fire.auth.currentUser.uid);
      docRef.get().then(async (doc) => {
        if (doc.exists) {
          await this.evaluateBet(doc)
        } else {
          this.showSnackBar = true;
          this.msg = "No bets found. Start placing some bets!"
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },

    async evaluateBet(doc) {
      let futureCounter = 0;
      let betArray = doc.data().bets;
      if (betArray.length === 0){
        this.showSnackBar = true;
        this.msg = "No bets found. Start placing some bets!"
      }
      let indexArray = [];
      for (let i = 0; i < betArray.length; i++) {
        let bettedCoins = betArray[i].bettedCoins;
        let location = betArray[i].location;
        let odds = betArray[i].odds;
        let predictedTemp = betArray[i].predictedTemp;
        let time = betArray[i].time.seconds;
        if (time > Date.now()/1000){
          futureCounter++;
        } else {
          let coordinates = await this.locationToGeocode(location)
          let url = this.base_url_weather + coordinates + "&dt=" + time + "&units=metric&appid=" + this.api_key_weather;
          await fetch(url)
            .then(res => res.json())
            .then(res => {
              this.actualTemp = res.data[0].temp;
            })

          if (odds === 1.5){
            let tmpWeatherCoins = 0;
            if (this.actualTemp - 1.5 <= predictedTemp && this.actualTemp + 1.5 >= predictedTemp){
              tmpWeatherCoins = bettedCoins * 1.5
              let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
              let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
              await docRef.update({weatherCoin: updatedWeatherCoins});
              this.$noty.success("You won " + tmpWeatherCoins + " weathercoins");
              await this.pushToArray(docRef, location)
            } else {
              tmpWeatherCoins = bettedCoins * -1;
              let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
              let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
              await docRef.update({weatherCoin: updatedWeatherCoins});
              this.$noty.error("You lost " + tmpWeatherCoins*-1 + " weathercoins");
              await this.delay(1500)
              this.$noty.info("Actual temperature in " + location + ": " + this.actualTemp);
            }
            indexArray.push(i)

          } else if (odds === 2){
            let tmpWeatherCoins = 0;
            if (this.actualTemp - 1 <= predictedTemp && this.actualTemp + 1 >= predictedTemp){
              tmpWeatherCoins = bettedCoins * 2
              let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
              let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
              await docRef.update({weatherCoin: updatedWeatherCoins});
              this.$noty.success("You won " + tmpWeatherCoins + " weathercoins");
              await this.pushToArray(docRef, location)
            } else {
              tmpWeatherCoins = bettedCoins * -1;
              let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
              let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
              await docRef.update({weatherCoin: updatedWeatherCoins});
              this.$noty.error("You lost " + tmpWeatherCoins*-1 + " weathercoin");
              this.$noty.info("Actual temperature: " + this.actualTemp);
            }
            indexArray.push(i)
          } else if (odds === 3){
            let tmpWeatherCoins = 0;
            if (this.actualTemp - 0.5 <= predictedTemp && this.actualTemp + 0.5 >= predictedTemp){
              tmpWeatherCoins = bettedCoins * 3
              let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
              let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
              await docRef.update({weatherCoin: updatedWeatherCoins});
              this.$noty.success("You won " + tmpWeatherCoins + " weathercoin");
              await this.pushToArray(docRef, location)
            } else {
              tmpWeatherCoins = bettedCoins * -1;
              let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
              let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
              await docRef.update({weatherCoin: updatedWeatherCoins});
              this.$noty.error("You lost " + tmpWeatherCoins*-1 + " weathercoin");
              this.$noty.info("Actual temperature: " + this.actualTemp);
            }
            indexArray.push(i)
          }
          await this.delay(1000)
        }
      }
      this.deleteBets(betArray, indexArray)
      if (futureCounter !== 0){
        this.$noty.success(futureCounter + " bet(s) still in the future!")
      }
    },

     deleteBets(arr, indexArray){
      const docRef = this.$fire.firestore.collection("bets").doc(this.$fire.auth.currentUser.uid);
      indexArray.sort();
       for (let i = indexArray.length -1; i >= 0; i--)
         arr.splice(indexArray[i],1);
      docRef.set({
        bets: arr
      }, {merge:false})
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async pushToArray(document, location){
      await document.update(
        {
          locations: arrayUnion(location)
        }
      )
    },


    async locationToGeocode(location) {
      let url = this.base_url + "q=" + location + "&appid=" + this.api_key;
      let lat, lon
      await fetch(url)
        .then(res => res.json())
        .then(res => {
          lat = res[0].lat
          lon = res[0].lon
        })
      return "lat=" + lat + "&lon=" + lon;
    },


    async logoutUser() {
      await this.$fire.auth.signOut()
      await this.$router.push("/")
    },

    changeName() {
      this.showTextField = true;
    },


    setBadge(){
      let coins = this.weathercoin;
      if (coins < 40){
        this.imageSrc = require("assets/img/newbie.png")
        this.userLevel = "Beginner"
      } else if (coins >= 40 && coins < 100){
        this.imageSrc = require("assets/img/third.png")
        this.userLevel = "Bronze"
      } else if (coins >=100  && coins < 300){
        this.imageSrc = require("assets/img/second.png")
        this.userLevel = "Silver"
      } else if (coins >= 300 && coins < 1000){
        this.imageSrc = require("assets/img/best.png")
        this.userLevel = "Gold";
      } else if (coins >= 1000){
        this.imageSrc = require("assets/img/expert.png")
        this.userLevel = "Expert";
      }
    },



    async saveToDatabase() {
      if (this.newUsername.length < 5) {
        this.msg = "Enter a valid username!"
        this.showSnackBar = true;
        return;
      }


      await fetch("/api/edit/"+this.$fire.auth.currentUser.uid, {
        method: 'PATCH',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          newUsername: this.newUsername
        })
      })
      .then(() => {
        this.msg = "Username changed successfully"
        this.showSnackBar = true;
      })

    }
  },

  async created() {
    await this.setApiKey();
    let jsonDoc;
    await fetch("/api/userdata/" + this.$fire.auth.currentUser.uid, {
      method: 'GET',
      cache: 'default'
    })
    .then(res => res.json())
    .then(data => jsonDoc = data)
    this.username = jsonDoc.username;
    this.weathercoin = jsonDoc.weathercoin;
    this.setBadge();
    await this.$fire.firestore.collection("users").doc(this.$fire.auth.currentUser.uid)
      .onSnapshot(async doc => {
        this.weathercoin = doc.data().weatherCoin;
        this.username = doc.data().username;
        this.setBadge();
      })


    this.dataLoaded = true;
  },


};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#profileCard {
  position: fixed; /*positioned relative to the viewport, it always stays in the same place even if the page is scrolled */
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #3c4242;
}

.text {
  text-align: center;
  font-size: 18px;
  color: white;
}

#greetUser {
  font-size: 25px;
}

.buttons {
  border-radius: 10px;
  color: white;
}

#app {
  background-image: url('../assets/img/betting2.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}

.mx-auto {
  margin-top: 100px;
}

#card{
  background-color: #2d2d2d;
  border-radius: 10px;
}

@media screen and (max-width: 600px) {
  #card{
    width: 90%;
    margin-top: 60px;
  }
}
</style>

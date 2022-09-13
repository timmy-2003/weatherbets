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
            <v-card-actions class="justify-center">
              <v-btn @click="deleteBets('Successfully deleted your bet from database!')">Delete my bets</v-btn>
            </v-card-actions>
            <v-card-actions class="justify-center">
              <v-btn v-if="!showTextField" class="buttons" @click="changeName">  <!-- show if textfield is not displayed -->
                Change username
              </v-btn>
              <v-btn class="buttons" @click="logoutUser" id="logoutButton">
                Logout
              </v-btn>
            </v-card-actions>

            <br>

          </v-card>


        <v-snackbar timeout="2500" id="snackbar" v-model="showSnackBar">
          {{ msg }}
          <template v-slot:action="{ attrs }"> <!-- so that the button is at the same line as error message -->
            <v-btn dark text v-bind="attrs" @click="showSnackBar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import api from 'raw-loader!@/apiKeys.txt'; //gather the text from the textfile (server saved)
const Crypto = require('crypto');
//console.log(api);
export default {

  name: "profile",

  data() {  //Data is the private memory of each component where you can store any variables you need
    return {
      username: "",
      weathercoin: 0,
      showTextField: false,
      newUsername: "",
      showSnackBar: false,
      msg: "",
      dataLoaded: false,
      imageSrc: require("assets/img/normalUser.png"),
      userLevel: "",
      base_url: "https://api.openweathermap.org/geo/1.0/direct?",
      api_key: '', //gets setted from .txt file [0]
      base_url_weather: "https://api.openweathermap.org/data/3.0/onecall/timemachine?",
      api_key_weather: '', //gets setted from .txt file [1]
      actualTemp: 0,
      time: '',
      //encryption/decyption
      encryptionMethod: 'AES-256-CBC', //symmetrical method of encrypting data, which is one of the most widely used and at the same time most secure methods of encryption today
      key: Crypto.createHash('sha512').update('fd85b494-aaaa', 'utf8').digest('hex').substr(0,32), //key file must only on the corresponding data file
      iv:  Crypto.createHash('sha512').update('smslt', 'utf8').digest('hex').substr(0,16), // initialization vector (IV)

    }
  },

  methods: {
    /* delete all the bets from the user*/
    async deleteBets(notification){
      await fetch("/api/delete/" + this.$fire.auth.currentUser.uid, {
        method: 'DELETE'
      }).then(res => {  //starts a request and returns a promise
        if (res.ok){
          this.$noty.success(notification)
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
      this.api_key=apiKey1; //set API key from txt document
      this.api_key_weather=apiKey2;
      this.api_key = this.decryptAPIKey(this.api_key, this.encryptionMethod, this.key, this.iv); //overwrite encrypted API key via decryption method
      this.api_key_weather = this.decryptAPIKey(this.api_key_weather, this.encryptionMethod, this.key, this.iv);
    },

    getBetDocument() {
      // first, check if bet document exists
      let docRef = this.$fire.firestore.collection("/bets").doc(this.$fire.auth.currentUser.uid); //get collection from database 'bets'
      docRef.get().then(async (doc) => {
        if (doc.exists) {
          await this.evaluateBet(doc)  //if a bet is saved in the database then evaluate
        } else {
          //error messages
          console.log("No bets found for this user");
          this.showSnackBar = true;
          this.msg = "No bet found! Start by making a bet!"
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },

    //evaluate existing bets - saved on our database 'bets' collection
    async evaluateBet(doc) {
      let betObj = (await doc).get('betObj'); //betting object
      //get objects
      let bettedCoins = betObj.bettedCoins;
      let location = betObj.location;
      let odds = betObj.odds;
      let predictedTemp = betObj.predictedTemp;
      let time = betObj.time;
      time = time.seconds;
      if (time > Date.now()/1000){ //if time is in the future show data
        this.showSnackBar = true;
        this.msg = "Bet date is in the future!"
      } else {
        let coordinates = await this.locationToGeocode(location) //get coordinates
        let url = this.base_url_weather + coordinates + "&dt=" + time + "&units=metric&appid=" + this.api_key_weather;
        console.log(url) // the url to fetch the weather
        await fetch(url)
          .then(res => res.json()) //if the request was successful go further with then and get response in .json and deserialize to use it -> we want color
          .then(res => {
            this.actualTemp = res.data[0].temp; //get the actual temp form the API fetch
          })

        if (odds === 1.5){
          let tmpWeatherCoins = 0;
          if (this.actualTemp - 1.5 <= predictedTemp && this.actualTemp + 1.5 >= predictedTemp){ //if the bet lies between the win
            tmpWeatherCoins = bettedCoins * 1.5
            let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
            let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
            await docRef.update({weatherCoin: updatedWeatherCoins});  //update coins
            this.$noty.success("You won " + tmpWeatherCoins + " weathercoins");
          } else {
            tmpWeatherCoins = bettedCoins * -1;
            let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
            let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
            await docRef.update({weatherCoin: updatedWeatherCoins});  //update coins
            this.$noty.error("You lost " + tmpWeatherCoins*-1 + " weathercoins");
            await this.delay(1500)
            this.$noty.info("Actual temperature: " + this.actualTemp);
          }
        } else if (odds === 2){
          let tmpWeatherCoins = 0;
          if (this.actualTemp - 1 <= predictedTemp && this.actualTemp + 1 >= predictedTemp){ //if the bet lies between the win
            tmpWeatherCoins = bettedCoins * 2
            let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
            let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
            await docRef.update({weatherCoin: updatedWeatherCoins});  //update coins
            this.$noty.success("You won " + tmpWeatherCoins + " weathercoins");
          } else {
            tmpWeatherCoins = bettedCoins * -1;
            let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
            let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
            await docRef.update({weatherCoin: updatedWeatherCoins});  //update coins
            this.$noty.error("You lost " + tmpWeatherCoins*-1 + " weathercoins");
            this.$noty.info("Actual temperature: " + this.actualTemp);

          }
        } else if (odds === 3){
          let tmpWeatherCoins = 0;
          if (this.actualTemp - 0.5 <= predictedTemp && this.actualTemp + 0.5 >= predictedTemp){ //if the bet lies between the win
            tmpWeatherCoins = bettedCoins * 3
            let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
            let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
            await docRef.update({weatherCoin: updatedWeatherCoins});  //update coins
            this.$noty.success("You won " + tmpWeatherCoins + " weathercoins");
          } else {
            tmpWeatherCoins = bettedCoins * -1;
            let updatedWeatherCoins = this.weathercoin + tmpWeatherCoins;
            let docRef = this.$fire.firestore.collection("/users").doc(this.$fire.auth.currentUser.uid);
            await docRef.update({weatherCoin: updatedWeatherCoins});  //update coins
            this.$noty.error("You lost " + tmpWeatherCoins*-1 + " weathercoins");
            this.$noty.info("Actual temperature: " + this.actualTemp);

          }
        }
        await this.updateData(); // after evaluation refresh userdata(GET request)
        await this.delay(3000)
        await this.deleteBets("You may now submit the next bet!")

      }
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    //get location - location is query from database and get lat and lon from this
    async locationToGeocode(location) {
      let url = this.base_url + "q=" + location + "&appid=" + this.api_key;
      let lat, lon
      await fetch(url)
        .then(res => res.json())
        .then(res => {
          lat = res[0].lat
          lon = res[0].lon
          console.log(lat)
          console.log(lon)
        })
      return "lat=" + lat + "&lon=" + lon;
    },

    async loser(){
      console.log("put request")
      await fetch("/api/lose/" + this.$fire.auth.currentUser.uid, {
        method: 'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          username: "loser",
          weatherCoin: 10
        })
      })
    },

    /*logout the user*/
    async logoutUser() {
      await this.$fire.auth.signOut()  //wait till user is logged out
      await this.$router.push("/") //pushes a new entry into the history stack, when the user clicks the browser back button they will be taken to the specific URL
    },

    changeName() {
      this.showTextField = true;
    },

    //set badge according to your coins
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
      if (coins === 0){
        this.loser();
        this.$noty.success("Here, have some weathercoins!")
        this.updateData();
      }
    },



    //change username
    async saveToDatabase() {
      if (this.newUsername.length < 5) {
        this.msg = "Enter a valid username!"
        this.showSnackBar = true;
        return;
      }

      //change username and save it to database
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
        this.updateData();
      })

    },

    //get the profile data
    async updateData(){
      let jsonDoc;
      await fetch("/api/userdata/" + this.$fire.auth.currentUser.uid, { //get data from our database collection 'users'
        method: 'GET',
        cache: 'default'
      })
        .then(res => res.json())
        .then(data => jsonDoc = data)
      this.weathercoin = jsonDoc.weathercoin;
      this.username = jsonDoc.username;
      this.setBadge();
    }


  },

  /* get's instantly called*/
  async created() {
    await this.setApiKey();
    // get the user data from our backend
    let jsonDoc;
    await fetch("/api/userdata/" + this.$fire.auth.currentUser.uid, { //get data from our database collection 'users'
      method: 'GET',
      cache: 'default'
    })
    .then(res => res.json())
    .then(data => jsonDoc = data)
    this.username = jsonDoc.username; //get back the username
    this.weathercoin = jsonDoc.weathercoin; //get back the weathercoins
    //this.time = jsonDoc.time;
    //this.time = new Date(this.time.seconds * 1000 + this.time.nanoseconds/1000000) get from firebase date to actual date readable
    this.setBadge(); //method call setBadge to user according weathercoins
    this.dataLoaded = true;//set var to true
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

/* responsiveness*/
@media screen and (max-width: 600px) {
  #card{
    width: 90%;
    margin-top: 60px;
  }
}
</style>

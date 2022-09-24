<template>
  <div id="app">
    <v-app> <!-- The Vuetify v-app component is an essential component and required in all applications made with the framework -->
      <nav-bar/>    <!-- Navbar -->

      <div class="weathercoin"> <!-- weathercoin div -->
        <h1>WEATHERCOIN</h1>
        <h2 id="randomColorHeading" v-if="$fire.auth.currentUser != null">WEATHERCOIN MINTED -> {{ this.userArray[0] }}</h2>
        <!-- gather weathercoin that are minted with created() function -->
        <div class="content"> <!-- content of weathercoin.vue -->

          <!-- VCARD 1 -->
          <v-container fill-height>
            <!-- first container (one line) || fill-height applies height 100% and align-items to center-->
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line> <!-- items three in a row -->
                <v-list-item-content>
                  <div class="text-overline mb-4"> BENEFIT 1</div>
                  <v-list-item-title class="text-h5 mb-2">EDUCATION</v-list-item-title>
                  <v-list-item-subtitle>We want to educate in risk analysis</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="70" color="transparent"><img src="../assets/img/benefit1.png"
                                                                            alt="BENEFIT 1">
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
              </v-card-actions>
            </v-card>

            <!-- VCARD 2 -->
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line> <!-- items three in a row -->
                <v-list-item-content>
                  <div class="text-overline mb-4"> BENEFIT 2</div>
                  <v-list-item-title class="text-h5 mb-2">HEALTH</v-list-item-title>
                  <v-list-item-subtitle>We want to improve mental health</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="70" color="transparent"><img src="../assets/img/benefit2.png"
                                                                            alt="BENEFIT 2">
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
              </v-card-actions>
            </v-card>

            <!-- VCARD 3 -->
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line> <!-- items three in a row -->
                <v-list-item-content>
                  <div class="text-overline mb-4"> BENEFIT 3</div>
                  <v-list-item-title class="text-h5 mb-2">CURE</v-list-item-title>
                  <v-list-item-subtitle>We want to cure gambling addiction</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="70" color="transparent"><img src="../assets/img/benefit3.png"
                                                                            alt="BENEFIT 3">
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
              </v-card-actions>
            </v-card>
          </v-container>

          <!-- VCARD 4 -->
          <v-container fill-height grid-list-xl text-xs-center>
            <!-- second container (one line) || fill-height applies height 100% and align-items to center-->
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line> <!-- items three in a row -->
                <v-list-item-content>
                  <div class="text-overline mb-4"> BENEFIT 4</div>
                  <v-list-item-title class="text-h5 mb-2">LEADERBOARD</v-list-item-title>
                  <v-list-item-subtitle>A leaderboard for the best of us</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="70" color="transparent"><img src="../assets/img/leaderboard4.png"
                                                                            alt="BENEFIT 4">
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
              </v-card-actions>
            </v-card>

            <!-- VCARD 5 -->
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line> <!-- items three in a row -->
                <v-list-item-content>
                  <div class="text-overline mb-4"> BENEFIT 5</div>
                  <v-list-item-title class="text-h5 mb-2">WEATHER DATA</v-list-item-title>
                  <v-list-item-subtitle>Gather data on our main page</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="80" color="transparent"><img src="../assets/img/data.png"
                                                                            alt="BENEFIT 5">
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
              </v-card-actions>
            </v-card>

            <!-- VCARD 6 -->
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line> <!-- items three in a row -->
                <v-list-item-content>
                  <div class="text-overline mb-4">BENEFIT 6</div>
                  <v-list-item-title class="text-h5 mb-2">LOG IN SYSTEM</v-list-item-title>
                  <v-list-item-subtitle>Easy and secure login system</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="70" color="transparent"><img src="../assets/img/login.png"
                                                                            alt="BENEFIT 6">
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
              </v-card-actions>
            </v-card>
          </v-container>

          <!-- VCARD 7 -->
          <v-container fill-height grid-list-xl text-xs-center>
            <!--third container (one line) || fill-height applies height 100% and align-items to center-->
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line> <!-- items three in a row -->
                <v-list-item-content>
                  <div class="text-overline mb-4"> BENEFIT 7</div>
                  <v-list-item-title class="text-h5 mb-2">FAST</v-list-item-title>
                  <v-list-item-subtitle>We guarantee fast transmission</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="70" color="transparent"><img src="../assets/img/fast.png"
                                                                            alt="BENEFIT 7">
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
              </v-card-actions>
            </v-card>

            <!-- VCARD 8 -->
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line> <!-- items three in a row -->
                <v-list-item-content>
                  <div class="text-overline mb-4"> BENEFIT 8</div>
                  <v-list-item-title class="text-h5 mb-2">CLIMATE FRIENDLY</v-list-item-title>
                  <v-list-item-subtitle>Unlike bitcoin, weathercoin is climate friendly</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="80" color="transparent"><img src="../assets/img/climate.png"
                                                                            alt="BENEFIT 8">
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
              </v-card-actions>
            </v-card>

            <!-- VCARD 9 -->
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line> <!-- items three in a row -->
                <v-list-item-content>
                  <div class="text-overline mb-4"> BENEFIT 9</div>
                  <v-list-item-title class="text-h5 mb-2">SECURE</v-list-item-title>
                  <v-list-item-subtitle>We guarantee excellent security</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="70" color="transparent"><img src="../assets/img/secure.png"
                                                                            alt="BENEFIT 9">
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
              </v-card-actions>
            </v-card>
          </v-container>

        </div>
      </div>
      <!-- <Footer/> -->
    </v-app>
  </div>
</template>

<script>
/* import all necessary components*/
import NavBar2 from "@/components/NavBar";
import Footer from "@/components/Footer";
export default {
  name: "weathercoin",
  components: {
    NavBar2,
    Footer,
  },
  data() { //Data is the private memory of each component where you can store any variables you need
    return {
      userArray: [],
      mintedWeatherCoins: 0,
      url_base: 'http://api.creativehandles.com/getRandomColor',
    }
  },
  /* gets instantly called*/
  async created() {
    let color;
    /* async -> script is downloaded in parallel to parsing the page, and executed as soon as it is available */
    if (this.$fire.auth.currentUser != null) { //if user is logged in get mintedweathercoins
      const docRef = this.$fire.firestore.collection('users'); //get the collection 'users' (user|weathercoin)
      const snapshot = await docRef.get(); //wait until a promise is settled -> until it's getted and safe it into snapshot
      this.minedWeatherCoins = 0; //set to 0
      let i = 0;
      snapshot.forEach(doc => { //iterate through doc and calculate full weathercoins of all users (minted)
        this.userArray[i] = doc.data();
        this.minedWeatherCoins = this.minedWeatherCoins + this.userArray[i].weatherCoin;
        i++;
      });
      this.userArray.sort(this.compareScores); //first sort then calculating
      this.userArray[0] = this.minedWeatherCoins; /* overwrite first entry of array with our minted weathercoins*/
    }
    // fetch random color and apply it to our weathercoin minted text
    fetch(`${this.url_base}`)
      .then(function (response) { //if the request was successful go further with then
        response.json().then(function (data) { //get response in .json and deserialize to use it -> we want color
          color = data["color"]; // set color var with response random color
          //console.log(color);
          document.getElementById("randomColorHeading").style.color  = color; //set color to our element
        })
      })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#app {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('../assets/img/weathercoin.gif'); /*background gif*/
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}
.weathercoin {
  margin-top: 100px; /* distance from top of div*/
  text-align: center;
}
.mx-auto {
  margin-top: 15px; /*spaces between cards */
  margin-bottom: 0px; /* overwrite margin-bottom */
}
.mx-auto:hover {
  box-shadow: 0 0 15px #ffffff; /*shadow around v-card*/
}
h1 {
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.15em; /* distance between letters*/
  padding: 15px 20px; /* inner distance top | right */
  font-size: 1.5rem; /* root em -> 1rem = equal of the font size of html element */
}
h1:after {
  height: 2px; /* high of effect*/
  left: 50%; /* start at mid*/
  background: #fff;
  transition: width 0.3s ease 0s, left 0.3s ease 0s; /* effect of underline */
}
h1:hover:after {
  width: 100%; /* hovering over headline get underline effect full width*/
  left: 0; /* start at left*/
}
h2 {
  color: white; /* color of heading */
  font-size: 1.5rem; /* root em -> 1rem = equal of the font size of html element */
  font-weight: 500; /* normal font weight */
  letter-spacing: .025em; /* distance between each letter*/
  text-transform: uppercase;
  margin-top: 75px; /* distance to top */
  animation: glitch 525ms infinite; /* play animation */
}
h2:hover:after {
  width: 0%; /* reset the h2 defintion -> so no effect is visible*/
}
/* glitch effect from -> https://codepen.io/dpletiko/pen/ExoKOxN */
@keyframes glitch {
  0% {
    text-shadow: .05em 0 0 rgba(255, 0, 0, .75),
    -.05em -.025em 0 rgba(0, 255, 0, .75),
    .025em .05em 0 rgba(0, 0, 255, .75);
  }
  14% {
    text-shadow: .05em 0 0 rgba(255, 0, 0, .75),
    -.05em -.025em 0 rgba(0, 255, 0, .75),
    .025em .05em 0 rgba(0, 0, 255, .75);
  }
  15% {
    text-shadow: -.05em -.025em 0 rgba(255, 0, 0, .75),
    .025em .025em 0 rgba(0, 255, 0, .75),
    -.05em -.05em 0 rgba(0, 0, 255, .75);
  }
  49% {
    text-shadow: -.05em -.025em 0 rgba(255, 0, 0, .75),
    .025em .025em 0 rgba(0, 255, 0, .75),
    -.05em -.05em 0 rgba(0, 0, 255, .75);
  }
  50% {
    text-shadow: .025em .05em 0 rgba(255, 0, 0, .75),
    .05em 0 0 rgba(0, 255, 0, .75),
    0 -.05em 0 rgba(0, 0, 255, .75);
  }
  99% {
    text-shadow: .025em .05em 0 rgba(255, 0, 0, .75),
    .05em 0 0 rgba(0, 255, 0, .75),
    0 -.05em 0 rgba(0, 0, 255, .75);
  }
  100% {
    text-shadow: -.025em 0 0 rgba(255, 0, 0, .75),
    -.025em -.025em 0 rgba(0, 255, 0, .75),
    -.025em -.05em 0 rgba(0, 0, 255, .75);
  }
}
</style>

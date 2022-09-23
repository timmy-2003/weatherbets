<template>

  <v-app><!-- The Vuetify v-app component is an essential component and required in all applications made with the framework -->
    <nav-bar/>
    <div class="content">
      <h1>LEADERBOARDS</h1>
      <v-tabs id="tabs">
          <v-tab @click="lbType=1">WeatherCoin</v-tab>
          <v-tab @click="lbType=2">Locations</v-tab>
      </v-tabs>
    </div>
     <score-table v-if="lbType === 1" class="table"></score-table>
    <location-score-table class="table" v-if="lbType === 2"></location-score-table>

    <Footer/>
  </v-app>

</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#app {
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url('../assets/img/betting2.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}
.table {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -30%);
  border-radius: 5px;
  width: 25%;
}



.content{
  margin-top: 100px; /* distance from top for content*/
  text-align: center;
}

#tabs{
  width: min-content;
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  border-radius: 5px;
}

@media (max-width: 800px) {
  .table{
    width: 80%;
  }
}
</style>
<script>

export default {

  data(){
    return{
      lbType: 1

    }
  }
}
</script>

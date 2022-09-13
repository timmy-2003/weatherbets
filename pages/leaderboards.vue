<template>

  <v-app><!-- The Vuetify v-app component is an essential component and required in all applications made with the framework -->
    <nav-bar/>
    <div class="content">
      <h1>LEADERBOARDS</h1>
      <score-table id="table"></score-table> <!-- the actual leaderboard get component-->
    </div>
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
#table {
  position: fixed; /*positioned relative to the viewport, it always stays in the same place even if the page is scrolled */
  top: 50%; /* mid of screen */
  left: 50%; /*mid of screen*/
  transform: translate(-50%, -30%);  /*mid of screen*/
  border-radius: 5px;
  width: 30%;
}
.content{
  margin-top: 100px; /* distance from top for content*/
  text-align: center;
}
/* responsiveness */
@media (max-width: 800px) {
  #table {
    width: 70%;
  }
}
</style>

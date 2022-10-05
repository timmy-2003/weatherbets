<template>
<v-app id="background">
  <NavBar>

  </NavBar>

<lazy-map></lazy-map>

  <v-snackbar color="info" timeout="5000" id="snackbar" v-model="showSnackBar">
    {{ this.msg }}
  </v-snackbar>

</v-app>
</template>

<script>
export default {
  name: "maps",

  data(){
    return{
      showSnackBar: false,
      msg: "",
      bets: 0
    }
  },

  async created(){
    const docRef = this.$fire.firestore.collection("users").doc(this.$fire.auth.currentUser.uid);
    let document = docRef.get();
    let locations = (await document).get("locations")
    this.bets = locations.length;
    if (this.bets === 0){
      this.msg = "Your successful bets will appear on this map. Get started!"
      this.showSnackBar = true
    }

  }


}
</script>

<style>
.mapboxgl-ctrl-attrib-inner{
  display: none;
}

#background{
  background: #2d2d2d;
}

</style>

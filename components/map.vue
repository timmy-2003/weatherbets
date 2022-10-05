<template >

  <div id="map">

  </div>

</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'
const Crypto = require('crypto');
import mb from 'raw-loader!@/apiKeys.txt';

export default {
  name: "map",

  mounted() {
    this.createMap();
  },

  async created(){
    this.setApiKey()
  },

  data(){
    return{
      map: {},
      base_url: "https://api.openweathermap.org/geo/1.0/direct?",
      api_key_geo: '',
      mpb: "",
      dataLoaded: false
    }
  },

  methods: {

    setApiKey(){
      const apiArray = mb.split(/\r?\n|\r|\n/g);
      this.mpb = apiArray[2]
      this.api_key_geo = apiArray[3]
    },

    async createMap()
    {
      mapboxgl.accessToken = this.mpb;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center: [16.363449, 48.210033],
        zoom: 4
      })
      let arr = await this.getArray();
      for (let i = 0; i < arr.length; i++) {
        new mapboxgl.Marker()
          .setLngLat(arr[i])
          .addTo(this.map);
      }
    },

    async getArray(){
      let arr = [];
      const docRef = this.$fire.firestore.collection("users").doc(this.$fire.auth.currentUser.uid);
      let document = docRef.get();
      let fbArray = (await document).get("locations")
      for (let i = 0; i < fbArray.length; i++) {
        let geoCode = await this.locationToMapboxCode(fbArray[i]);
        arr.push(geoCode)
      }
      return arr;
    },

    async locationToMapboxCode(location) {
      let url = this.base_url + "q=" + location + "&appid=" + this.api_key_geo;
      let lat, lon
      await fetch(url)
        .then(res => res.json())
        .then(res => {
          lat = res[0].lat
          lon = res[0].lon
        })
      return [lon, lat]
    },

  }
}
</script>


<style scoped>
#map{
  width:100%;
  height:100vh;
}
</style>

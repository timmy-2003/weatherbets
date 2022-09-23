<template>

  <v-simple-table style="background-color: rgba(30,28,28,0.8); border-radius: 10px" class="table" v-if="userArray.length"> <!-- display if data is in userArray -->
    <thead> <!-- group header content in an HTML table -->
    <tr> <!-- row -->
      <th style="text-align: center; font-size: 15px; color: white">Username</th> <!-- cell -->
      <th style="text-align: center; font-size: 15px; color: white">WeatherCoin</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="user in userArray">
    <tr v-for="user in userArray">
      <!-- get's username and according weathercoin from array -->
      <td class="tableData">{{ user.username }}</td>
      <td class="tableData">{{ user.weatherCoin }}</td>
    </tr>
    </tbody>
  </v-simple-table>

</template>

<script>
export default {
  name: "scoreTable",
  data() {//Data is the private memory of each component where you can store any variables you need
    return {
      userArray: [],
    }
  },
  async created() {
    fetch("/api/leaderboard/weathercoin", {
      method: 'GET',
      cache: 'default'
    }).then(res => {
      if (!res.ok) {
        console.log("HTTP request unsuccessful")
      }
      return res;
    })
      .then(response => response.json()) //get response in .json and deserialize to set data as a userarray
      .then(data => this.userArray = data)
  }
}
</script>

<style scoped> /* scoped = apply to elements of the current component only */
.tableData{
  text-align: center;
}

</style>

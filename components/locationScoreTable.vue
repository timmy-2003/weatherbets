<template>

  <v-simple-table style="background-color: rgba(30,28,28,0.8); border-radius: 10px" class="table" v-if="usersLocations.length">
    <thead>
    <tr>
      <th style="text-align: center; font-size: 15px; color: white">Username</th>
      <th style="text-align: center; font-size: 15px; color: white">Locations</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="user in usersLocations">
      <td class="tableData" >{{ user.username }}</td>
      <td class="tableData">{{ user.locations.length }}</td>
    </tr>
    </tbody>
  </v-simple-table>

</template>

<script>
export default {
  name: "locationScoreTable",
  data() {
    return {
      usersLocations: [],
    }
  },

  async created() {
    fetch("/api/leaderboard/locations", {
      method: 'GET',
      cache: 'default'
    }).then(res => {
      if (!res.ok) {
        console.log("HTTP request unsuccessful")
      }
      return res;
    })
      .then(response => response.json()) //get response in .json and deserialize to set data as a userarray
      .then(data => this.usersLocations = data)
  }
}
</script>

<style scoped> /* scoped = apply to elements of the current component only */
.tableData{
  text-align: center;
}
</style>

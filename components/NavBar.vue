<template>

  <v-app-bar app color="black"  height="60">
    <v-toolbar color="black" height="58">
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon> <!-- when clicked navbardrawer get's displayed -->
      <div class="pb-2"> <!-- image get's displayed more top -->
        <v-img max-height="60" max-width="60" :src="require('../assets/img/icon.png')"></v-img>
      </div>
      <v-toolbar-title>
        <NuxtLink to="/" class="nuxt-link-active-underline-headline">WEATHER WETTEN</NuxtLink> <!-- link to index.vue -->
      </v-toolbar-title>
      <v-spacer/> <!-- space to other navbar elements -->
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn color="transparent" v-if="$fire.auth.currentUser != null"> <!-- condition if you are logged in or not -->
          <NuxtLink to="/bet" class="nuxt-link-active-underline">BET</NuxtLink> <!-- link to bet.vue -->
        </v-btn>
        <v-btn color="black" v-if="$fire.auth.currentUser != null">
          <nuxt-link to="/leaderboards" class="nuxt-link-active-underline">LEADERBOARDS</nuxt-link> <!-- link to leaderboards.vue -->
        </v-btn>
        <v-btn color="black">
          <nuxt-link to="/weathercoin" class="nuxt-link-active-underline">WEATHERCOIN</nuxt-link> <!-- link to weathercoin.vue -->
        </v-btn>
        <v-btn color="black">
          <nuxt-link to="/aboutus" class="nuxt-link-active-underline">ABOUT US</nuxt-link> <!-- link to aboutus.vue -->
        </v-btn>
        <v-btn color="black" v-if="$fire.auth.currentUser == null">
          <nuxt-link to="/Login" class="nuxt-link-active-underline">LOG IN</nuxt-link> <!-- link to login.vue -->
        </v-btn>
        <v-btn color="black" v-if="$fire.auth.currentUser != null">
          <nuxt-link to="/maps" class="nuxt-link-active-underline">MAP</nuxt-link> <!-- link to profile.vue -->
        </v-btn>
        <v-btn color="black" v-if="$fire.auth.currentUser != null">
          <nuxt-link to="/Profile" class="nuxt-link-active-underline">PROFILE</nuxt-link> <!-- link to profile.vue -->
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- NAVBAR DRAWER -->
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      color="black"
      height="1080"
      width="280"
      class="my-1">

      <v-list-item>
        <v-list-item-avatar>
          <v-icon> mdi-weather-sunny</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>  <NuxtLink to="/" class="nuxt-link-active-underline-headline-navbarDrawer">WEATHER WETTEN</NuxtLink></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link> <!-- for each item in items list them in navbar -->
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon> <!-- for each item in items list them in navbar as icons beside element -->
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              <!-- for each item in items list them in navbar as links when clicking onto the text-->
              <nuxt-link :to="{ path: item.link, query: { plan: 'private' }}" class="nuxt-link-active">{{
                  item.title
                }}
              </nuxt-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>

</template>

<script>
export default {
  data() { //Data is the private memory of each component where you can store any variables you need
    // if logged in display this sort of navbar elements
    if (this.$fire.auth.currentUser != null) {
      return {
        drawer: null,
        items: [
          {title: 'BET', icon: 'mdi-dice-6', link: 'bet'},
          {title: 'LEADERBOARDS', icon: 'mdi-chart-bar', link: 'leaderboards'},
          {title: 'WEATHERCOIN', icon: 'mdi-currency-btc', link: 'weathercoin'},
          {title: 'ABOUT US', icon: 'mdi-account-multiple', link: 'aboutus'},
          {title: 'MAP', icon: "mdi-dice-6", link: 'maps'},
          {title: 'PROFILE', icon: "mdi-emoticon-cool", link: 'Profile'}
        ],
      }
    }
    // if not logged in display this sort of navbar elements
    else {
      return {
        drawer: null,
        items: [
          {title: 'WEATHERCOIN', icon: 'mdi-currency-btc', link: 'weathercoin'},
          {title: 'ABOUT US', icon: 'mdi-account-multiple', link: 'aboutus'},
          {title: 'LOG IN', icon: 'mdi-login', link: 'Login'},
        ],
      }
    }
  }
}
</script>

<style>
/* standard nuxt link for navbar-drawer*/
.nuxt-link-active {
  font-weight: bold;
  text-decoration: none;
}
/* nuxt link for standard navbar at top*/
.nuxt-link-active-underline {
  font-weight: bold;
  text-decoration: none;
}
/* nuxt link for standard navbar at top hovering*/
.nuxt-link-active-underline:after {
  bottom: -5px;
  content: "";
  display: block;
  height: 2px;
  left: 50%;
  position: absolute;
  background: #fff;
  transition: width 0.3s ease 0s, left 0.3s ease 0s;
  width: 0;
}
/* nuxt link for standard navbar at top hovering*/
.nuxt-link-active-underline:hover:after {
  width: 100%; /* fill width */
  left: 0; /* start left */
}
/* nuxt link for headline of navbar hovering*/
.nuxt-link-active-underline-headline:after {
  bottom: -5px;
  content: "";
  height: 2px;
  left: 50%;
  position: absolute;
  background: #fff;
  transition: width 0.3s ease 0s, left 0.3s ease 0s;
  width: 0;
}
/* nuxt link for headline of navbar hovering*/
.nuxt-link-active-underline-headline:hover:after {
  width: 115%; /* fill whole width */
  left: -15px; /* start more left */
}
/* nuxt link for headline of navbarDrawer*/
.nuxt-link-active-underline-headline-navbarDrawer{
  color: #fff;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.15em;
  display: inline-block;
  padding: 15px 5px;
  position: relative;
  font-size: 1rem;
}
/* nuxt link for headline of navbarDrawer hovering*/
.nuxt-link-active-underline-headline-navbarDrawer:after {
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
/* nuxt link for headline of navbarDrawer hovering*/
.nuxt-link-active-underline-headline-navbarDrawer:hover:after {
  width: 100%; /* fill width */
  left: 0; /* start left*/
}
</style>

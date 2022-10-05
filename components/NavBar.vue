<template>

  <v-app-bar app color="black"  height="60">
    <v-toolbar color="black" height="58">
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="pb-2"> <!-- image get's displayed more top -->
        <v-img max-height="60" max-width="60" :src="require('../assets/img/icon.png')"></v-img>
      </div>
      <v-toolbar-title>
        <NuxtLink to="/" class="nuxt-link-active-underline-headline">WEATHER WETTEN</NuxtLink>
      </v-toolbar-title>
      <v-spacer/> <!-- space to other navbar elements -->
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn color="transparent" v-if="$fire.auth.currentUser != null">
          <NuxtLink to="/bet" class="nuxt-link-active-underline">BET</NuxtLink>
        </v-btn>
        <v-btn color="black" v-if="$fire.auth.currentUser != null">
          <nuxt-link to="/leaderboards" class="nuxt-link-active-underline">LEADERBOARDS</nuxt-link>
        </v-btn>
        <v-btn color="black">
          <nuxt-link to="/weathercoin" class="nuxt-link-active-underline">WEATHERCOIN</nuxt-link>
        </v-btn>
        <v-btn color="black">
          <nuxt-link to="/aboutus" class="nuxt-link-active-underline">ABOUT US</nuxt-link>
        </v-btn>
        <v-btn color="black" v-if="$fire.auth.currentUser == null">
          <nuxt-link to="/Login" class="nuxt-link-active-underline">LOG IN</nuxt-link>
        </v-btn>
        <v-btn color="black" v-if="$fire.auth.currentUser != null">
          <nuxt-link to="/maps" class="nuxt-link-active-underline">MAP</nuxt-link>
        </v-btn>
        <v-btn color="black" v-if="$fire.auth.currentUser != null">
          <nuxt-link to="/Profile" class="nuxt-link-active-underline">PROFILE</nuxt-link>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
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
          link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
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
  data() {
    if (this.$fire.auth.currentUser != null) {
      return {
        drawer: null,
        items: [
          {title: 'BET', icon: 'mdi-dice-6', link: 'bet'},
          {title: 'LEADERBOARDS', icon: 'mdi-chart-bar', link: 'leaderboards'},
          {title: 'WEATHERCOIN', icon: 'mdi-bitcoin', link: 'weathercoin'},
          {title: 'ABOUT US', icon: 'mdi-account-multiple', link: 'aboutus'},
          {title: 'MAP', icon: "mdi-map", link: 'maps'},
          {title: 'PROFILE', icon: "mdi-account", link: 'Profile'}
        ],
      }
    }
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

.nuxt-link-active {
  font-weight: bold;
  text-decoration: none;
}

.nuxt-link-active-underline {
  font-weight: bold;
  text-decoration: none;
}

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
.nuxt-link-active-underline:hover:after {
  width: 100%;
  left: 0;
}
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
.nuxt-link-active-underline-headline:hover:after {
  width: 115%;
  left: -15px;
}
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

.nuxt-link-active-underline-headline-navbarDrawer:hover:after {
  width: 100%;
  left: 0;
}
</style>

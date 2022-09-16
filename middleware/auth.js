/*
Middleware is code that gets run in between the request and the response.
We use auth.js when we ???
 */

export default function ({app, route, redirect}) { //???

  // if user tries to access profile, bet or leaderboards via url when he is not actually logged in, redirect him to the login page
  if (route.path === '/Profile' || route.path === '/bet' || route.path === '/leaderboards' || route.path === '/maps') {
    if (!app.$fire.auth.currentUser) {
      return redirect('/Login')
    }
  }

  // redirect user to Profile page if he tries to access login page when he is already logged in
  if ((route.path === '/Login' || route.path === '/SignUp') && app.$fire.auth.currentUser) {
    return redirect('Profile')
  }

}

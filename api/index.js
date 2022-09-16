const express = require('express')
const app = express()
app.use(express.json())  //loads the middleware function -> Middleware is code that gets run in between the request and the response.

import  firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = { // Have the firebase config here
  apiKey: "AIzaSyCC5C4C57eUS6EXEfFx8yeWWBqBQ23OO3s",
  authDomain: "weatherwetten-4ad9c.firebaseapp.com",
  projectId: "weatherwetten-4ad9c",
  storageBucket: "weatherwetten-4ad9c.appspot.com",
  messagingSenderId: "426562372824",
  appId: "1:426562372824:web:fa152b660cf973cfd683ad"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

/*
GET: safe, idempotent (we do not change something on the server || same request gives same response back)
we get username and weathercoin back from firebase
status 200 -> OK
 */
app.get("/userdata/:id", async (req, res)=>{
  const fbDocument = db.collection("/users").doc(req.params.id)
  let document = fbDocument.get();
  let username = (await document).get("username")
  let weathercoin = (await document).get("weatherCoin")
  res.json({"username":username, "weathercoin":weathercoin}).status(200)
})


/*
GET: safe, idempotent (we do not change something on the server || same request gives same response back)
we get the whole users collection and then sort the usernames according to their weathercoins
status 200 -> OK
 */
app.get("/leaderboard", async (req, res)=>{
  let userArray = [];
  const documents = db.collection('users');
  const snapshot = await documents.get();
  let i = 0;
  snapshot.forEach(doc => {
    userArray[i] = doc.data();
    i++;
  });
  userArray.sort(compareScores);
  for (let i = userArray.length; i>5; i--)
  {
    userArray.pop();
  }
  res.send(userArray);
  res.status(200);
})

/*
DELETE: NOT safe, idempotent (we change something on the server || same request gives same response back)
we delete a bet of the user logged in - which is pending
status: 204 No Content
 */
app.delete("/delete/:id", (req, res)=>{
  const document = db.collection("/bets").doc(req.params.id)
  document.delete()
    .then(()=>res.sendStatus(204));
})

/*
POST: NOT safe, NOT idempotent (we change something on the server || if I create it twice I create a second resource)
we create a new user with standard 10 weathercoins
status 201 -> CREATED
 */
app.post("/create/:id", async (req, res)=>{
  const reference = db.collection('users').doc(req.params.id);
  console.log(req.body)
  const document = {
    username: req.body.username,
    weatherCoin: 10,
    locations: []
  }
  try {
    await reference.set(document)
  } catch (error) {
    console.log(error.message)
  }
  res.status(201) // 201 means "created", post request successful and resource created
})

/*
PUT: NOT safe, idempotent (we change something on the server || same request gives same response back)
we fully UPDATE something -> the bet which is pending
status: 200 - OK
 */
app.put("/lose/:id", async (req, res)=>{
  const docRef = db.collection("users").doc(req.params.id)
  const document = req.body
  await docRef.set(document).then(
    () =>{
      res.sendStatus(200)
    }
  )
})

/*
PATCH: NOT safe, NOT idempotent (we change something on the server || same request gives NOT same response back for example change all 'a' to 'baa')
So while most PATCH operations might be idempotent, there are some that aren't.
we partly UPDATE something -> the username
status 200 -> OK
 */
app.patch("/edit/:id", async (req, res)=>{
  let newUsername = req.body.newUsername;
  const reference = db.collection('users').doc(req.params.id);
  await reference.update({username: newUsername})
  res.sendStatus(200)
})

/*
PATCH: NOT safe, NOT idempotent (we change something on the server || same request gives NOT same response back)
So while most PATCH operations might be idempotent, there are some that aren't.
we partly UPDATE something -> the weathercoins
status 200 -> OK
 */
app.patch("/edit/:id/:type", async (req, res)=>{
  let updatedCoins = req.body.weatherCoins;
  const reference = db.collection('users').doc(req.params.id);
  await reference.update({weatherCoin: updatedCoins})
  res.sendStatus(200)
})

/*
compare the scores for leaderboards
 */
function compareScores(a, b) {
  let scoreA = a.weatherCoin;
  let scoreB = b.weatherCoin;

  if (scoreA < scoreB) {
    return 1;
  }
  if (scoreA > scoreB) {
    return -1;
  }
  return 0; //same score
}


/*
???
 */
module.exports = {
  path: '/api',
  handler: app
}



const { response } = require('express');
const express = require('express');
const app = express();
//To enable environment variables to be accessible while running locally
require('dotenv').config();

//To configure the auth object using the credentials from our environment variables. 
//Use this object as middleware in our Express server. 

//const { auth } = require('express-openid-connect');

//Edit the previous line to protect route so only user can access or log in.
const { auth, requiresAuth } = require('express-openid-connect');

app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
    })
);

//To show whether the user is logged in or not, we define an index route using:

app.get('/', (request, response) => {
    response.send(request.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

//To track a logged-in user, create a profile route that will show info about the user 
//It will grab information about the logged-in user and returns it as json

//app.get('/profile', (req, res) => {
//    res.send(JSON.stringify(req.oidc.user));
//});

//Edit the previous line to protect route so only user can accesss or log in
app.get('/profile', requiresAuth(), (request, response) => {
    response.send(JSON.stringify(request.oidc.user));
});

app.get('/user/by-uid', requiresAuth(), (request, response) => {
    let user = data.get_user_by_user_id(request.query.user_id);
    response.status(200).send(user);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
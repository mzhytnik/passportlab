# PassportJS example project

 Sample project containing examples of using PassportJS with Native (login+password) and Federated (google) authentication
 
 deployed as is to https://passportlab.herokuapp.com/auth

## Running locally
```
npm install
node index
```
## Required environment variables
```
DATABASE_URL - PostgreSQL connection string
PORT - port to listen on
JWT_SECRET - secret string for signing JWT tokens
GOOGLE_CLIENT_ID - client_id from google dev credentials
GOOGLE_CLIENT_SECRET - client_secret from google dev credentials
GOOGLE_CALLBACK_URL - callback_url, in this case should be set to /auth/google/callback can be configured to something else in google strategy
HOST - by default - http://localhost:3000, also don' forget to update hosts in index.html/profile.html
```

## Project structure

**models** - Sequelize models, only User as an example  
**strategies** - PassportJS strategies, in this project only two are used (JWT and Google OAuth2)  
**const/utils/middlewares** - helpers  
**db** - database instance and connection params  
**index.html** - sample login page
**profile.html** - sample page for logged in user  


## How to obtain Google client_id/client_secret
https://developers.google.com/identity/sign-in/web/sign-in#create_authorization_credentials

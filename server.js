const express = require("express"); //importa express
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register')
const signIn = require('./controllers/signIn')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const dataBase = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'mocasin1',
      database : 'facerecognDB'
    }
  });


const app = express() // app va a contener la función de express so es como sdecir express.x
app.use(bodyParser.json()); //This truly habilita el bodyparser
app.use(cors())

// FAKEDATABASE
const database = { //for testing purposes
    users: [
        {
            id: "123",
            name: "john",
            email: "john@fast.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
            
        },
        {
            id: "124",
            name: "jill",
            email: "jill@fast.com",
            password: "banana",
            entries: 0,
            joined: new Date()
        }
    ],
    login : [
        {
            id: '987',
            hash: '',
            email: 'john@fast.com'

        }
    ]
}

/////////////////////END POINTS/////////////////////////////////////////////////////////////////////////

// ROOT
app.get("/" , (request, response) => { 
    response.send(database.users);
    
})
// /POST SIGNIN // Matchea email con el de DB, trae email y hash para compararlos.
app.post('/signin', (req, resp) => {
    signIn.handleSignIn(req, resp, dataBase, bcrypt, saltRounds)
})
// /REGISTER
app.post('/register', (req, resp) => {
    register.handleRegister(req, resp, dataBase, bcrypt, saltRounds) //dependency injection
})
// ID
app.get('/profile/:id', (req, resp) => {
        profile.handleProfile(req, resp, dataBase)
}
      ) 
// Send Image
app.put('/image' , (req, resp) =>{
    image.handleImage(req, resp, dataBase)
})
app.post('/imageurl', (req, resp) => { image.handleApiCall(req, resp)})

    
/////////////////////END POINTS/////////////////////////////////////////////////////////////////////////


// PORTS
app.listen(process.env.PORT || 3000, ()=>{
    console.log(`App running on port ${process.env.PORT}`)
})



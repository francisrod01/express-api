//- Call the packages we need
const express = require('express') // call express
const app = express() // define our app using express
const bodyParser = require('body-parser')


//- Configure app to user bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const port = process.env.PORT || 3030 // set our port


//- Routes for our API
const router = express.Router() // get an instance of the express Router


// Middleware to use for all requests.
router.use(function (req, res, next) {
    // do logging
    console.log('Something  is happening.')
    next() // make sure we go to the next routes and don't stop here.
})



//- Database and Bear model.
const MongoClient = require('mongodb').MongoClient
let database

MongoClient.connect('mongodb://localhost:27017/BstDstnyExpressApi', function (err, _database) {
    if (err) throw err

    console.log('Connected to database: ' + _database.databaseName)

    database = _database
})

// Using our models.
const Bear = require('./app/models/bear')




// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'hooray! Welcome to our API!'})
})


//- More routes for our API will happen here.
//


//- Register our routes.
// All of our routes will be prefixed with /api
app.use('/api', router)


// - Start the server.
app.listen(port)
console.log('Magic happens on port ' + port)

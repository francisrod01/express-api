// BASE SETUP
// =============================================================================

// Call the packages we need
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

// Configure our app
app.use(morgan('dev')) // log requests to the console

//- Configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const port = process.env.PORT || 8080 // set our port


//- DATABASE SETUP
const dbOpts = {
    uri: 'mongodb://localhost:27017/ExpressApi',
    opts: {promiseLibrary: require('bluebird')}
}

let dbConn
let dbName

const dbConnect = (_dbOpts) => {
    mongoose.Promise = _dbOpts.opts.promiseLibrary
    mongoose.connect(_dbOpts.uri, {
        useMongoClient: true,
        /* other options */
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30,
    })
    dbConn = mongoose.connection

    dbConn.on('error', (err) => {
        if (err) throw err
    })

    dbName = dbConn.name

    dbConn.once('open', () => {
        console.log('Connected to process ' + process.pid)
        console.log('Database name: ', dbName)
    })
}

// Running connection to database.
dbConnect(dbOpts)


// Bear models lives here
const Bear = require('./app/models/bear')


// ROUTES FOR OUR API
// =============================================================================

// create our router
const router = express.Router()

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.')
    next()
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'})
})

//- More routes for our API will happen here.
//

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

    // Create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function (req, res) {

        let bear = new Bear() // create a new instance of the Bear model
        bear.name = req.body.name  // set the bears name (comes from the request)

        bear.save(function (err) {
            if (err) {
                res.send(err)
            }

            res.json({message: 'Bear created!'})
        })
    })

    // Get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function (req, res) {
        Bear.find(function (err, bears) {
            if (err) {
                res.send(err)
            }

            res.json(bears)
        })
    })


// on routes that end in /bears/:bear_id
router.route('/bears/:bear_id')

    // Get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err) {
                res.send(err)
            }

            res.json(bear)
        })
    })

    // Update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function (req, res) {

        // Use our bear model to find the bear we want.
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err) {
                res.send(err)
            }

            // Update the bear info.
            bear.name = req.body.name

            // Save the bear data.
            bear.save(function (err) {
                if (err) {
                    res.send(err)
                }

                res.json({message: 'Bear updated!'})
            })
        })
    })


// REGISTER OUR ROUTES
// =============================================================================
// All of our routes will be prefixed with /api
app.use('/api', router)


// START THE SERVER
// =============================================================================
app.listen(port)
console.log('Magic happens on port ' + port)

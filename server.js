// BASE SETUP
// =============================================================================

// Call the packages we need
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')


// Configure our app
app.use(morgan('dev')) // log requests to the console

//- Configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const port = process.env.PORT || 8080 // set our port


//- DATABASE SETUP
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Express-api') // connect to our database

// Handle the connection event
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function () {
    console.log("DB connection alive")
})


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

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

// create a bear (accessed at POST http://localhost:8080/bears)
    .post(function (req, res) {

        let bear = new Bear()		// create a new instance of the Bear model
        bear.name = req.body.name  // set the bears name (comes from the request)

        bear.save(function (err) {
            if (err)
                res.send(err)

            res.json({message: 'Bear created!'});
        })

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function (req, res) {
        Bear.find(function (err, bears) {
            if (err)
                res.send(err)

            res.json(bears)
        });
    })

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

// get the bear with that id
    .get(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err)
                res.send(err)
            res.json(bear)
        });
    })

    // update the bear with this id
    .put(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {

            if (err)
                res.send(err)

            bear.name = req.body.name
            bear.save(function (err) {
                if (err)
                    res.send(err)

                res.json({message: 'Bear updated!'})
            });

        });
    })

    // delete the bear with this id
    .delete(function (req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function (err, bear) {
            if (err)
                res.send(err)

            res.json({message: 'Successfully deleted'})
        });
    })


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router)


// START THE SERVER
// =============================================================================
app.listen(port)
console.log('Magic happens on port ' + port)

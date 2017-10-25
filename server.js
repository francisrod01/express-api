//- Call the packages we need
const express = require('express') // call express
const app = express() // define our app using express
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


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
const dbOpts = {
    uri: 'mongodb://localhost:27017/BstDstnyExpressApi',
    opts: { promiseLibrary: require('bluebird') }
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

// Using our models.
const Bear = require('./app/models/bear')




// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'hooray! Welcome to our API!'})
})


//- More routes for our API will happen here.

// on routes that end in /bears
router.route('/bears')

    // Create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function (req, res) {
        // Create the new instance of the Bear model.
        let bear = new Bear();

        // Set the bears name (comes from the request).
        bear.name = req.body.name

        // Save the bear and check for errors.
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


//- Register our routes.
// All of our routes will be prefixed with /api
app.use('/api', router)


// - Start the server.
app.listen(port)
console.log('Magic happens on port ' + port)

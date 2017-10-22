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

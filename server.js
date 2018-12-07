// #region Libraries
/*
 * Get the required libraries
 */
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const zk = require('./zookeeperService.js')

// #endregion

/*
 * Use the express module to create the server
 */
const app = express();
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

const port = process.env.PORT || 30006;

/*
 * Routes for API
 */
app.get('/', (req, res) => {
  res.send('Welcome to the world of Zookeeper service discovery for Front End!!')
})

app.post('/discoverService', async (req, res) => {
    // console.log("Payload is: ", req.body.path)
    if(await zk.checkNodeExists(req.body.path)){
        var data = await zk.getNodeDetails(req.body.path)
        console.log("Response from ZK is: ", data)
        var response = {
            host:data.host,
            port: data.port,
            errorFlag: false
        }
        res.status(200).json(response)
    }
    else{
        var response = {
            errorFlag: true,
            errorMsg : `Node does not exist for path ${req.body.path}`
        }
        res.status(404).json(response)
    }
})

/*
 * Start the server
 */
const server = app.listen(port, () => {
    console.log(`Service Discovery API is running on port :${server.address().port}/discoverService`)
})

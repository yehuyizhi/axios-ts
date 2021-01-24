const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(webpackConfig)

app.use(webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    // stats: {
    //     colors: true,
    //     chunks: false
    // }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended:true}))

const router = express.Router()

app.get('/simple/get', function(req, res) {
    res.json({
        msg: 'hello'
    })
})

app.get('/base/get', function(req, res) {
    res.json(req.query)
})

app.post('/base/post', function(req, res) {
    res.json(req.body)
})

app.use(router)

const port = process.env.port || 3000

module.exports = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}.`)
})
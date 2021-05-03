const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const postRouter = require('./routes/post')
const keys = require('./keys')


const port = process.env.PORT || 5000
const clientPath = path.join(__dirname, 'client')


mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err))

const app = express()
app.use(bodyParser.json())
app.use('/api/post', postRouter)
app.use(express.static(clientPath))
app.use(express.static('public'))
app.use(express.static('files'))
app.use('/css',express.static(__dirname +'/css'))

app.listen(port, () => {
  console.log(`Server has been started on port ${port}`)
})
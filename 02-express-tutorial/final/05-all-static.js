const express = require('express')
const path = require('path')

const app = express()

// SETUP STATIC AND MIDDLEWARE
// STATIC FILES ARE FILES THAT THE SERVER DOES NOT HAVE TO CHANGE
app.use(express.static('./public'))

// app.get('/', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './navbar-app/index.html'))
//   adding to static assets
//   SSR
// })

app.all('*', (req, res) => {
  res.status(404).send('resource not found')
})

app.listen(5000, () => {
  console.log('server is listening on port 5000....')
})

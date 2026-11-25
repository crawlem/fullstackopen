require('dotenv').config()

const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Enable CORS for all routes
app.use(cors())

// Express and Morgan middleware
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

// Enable static file serving for the frontend build
app.use(express.static('dist'))

app.get('/info', (request, response) => {
  Person.find()
    .then(persons => {
      const date = new Date()
      response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  // const existingPerson = persons.find(person => person.name === body.name)
  // if (existingPerson) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log('Server running on port %d', PORT)
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

app.get('/info', (request, response, next) => {
  Person.find()
    .then(persons => {
      const date = new Date()
      response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const updatedPerson = {
    name: body.name,
    number: body.number
  }

  Person.findById(id)
    .then(person => {
      person.name = updatedPerson.name
      person.number = updatedPerson.number
      return person.save().then(savedPerson => {
        response.json(savedPerson)
      })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log('Server running on port %d', PORT)
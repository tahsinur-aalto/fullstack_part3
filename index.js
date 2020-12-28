require('dotenv').config()
const express = require('express') // Equivalent to import
const morgan = require('morgan') // Logging library
const cors = require('cors')
const app = express() // Express app

// app.use(morgan('tiny'))
app.use(express.static('build'))
app.use(cors())
morgan.token('data', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status  :res[content-length] - :response-time ms :data '))
app.use(express.json()) // Use json-parser middleware

const Person = require('./models/person')

// let persons = [
//     {
//         id: 1,
//         name: "Arto Hellas",
//         number: "040-123456",
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523",
//     },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345",
//     },
//     {
//         id: 4,
//         name: "Mary Poppendick",
//         number: "39-23-6423122",
//     },
// ]

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
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


app.get('/info', (request, response) => {
  Person.countDocuments({}, (error, count) => {
    if (error) {
      response.send(error)
    } else {
      const phonebookInfo = `<p></p>Phonebook has info for ${count} people </p>
                            <p> ${new Date()}</p>`
      response.send(phonebookInfo)
    }
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // if (!body.name || !body.number) {
  //     return response.status(400).json({error: 'name or number is missing'})
  // }
  // else if (persons.map(person => person.name).includes(body.name)){
  //     return response.status(400).json({error: 'name must be unique'})
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedFormattedPerson => {
      response.json(savedFormattedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  
  Person.findByIdAndUpdate(request.params.id, person, { runValidators: true, context: 'query', new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id)
  // const id = Number(request.params.id)
  const id = request.params.id

  Person.findByIdAndRemove(id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Handle request to unknown routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Handle errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
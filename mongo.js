const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const dbname = 'phonebook-db'
const url = `mongodb+srv://fullstack:${password}@cluster0.sghlf.mongodb.net/${dbname}?retryWrites=true&w=majority`


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// Define Schema
const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Define model, equivalent to collection 
const Person = mongoose.model('Person', phonebookSchema)

if (process_length == 3){
  
  console.log('phonebook')
  // Read all documents from Note model
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  
  // Create new document(note)
  const person = new Person({
    name: name,
    number: number,
  })

  // Save document to database
  person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

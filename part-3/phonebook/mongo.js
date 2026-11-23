const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@fullstackopen.ekwpbi9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

// Force IPv4 connection by setting the family option to 4
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // If only the password is provided, fetch and display all persons
  Person.find({})
    .then(persons => {
      console.log('Phonebook:');
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch(error => {
      console.error('Error fetching persons:', error.message);
      mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
  // If name and number are provided, add a new person
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch(error => {
      console.error('Error saving person:', error.message);
      mongoose.connection.close();
    });
} else {
  console.log('Invalid number of arguments. Usage:');
  console.log('To fetch all persons: node mongo.js <password>');
  console.log('To add a new person: node mongo.js <password> <name> <number>');
  mongoose.connection.close();
}
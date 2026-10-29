import { useState, useEffect } from 'react'
import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filteredPersons, setFilteredPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    // Check if name or number is empty
    if (!newName || !newNumber) {
      alert('Please fill in both name and number fields')
      return
    }
    
    // Check if the name already exists in the phonebook
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    // Add the new person to the phonebook
    personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
      .catch(error => {
        console.error('Error adding person:', error)
      })

    // Clear the input fields after adding the person
    setNewName('')
    setNewNumber('')
    setFilteredPersons(null) // Reset the filtered persons after adding a new person
  }

  const filterPersons = (event) => {
    const filter = event.target.value.toLowerCase()
    const filteredPersons = persons.filter(person =>
      person.name.toLowerCase().includes(filter)
    )
    setFilteredPersons(filteredPersons)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterPersons={filterPersons} />

      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons ? filteredPersons : persons} />
    </div>
  )
}

export default App
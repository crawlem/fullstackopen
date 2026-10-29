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

  // Load the initial list of persons from the server
  useEffect(() => {
    personService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  // Function to add a new person to the phonebook and clear the filter
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
    if (persons.some(person => person.name.toUpperCase() === newName.toUpperCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        // Find the existing person and update their number
        const existingPerson = persons.find(person => person.name.toUpperCase() === newName.toUpperCase())
        personService.update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
          })
          .catch(error => {
            console.error('Error updating person:', error)
          })
      }
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

  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error('Error deleting person:', error)
        })
    }
  }

  // Function to filter the phonebook list
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
      <Persons persons={filteredPersons ? filteredPersons : persons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
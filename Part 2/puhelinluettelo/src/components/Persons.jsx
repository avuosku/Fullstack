const Persons = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map(person => (
        <li key={person.id}>
          {person.name} {person.number} 
          <button onClick={() => deletePerson(person.id, person.name)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
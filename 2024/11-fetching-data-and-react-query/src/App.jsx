import { useEffect, useState } from "react";
import useFetch from "./hooks/useFetch";
import { useMutation } from "@tanstack/react-query";

function App() {
  const [selectedPersonId, setSelectedPersonId] = useState();
  
  const { data, isFetching, error  } = useFetch({
    key: 'people',
    url: 'https://dummyjson.com/users',
  });

  const { data: clickedPersonData } = useFetch({
    key: `person-${selectedPersonId}`,
    url: `https://dummyjson.com/users/${selectedPersonId}`,
    enabled: selectedPersonId !== undefined,
  });

  const onPersonClick = (id) => {
    setSelectedPersonId(id);
  }

  const { mutate: createPerson } = useMutation({
    mutationKey: 'addUser',
    mutationFn: async (bodyData) => {
      const response = await fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if(!response.ok) {
        throw new Error('Failed to add user');
      }

      return response.json();
    },
  })

  useEffect(() => {
    if(!clickedPersonData) return;
    alert(`You clicked on ${clickedPersonData?.firstName}. Their ip address is ${clickedPersonData?.ip}`);
  }, [clickedPersonData]);

  if(isFetching) {
    return (
      <h1>Loading...</h1>
    )
  }

  if(!isFetching && error) {
    return (
      <h1>Error: {error.message}</h1>
    )
  }

  return (
      <div>
        <h1>People</h1>
          {data.users.map(person => (
            <div key={person.id}>
              <img 
                src={person.image} 
                alt={person.firstName}
                onClick={() => onPersonClick(person.id)}
                style={{ cursor: 'pointer' }} />
              <li>
                {person.firstName} {person.lastName}
              </li>
            </div>
          ))}
          <button onClick={() => createPerson({ firstName: 'Mario', lastName: 'Stojcevski', age: 250})}>Create Mario</button>
      </div>
  )
}

export default App;

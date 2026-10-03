import { useState, useEffect } from 'react';

function UserList() { 
  const [users, setUsers] = useState([]);       //  овде ке ни ги чува корисниците кој ке ги добиеме од од API
  //  на почеток   users = []  па после селдува 
  const [loading, setLoading] = useState(true);
  // Ова кажува дали сè уште чекаме data 
  const [error, setError] = useState(null);
  //Ова ќе ја чува error пораката ако нешто тргне наопаку.

//   Следно го додаваме useEffect() и fetch()

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        );
  
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
  
        const data = await response.json();
  
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  
    fetchUsers();
  }, []);
//    []    пушти го effect-от само еднаш, кога component-от ќе се појави.

// ако уште чекаме data, прикажи:
if (loading) {
    return <p>Loading users...</p>;
  }
  
  // ако fetch-от падне, прикажи error порака
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Users</h2>
      {/* Помини низ секој user и направи по еден <li>. */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> — {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;




// component renders
// ↓
// useEffect runs
// ↓
// fetchUsers()
// ↓
// fetch API
// ↓
// setUsers(data)
// ↓
// setLoading(false)
// ↓
// component renders again
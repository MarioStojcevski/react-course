import { useState } from 'react';

function TodoList() {
  // setTodos = changes the list
  const [todos, setTodos] = useState([]);

  // input = what the user types  ,  setInput = changes the input text  
  const [input, setInput] = useState('');

  function addTodo() {
    // If input is empty, do nothing.
    if (input.trim() === '') {
      return;
    }

    // Add new todo to the list.
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: input
      }
    ]);

    // Clear the input after adding.
    setInput('');
  }

  // Remove one todo by id.
function removeTodo(id) {
  setTodos(
    todos.filter(todo => todo.id !== id)
  );
}

  return (
    <div>
      <h2>Todo List</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        placeholder="Add a todo..."
      />

      <button onClick={addTodo}>
        Add
      </button>

     <ul>
  {todos.map(todo => (
    <li key={todo.id}>
      {todo.text}

      <button onClick={() => removeTodo(todo.id)}>
        ×
      </button>
    </li>
  ))}
</ul>
    </div>
  );
}

export default TodoList;
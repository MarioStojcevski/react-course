import { useState } from 'react';
import styles from './TodoList.module.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  function addTodo() {
    if (input.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: input.trim() }]);
    setInput('');
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <div className={styles.card}>
      <h2>Todo List</h2>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 ? (
        <p className={styles.empty}>Nothing here yet. Add your first todo.</p>
      ) : (
        <ul className={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} className={styles.item}>
              <span>{todo.text}</span>
              <button
                className={styles.remove}
                onClick={() => removeTodo(todo.id)}
                aria-label={`Remove ${todo.text}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;

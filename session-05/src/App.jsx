import Counter from './Counter';
import TodoList from './TodoList';
import VisibilityToggle from './VisibilityToggle';
import ColorPicker from './ColorPicker';
import Button from './Button';

function App() {
  return (
    <div>
      <h1>Session 05 App</h1>
      <Counter />
      <TodoList />
       <VisibilityToggle />
       <ColorPicker />

         <h2>CSS Module Buttons</h2>

      <Button>
        Normal Button
      </Button>

      <Button primary>
        Primary Button
      </Button>
    </div>
    
  );
}

export default App;



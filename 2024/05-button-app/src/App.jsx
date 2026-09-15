import './App.css'
import Button from './components/Button';
import { BsFire } from "react-icons/bs";

function App() {

  return (
    <>
      <Button>Filled</Button>
      <Button mode="outlined" Icon={BsFire}>Outlined</Button>
      <Button mode="text">Text</Button>
    </>
  )
}

export default App;

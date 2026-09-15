import './App.css';
import CardList from './components/CardList';
import Header from './components/Header';

function App() {

  return (
    <div>
      <Header Layout='span'>
        <h1>Our libraries</h1>
      </Header>

      <CardList />
      
    </div>
  )
}

export default App;

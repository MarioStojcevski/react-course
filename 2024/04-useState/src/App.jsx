import { useState } from 'react';

const App = () => {
  const [title, setTitle] = useState('Start Game');
  const [inputText, setInputText] = useState('');
  const [showDiv, setShowDiv] = useState(true);

  const smenititle = value => {
    setTitle(value);
  };

  const changeText = newText => {
    setInputText(newText);
  };

  const smeniPozadina = () => {
    document.body.style.background = 'red';
    setShowDiv(false);
  }

  return (
    <>
      {showDiv && <div>
        <h1 className='App'>{title}</h1>
        <input
          type='text'
          value={inputText}
          onChange={event => changeText(event.target.value)}/>
        {title === 'Start Game' && <button onClick={() => smenititle(inputText)}>Change title</button>}
        {title !== 'Start Game' && <button onClick={smeniPozadina}>press play</button>}
      </div>}
    </>
  );
}

export default App;
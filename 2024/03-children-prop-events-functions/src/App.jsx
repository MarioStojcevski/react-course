import './App.css'
import TabButton from './components/TabButton';

import { useState } from 'react';

const data = ['JavaScript (JS) is a lightweight interpreted (or just-in-time compiled) programming language with first-class functions.While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js,Apache CouchDB and Adobe Acrobat.','      TypeScript is a free and open-source high-level programming language developed by Microsoft that adds static typing with optionaltype annotations to JavaScript. It is designed for the development of large applications and transpiles to JavaScript.','React (also known as React.js or ReactJS) is an open-source, front end, JavaScript library for building user interfaces or UIcomponents. It is maintained by Facebook and a community of individual developers and companies'];

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  }
  
  return (
    <div>
    <menu>
      <ul>
        <TabButton index={0} handleClickButton={handleTabClick}>
          JavaScript
        </TabButton>

        <TabButton index={1} handleClickButton={handleTabClick}>
          TypeScript
        </TabButton>

        <TabButton index={2} handleClickButton={handleTabClick}>
          React
        </TabButton>

      </ul>
    </menu>

    <main>
      <p>{data[activeTab]}</p>
    </main>

    </div>
  )
}

export default App;

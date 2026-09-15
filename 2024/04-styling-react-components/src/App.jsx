import AuthInputs from './components/AuthInputs.jsx';
import Header from './components/Header.jsx';
import { styled } from "styled-components";

const Heading2 = styled.h2`
    font-size: 1.5rem;
    color: red;
    margin-top: 1rem;
    text-align: center;
    background: pink;
  `;

export default function App() {
  

  return (
    <>
        <Heading2>
            Background vector created by rawpixel.com - www.freepik.com
        </Heading2>
    </>
  );
}

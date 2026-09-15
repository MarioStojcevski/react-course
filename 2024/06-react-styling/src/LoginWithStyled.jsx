import { styled } from 'styled-components';
import { useState } from 'react';
import { users } from "./utils";

const Container = styled.section({
  padding: '4em', 
  background: 'papayawhip',
  color: 'palevioletred'
});

const Title = styled.h1({
  fontSize: '1.5em',
  textAlign: 'center',
  color: '#BF4F74'
});

const Input = styled.input({
  padding: '0.5em',
  margin: '0.5em',
  color: 'palevioletred',
  background: 'papayawhip',
  border: '1px solid palevioletred',
  borderRadius: '3px',
  '&:focus': {
    border: '2px solid blue'
  },
});

const Label = styled.label({
  fontSize: '1em',
  textAlign: 'center',
  color: 'palevioletred',
  fontWeight: 'bold',
});

const Button = styled.button({
  padding: '0.5em',
  margin: '0.5em',
  color: 'palevioletred',
  background: 'papayawhip',
  border: '1px solid palevioletred',
  borderRadius: '3px',
  '&:hover': {
    color: 'white',
    background: 'palevioletred',
  },
});

const Message = styled.p({
  color: ({ isValid }) => isValid ? 'green' : 'red',
  fontWeight: 'bold',
});

const LoginWithStyled = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validCredentials = users.some(u => u.username === username && u.password === password);

  const handleSubmit = () => {
    setIsSubmitted(true);
  }

  return (
    <Container>
      <Title>Styled components in React</Title>

      {isSubmitted &&
        <Message isValid={validCredentials}>
          {validCredentials ? `Successfully logged in` : `Incorrect credentials`}
        </Message>
      }

      <Label 
        htmlFor="username">Enter your username:</Label>
      <Input 
        type='text' 
        id="username" 
        value={username} 
        onChange={(event) => {
          setUsername(event.target.value);
          setIsSubmitted(false);
        }} />
      
      <br />

      <Label 
        htmlFor="password">Enter your password:</Label>
      <Input 
        type='password' 
        id="password" 
        value={password} 
        onChange={(event) => {
          setPassword(event.target.value);
          setIsSubmitted(false);
        }} />

      <br />

      <Button onClick={handleSubmit}>Login</Button>

    </Container>
  );
};

export default LoginWithStyled;
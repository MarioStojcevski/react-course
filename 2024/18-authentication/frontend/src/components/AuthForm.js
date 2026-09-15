import { useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";

import classes from './AuthForm.module.css';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  const navigate = useNavigate();

  function switchAuthHandler() {
    setIsLogin((isCurrentlyLogin) => !isCurrentlyLogin);
  };

  const { mutateAsync: authUser, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`http://localhost:8080/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await res.json();
    },
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    
    const response = await authUser({ email, password});

    if(response.errors) {
      setErrorMessages(Object.values(response.errors));
    } else {
      setErrorMessages([]);
    }

    if(response.token) {
      localStorage.setItem('token', response.token);

      navigate('/');
    }
  }

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required onChange={(event) => setEmail(event.target.value)} />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required onChange={(event) => setPassword(event.target.value)} />
        </p>
        <div>
          {errorMessages.map((message) => (
            <p key={message}>{message}</p>
          ))}          
        </div>
        <div className={classes.actions}>
          <button disabled={isPending} onClick={switchAuthHandler} type="button">
            {isLogin ? 'Create new user' : 'Login'}
          </button>
          <button disabled={isPending} onClick={submitHandler}>{isLogin ? 'Login' : 'Sign up'}</button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;

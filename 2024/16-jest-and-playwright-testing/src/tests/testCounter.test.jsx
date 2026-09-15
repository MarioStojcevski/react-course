import { render } from 'vitest-browser-react';
import { describe, expect, test } from 'vitest';
import { userEvent } from '@vitest/browser/context'
import App from "../App";

describe('Testing App Component', () => {
  test('adds 1 + 2 to equal 2', async () => {
    render(<App />);
    const button = document.getElementById('counterButton');
   
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);
  
    const innerButtonText = document.getElementById('counterButton').innerHTML;
  
    expect(innerButtonText).toEqual('count is 5');
  });
  
  test('test validity of email', async () => {
    const person = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'password'
    }
  
    render(<App />);
    const emailInput = document.getElementById('email');
    await userEvent.fill(emailInput, person.email);
  
    expect(emailInput.value).toEqual(person.email);
  });

  test("something", () => {});
});
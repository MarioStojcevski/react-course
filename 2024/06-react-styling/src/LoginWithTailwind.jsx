import { useState } from "react";
import { users } from "./utils";

const LoginWithTailwind = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validCredentials = users.some(u => u.username === username && u.password === password);

  const handleSubmit = () => {
    setIsSubmitted(true);
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Styled Components in React</h1>

    {isSubmitted && (
      <p className={`text-lg ${validCredentials ? 'text-green-600' : 'text-red-600'} mb-4`}>
        {validCredentials ? 'Successfully logged in' : 'Incorrect credentials'}
      </p>
    )}

    <label htmlFor="username" className="text-gray-700 text-sm mb-2">
      Enter your username:
    </label>
    <input
      type="text"
      id="username"
      value={username}
      onChange={(event) => {
        setUsername(event.target.value);
        setIsSubmitted(false);
      }}
      className="w-64 px-4 py-2 border rounded-md mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <label htmlFor="password" className="text-gray-700 text-sm mb-2">
      Enter your password:
    </label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(event) => {
        setPassword(event.target.value);
        setIsSubmitted(false);
      }}
      className="w-64 px-4 py-2 border rounded-md mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      onClick={handleSubmit}
      className="w-64 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
    >
      Login
    </button>
  </div>
  );
};

export default LoginWithTailwind;
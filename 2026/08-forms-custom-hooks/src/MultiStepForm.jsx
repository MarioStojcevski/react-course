  //   try hard

import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

function MultiStepForm() {
  // Which step are we on?
  const [step, setStep] = useState(1);

  // Save every field in localStorage.
  const [name, setName] = useLocalStorage('multi-name', '');
  const [email, setEmail] = useLocalStorage('multi-email', '');
  const [address, setAddress] = useLocalStorage('multi-address', '');

  function nextStep() {
    setStep(step + 1);
  }

  function previousStep() {
    setStep(step - 1);
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log({
      name,
      email,
      address
    });
  }

  return (
    <div>
      <h2>Multi-Step Form</h2>

      <form onSubmit={handleSubmit}>

        {step === 1 && (
          <div>
            <h3>Step 1 — Name</h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />

            <button
              type="button"
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Step 2 — Email</h3>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <button
              type="button"
              onClick={previousStep}
            >
              Back
            </button>

            <button
              type="button"
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Step 3 — Address</h3>

            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />

            <button
              type="button"
              onClick={previousStep}
            >
              Back
            </button>

            <button type="submit">
              Submit
            </button>
          </div>
        )}

      </form>
    </div>
  );
}

export default MultiStepForm;
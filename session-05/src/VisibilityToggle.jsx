import { useState } from 'react';

function VisibilityToggle() {
  // isVisible remembers if the text is shown.
  // false means hidden at the start.
  const [isVisible, setIsVisible] = useState(false);

  function toggleVisibility() {
    setIsVisible(!isVisible);
  }

  return (
    <div>
      <h2>Visibility Toggle</h2>

      <button onClick={toggleVisibility}>
        Show / Hide
      </button>

      {isVisible && (
        <p>
    This text can be shown or hidden when you press the button Show/Hide.
    <br />
    It works with Enter and Space if its selected .
  </p>
      )}
    </div>
  );
}

export default VisibilityToggle;
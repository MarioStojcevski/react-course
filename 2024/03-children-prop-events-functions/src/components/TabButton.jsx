/* eslint-disable react/prop-types */
const TabButton = ({ children, index, handleClickButton }) => {
  return (
    <li>
      <button onClick={() => handleClickButton(index)}>{children}</button>
    </li>
  );
};

export default TabButton;
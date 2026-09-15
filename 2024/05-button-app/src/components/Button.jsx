/* eslint-disable react/prop-types */
const Button = ({ children, mode, Icon }) => {
  const styleForButton = {
    margin: '10px',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'blue',
  };

  if(mode === 'outlined') {
    styleForButton.backgroundColor = 'transparent';
    styleForButton.border = '1px solid #333';
  }

  if(mode === 'text') {
    styleForButton.backgroundColor = 'transparent';
    styleForButton.color = 'blue';
  }

  return (
    <span>
      
      <button style={{...styleForButton}}>
        {Icon && <Icon />}
          {children}
        </button>
    </span>
  )
};

export default Button;
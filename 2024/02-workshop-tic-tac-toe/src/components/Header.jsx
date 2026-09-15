const Header = () => {
  const random = (Math.random() * 10).toFixed(2);

  return (
    <header>
      <h1>Tic tac toe game {random}</h1>
    </header>
  );
};

export default Header;
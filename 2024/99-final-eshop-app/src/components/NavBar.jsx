import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="bg-gray-800 text-white">
  <div className="container mx-auto flex justify-between items-center p-4">
    <NavLink to="/" className="text-2xl font-bold">My Shop</NavLink>

    <nav className="space-x-4">
      <NavLink to="/" className="hover:text-gray-400">Home</NavLink>
      <NavLink to="/products" className="hover:text-gray-400">Products</NavLink>
      <NavLink to="/cart" className="hover:text-gray-400">Shopping Cart</NavLink>
    </nav>
  </div>
</header>
  );
};

export default NavBar;
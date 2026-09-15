/* eslint-disable react/prop-types */
 const Header = ({ children, Layout = 'header' }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default Header;
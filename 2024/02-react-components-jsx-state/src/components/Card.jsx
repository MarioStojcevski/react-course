// eslint-disable-next-line react/prop-types
const Card = ({ name, logo, url, ButtonComponent, ...props }) => {
  return (
    <div id={name} style={{ border: '2px solid #545454', borderRadius: '5px', margin: '5px', background: '#545454'}}>
      <a href={url} target="_blank">
        <img src={logo} className={`${name} logo`} {...props} />
      </a>

      <ButtonComponent />
    </div>
  );
};

export default Card; 
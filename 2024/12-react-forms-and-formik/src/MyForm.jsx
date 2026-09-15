import { useState } from 'react';

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: 'mario',
    email: 'test@test.com',
    telefon: '123456789'
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  }

  const changeFormData = (event, key) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [key]: event.target.value,
      }
    });
  }

  return (
    <div style={{ border: '1px solid black', height: '200px', width: 'full', marginTop: '50px'}}>

      <h2>Form handling</h2>
      <form>
        <label htmlFor="name">Name:</label>
        <input value={formData.name} onChange={(event) => changeFormData(event, "name")} id="name" name="name" type="text" />

        <br />
        <label htmlFor="email">Email:</label>
        <input value={formData.email} onChange={(event) => changeFormData(event, "email")} id="email" name="email" type="email" />
        <br />

        <label htmlFor="telefon">Telefon:</label>
        <input value={formData.telefon} onChange={(event) => changeFormData(event, "telefon")} id="telefon" name="telefon" type='tel' />

        <br />
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default MyForm;
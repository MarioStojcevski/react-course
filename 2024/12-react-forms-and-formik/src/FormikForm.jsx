import { useFormik } from 'formik';

const FormikForm = () => {
  const { values, setFieldValue, isSubmitting, handleSubmit, setSubmitting } = useFormik({
    initialValues: {
      name: 'mario',
      email: 'mario@gmail.com',
      telefon: '075 555 222',
    },
    onSubmit: (values) => {
      setTimeout(() => {
        console.log(values);
        setSubmitting(false);
      }, 5000);
    }
  });

  return (
    <div style={{ border: '1px solid black', height: '200px', width: 'full', marginTop: '50px'}}>
      <h2>Formik Form handling</h2>
      <form>
        <label htmlFor="name">Name:</label>
        <input value={values.name} onChange={(event) => setFieldValue("name", event.target.value)} id="name" name="name" type="text" />

        <br />
        <label htmlFor="email">Email:</label>
        <input value={values.email} onChange={(event) => setFieldValue("email", event.target.value)} id="email" name="email" type="email" />
        <br />

        <label htmlFor="telefon">Telefon:</label>
        <input value={values.telefon} onChange={(event) => setFieldValue("telefon", event.target.value)} id="telefon" name="telefon" type='tel' />

        <br />
        <button type="button" onClick={handleSubmit}>Submit</button>
        {isSubmitting && <p>Submitting...</p>}
      </form>
    </div>
  );
};

export default FormikForm;
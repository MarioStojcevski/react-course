import { Outlet, useLoaderData, Form, redirect, NavLink, useNavigation } from "react-router-dom";
import { getContacts, createContact } from "../contacts";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const key = url.searchParams.get('q');
  const contacts = await getContacts(key);

  return {
    contacts,
  };
}

export const action = async() => {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

const HomePage = () => {
  const { contacts } = useLoaderData();
  const { state } = useNavigation();

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink className={({ isActive, isPending}) => (
                      isActive ? 'active' : isPending ? 'pending' : ''
                    )}
                    to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite && <span>★</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
          )}
        </nav>
      </div>
      <div id="detail" className={state === 'loading' ? 'loading' : ''}>
        <Outlet />
      </div>
    </>
  );
};

export default HomePage;
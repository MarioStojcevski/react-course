import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const errorMessage = useRouteError();
  const navigate = useNavigate();
  console.error(errorMessage);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage.statusText || errorMessage.message}</i>
      </p>
      <button onClick={() => navigate("/")}>Go back</button>
    </div>
  );
}
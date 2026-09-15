import { useRef, useState } from "react";

export default function Player() {
  const [name, setName] = useState("unkown entity");
  const inputRef = useRef();

  const onChangeName = () => {
    setName(inputRef.current.value);
  };

  return (
    <section id="player">
      <h2>Welcome {name}</h2>
      <p>
        <input ref={inputRef} type="text" />
        <button onClick={onChangeName}>Set Name</button>
      </p>
    </section>
  );
}

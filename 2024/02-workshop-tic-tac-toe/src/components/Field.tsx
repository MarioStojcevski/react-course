import React from "react";
import "./Field.css";

type FieldProps = {
  index: number,
  element: string | null,
  clickFieldHandler: (a: number) => (string | null)[] | void,
}

const Field = ({ clickFieldHandler, index, element }: FieldProps) => {
  return (
    <button className="field-button" onClick={() => clickFieldHandler(index)}>
      {element}
    </button>
  );
};

export default Field;
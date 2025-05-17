import React from "react";

export default function SearchField({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label} :</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
      />
    </div>
  );
}

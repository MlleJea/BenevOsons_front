import React from "react";
import { Row, Col, InputGroup, Form } from "react-bootstrap";

export default function FormGroupRow({ label, name, type, value, onChange, error, icon, placeholder }) {
  return (
    <>
      <Row className="ps-3 pe-3">
        <Col sm={3}><output>{label}</output></Col>
        <Col sm={7}>
          <InputGroup className="mb-3">
            {icon && <InputGroup.Text><i className={`fa ${icon}`}></i></InputGroup.Text>}
            <Form.Control
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder || ""}
              isInvalid={!!error}
            />
          </InputGroup>
          {error && <Form.Text className="text-danger d-block mb-2">{error}</Form.Text>}
        </Col>
      </Row>
    </>
  );
}
import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import FormGroupRow from "@components/FormGroupRow";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFrenchPhone,
  validateRequiredText,
  validateDate,
  validateRNA
} from "@utils/validationUtils";
import AddressForm from "@components/AddressForm";

export default function RegisterView(props) {
  const [userType, setUserType] = useState(null);
  const [errors, setErrors] = useState({});
  const addressFormRef = useRef();

  const [fields, setFields] = useState({
    email: "",
    password: "",
    confirmationPassword: "",
    phoneNumber: "",
    roleName: "",
    name: "",
    birthDate: "",
    rna: "",
    addressList: [{
      streetNumber: "",
      streetName: "",
      postalCode: "",
      city: "",
    }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value || "",
    }));
  };

  const handleAddressChange = (updatedAddress) => {
    setFields((prevFields) => ({
      ...prevFields,
      addressList: [updatedAddress],
    }));
  };

  const validate = async () => {
    const newErrors = {};

    const emailError = validateEmail(fields.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(fields.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validateConfirmPassword(fields.password, fields.confirmationPassword);
    if (confirmError) newErrors.confirmationPassword = confirmError;

    const phoneError = validateFrenchPhone(fields.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;

    const nameError = validateRequiredText(fields.name, "Le nom", 120);
    if (nameError) newErrors.name = nameError;

    if (userType === "volunteer") {
      const birthDateError = validateDate(fields.birthDate, "La date de naissance");
      if (birthDateError) newErrors.birthDate = birthDateError;
    }

    if (userType === "organization") {
      const rnaError = validateRNA(fields.rna);
      if (rnaError) newErrors.rna = rnaError;
    }

    // Valider l'adresse via la ref
    const isAddressValid = await addressFormRef.current?.validateAddress();
    if (!isAddressValid) {
      newErrors.address = "Adresse invalide ou non reconnue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate();
    if (isValid) {
      const registrationData = {
        ...fields,
        registrationDate: new Date().toISOString().split("T")[0],
      };
      props.register(registrationData);
    }
  };

  return (
    <Row className="d-flex justify-content-center p-3 pt-5">
      <Card className="max-width-50-rem p-0">
        <Card.Header className="text-center">Inscription</Card.Header>

        <Row className="text-center p-3">
          <Col>
            <Button
              variant={userType === "volunteer" ? "primary" : "outline-primary"}
              onClick={() => {
                setUserType("volunteer");
                setFields((prevFields) => ({ ...prevFields, roleName: "VOLUNTEER" }));
              }}
            >
              Je suis Bénévole
            </Button>
          </Col>
          <Col>
            <Button
              variant={userType === "organization" ? "primary" : "outline-primary"}
              onClick={() => {
                setUserType("organization");
                setFields((prevFields) => ({ ...prevFields, roleName: "ORGANIZATION" }));
              }}
            >
              Je suis une Association
            </Button>
          </Col>
        </Row>

        {userType && (
          <Form onSubmit={handleSubmit} className="p-3">
            <FormGroupRow label="Email" name="email" type="email" icon="fa-at" value={fields.email} onChange={handleChange} error={errors.email} placeholder="ex : exemple@mail.com" />

            <FormGroupRow label="Mot de passe" name="password" type="password" icon="fa-key" value={fields.password} onChange={handleChange} error={errors.password} placeholder="Votre mot de passe" />

            <FormGroupRow label="Confirmez votre mot de passe" name="confirmationPassword" type="password" icon="fa-key" value={fields.confirmationPassword} onChange={handleChange} error={errors.confirmationPassword} placeholder="Confirmez votre mot de passe" />

            <FormGroupRow label="Numéro de téléphone" name="phoneNumber" type="tel" icon="fa-phone" value={fields.phoneNumber} onChange={handleChange} error={errors.phoneNumber} placeholder="ex : 0600000000" />

            <FormGroupRow label="Nom" name="name" type="text" icon="fa-user" value={fields.name} onChange={handleChange} error={errors.name} placeholder="ex : Marie DUPONT" />

            {userType === "volunteer" && (
              <FormGroupRow label="Date de naissance" name="birthDate" type="date" icon="fa-cake-candles" value={fields.birthDate} onChange={handleChange} error={errors.birthDate} />
            )}

            {userType === "organization" && (
              <FormGroupRow label="RNA" name="rna" type="text" icon="fa-book" value={fields.rna} onChange={handleChange} error={errors.rna} placeholder="ex : W123456789" />
            )}

            {/* Adresse complète via AddressForm */}
            <div className="mt-3 mb-2">
              <label className="form-label fw-bold">Adresse</label>
              <AddressForm
                ref={addressFormRef}
                address={fields.addressList[0]}
                onChange={handleAddressChange}
              />
              {errors.address && <div className="text-danger mt-1">{errors.address}</div>}
            </div>

            <Row className="pb-3 pt-3">
              <Col className="text-center">
                <Button className="w-100" type="submit" variant="primary">
                  Inscription
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </Row>
  );
}
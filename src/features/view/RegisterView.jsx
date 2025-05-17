import React, { useEffect, useState } from "react";
import { Row, Col, Card, InputGroup, Form, Nav, Button } from "react-bootstrap";
import FormGroupRow from "@components/FormGroupRow";
import { Link } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFrenchPhone,
  validateRequiredText,
  validateDate,
  validateRNA,
  validateAddress
} from "@utils/validationUtils";
import { verifyAddressExists } from "@utils/verifyAdressExist";

export default function RegisterView(props) {
  const [userType, setUserType] = useState(null);
  const [errors, setErrors] = useState({});
  const [citySuggestions, setCitySuggestions] = useState([]);

  const [fields, setFields] = useState({
    email: "",
    password: "",
    confirmationPassword: "",
    phoneNumber: "",
    roleName: "",
    name: "",
    birthDate: "",
    rna: "",
    adressList: [{
      streetNumber: "",
      streetName: "",
      postalCode: "",
      city: "",
    }],
  });

  useEffect(() => {
    const postalCode = fields.adressList[0].postalCode;
    if (postalCode.length === 5) {
      fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom&format=json`)
        .then((res) => res.json())
        .then((data) => {
          const cities = data.map((city) => city.nom);
          setCitySuggestions(cities);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des villes :", error);
          setCitySuggestions([]);
        });
    } else {
      setCitySuggestions([]);
    }
  }, [fields.adressList[0].postalCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("adressList.")) {
      const addressField = name.split(".")[1];
      return setFields((prevFields) => {
        const updatedadressList = [...prevFields.adressList];
        updatedadressList[0] = {
          ...updatedadressList[0],
          [addressField]: value || "",
        };
        return {
          ...prevFields,
          adressList: updatedadressList,
        };
      });
    }
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value || "",
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

    const addressErrors = verifyAddressExists(fields.adressList[0]);
    for (const [key, value] of Object.entries(addressErrors)) {
      newErrors[`adressList.${key}`] = value;
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
            {/* Email */}
            <FormGroupRow label="Email" name="email" type="email" icon="fa-user" value={fields.email} onChange={handleChange} error={errors.email} placeholder="ex : exemple@mail.com" />

            {/* Password */}
            <FormGroupRow label="Mot de passe" name="password" type="password" icon="fa-key" value={fields.password} onChange={handleChange} error={errors.password} placeholder="Votre mot de passe" />

            {/* Confirm Password */}
            <FormGroupRow label="Confirmez votre mot de passe" name="confirmationPassword" type="password" icon="fa-key" value={fields.confirmationPassword} onChange={handleChange} error={errors.confirmationPassword} placeholder="Confirmez votre mot de passe" />

            {/* Phone Number */}
            <FormGroupRow label="Numéro de téléphone" name="phoneNumber" type="tel" icon="fa-phone" value={fields.phoneNumber} onChange={handleChange} error={errors.phoneNumber} placeholder="ex : 0600000000" />

            {/* Name */}
            <FormGroupRow label="Nom" name="name" type="text" value={fields.name} onChange={handleChange} error={errors.name} placeholder="ex : Marie DUPONT" />

            {/* Birth Date (volunteer only) */}
            {userType === "volunteer" && (
              <FormGroupRow label="Date de naissance" name="birthDate" type="date" value={fields.birthDate} onChange={handleChange} error={errors.birthDate} />
            )}

            {/* RNA (organization only) */}
            {userType === "organization" && (
              <FormGroupRow label="RNA" name="rna" type="text" value={fields.rna} onChange={handleChange} error={errors.rna} placeholder="ex : W123456789" />
            )}

            {/* Address Fields */}
            <FormGroupRow label="Numéro de rue" name="adressList.streetNumber" type="text" value={fields.adressList[0].streetNumber} onChange={handleChange} error={errors["adressList.streetNumber"]} placeholder="ex : 12B" />
            <FormGroupRow label="Nom de la rue" name="adressList.streetName" type="text" value={fields.adressList[0].streetName} onChange={handleChange} error={errors["adressList.streetName"]} placeholder="ex : Place de la Victoire" />
            <FormGroupRow label="Code Postal" name="adressList.postalCode" type="number" value={fields.adressList[0].postalCode} onChange={handleChange} error={errors["adressList.postalCode"]} placeholder="ex : 75000" />

            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Ville</output></Col>
              <Col sm={7}>
                {errors["adressList.city"] && <Form.Text className="text-danger">{errors["adressList.city"]}</Form.Text>}
                <InputGroup className="mb-3">
                  <Form.Select
                    name="adressList.city"
                    value={fields.adressList[0].city}
                    onChange={handleChange}
                    isInvalid={!!errors["adressList.city"]}
                  >
                    <option value="">Choisissez une ville</option>
                    {citySuggestions.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </Form.Select>
                  {errors["adressList.city"] && (
                    <Form.Control.Feedback type="invalid">
                      {errors["adressList.city"]}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Col>
            </Row>

            <Row className="pb-3 ps-3 pe-3">
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
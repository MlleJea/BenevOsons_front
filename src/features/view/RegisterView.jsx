import React, { useContext, useState } from "react";
import { Row, Col, Card, InputGroup, Form, Nav, Button } from "react-bootstrap";
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

export default function RegisterView(props) {
  const [userType, setUserType] = useState(null);
  const [errors, setErrors] = useState({});

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
    },]
  });

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

  const validate = () => {
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
    
    const addressErrors = validateAddress(fields.adressList[0]);
    for (const [key, value] of Object.entries(addressErrors)) {
      newErrors[`adressList.${key}`] = value;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const registrationData = {
        ...fields,
        registrationDate: new Date().toISOString().split('T')[0]
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
            <Button variant={userType === "volunteer" ? "primary" : "outline-primary"} onClick={() => {setUserType("volunteer"); setFields(prevFields => ({ ...prevFields, roleName: "VOLUNTEER" }))}}>
              Je suis Bénévole
            </Button>
          </Col>
          <Col>
            <Button variant={userType === "organization" ? "primary" : "outline-primary"} onClick={() => {setUserType("organization"); setFields(prevFields => ({ ...prevFields, roleName: "ORGANIZATION" })) }}>
              Je suis une Association
            </Button>
          </Col>
        </Row>

        {/* Form appears if a userType is not null*/}
        {userType && (
          <>
            <Row className="pt-4 ps-3 pe-3">
              <Col sm={3}><output>Email</output></Col>
              <Col sm={7}>
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                <InputGroup className="mb-3">
                  <InputGroup.Text><i className="fa fa-user"></i></InputGroup.Text>
                  <Form.Control type="email" name="email" placeholder="ex : exemple@mail.com " value={fields.email} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>
            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Mot de passe</output></Col>
              <Col sm={7}>
              {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                <InputGroup className="mb-3">
                  <InputGroup.Text><i className="fa fa-key"></i></InputGroup.Text>
                  <Form.Control required type="password" name="password" placeholder="Votre mot de passe" value={fields.password} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>
            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Confirmez votre mot de passe</output></Col>
              <Col sm={7}>
              {errors.confirmationPassword && <Form.Text className="text-danger">{errors.confirmationPassword}</Form.Text>}
                <InputGroup className="mb-3">
                  <InputGroup.Text><i className="fa fa-key"></i></InputGroup.Text>
                  <Form.Control type="password" name="confirmationPassword" placeholder="Votre mot de passe" value={fields.confirmationPassword} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>

            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Numéro de téléphone</output></Col>
              <Col sm={7}>
              {errors.phoneNumber && <Form.Text className="text-danger">{errors.phoneNumber}</Form.Text>}
                <InputGroup className="mb-3">
                  <InputGroup.Text><i className="fa fa-phone"></i></InputGroup.Text>
                  <Form.Control type="tel" name="phoneNumber" placeholder="ex : 0600000000" value={fields.phoneNumber} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>

            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Nom</output></Col>
              <Col sm={7}>
              {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                <InputGroup className="mb-3">
                  <Form.Control type="text" name="name" placeholder="ex : Marie DUPONT" value={fields.name} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>

            {/* Volonteer fields */}
            {userType === "volunteer" && (
              <>
                <Row className="ps-3 pe-3">
                  <Col sm={3}><output>Date de naissance</output></Col>
                  <Col sm={7}>
                  {errors.birthDate && <Form.Text className="text-danger">{errors.birthDate}</Form.Text>}
                    <InputGroup className="mb-3">
                      <Form.Control type="date" name="birthDate" value={fields.birthDate} onChange={handleChange} />
                    </InputGroup>
                  </Col>
                </Row>
              </>
            )}

            {/* Organization fields */}
            {userType === "organization" && (
              <>
                <Row className="ps-3 pe-3">
                  <Col sm={3}><output>RNA</output></Col>
                  <Col sm={7}>
                  {errors.rna && <Form.Text className="text-danger">{errors.rna}</Form.Text>}
                    <InputGroup className="mb-3">
                      <Form.Control type="text" name="rna" placeholder="ex : W123456789" value={fields.rna} onChange={handleChange} />
                    </InputGroup>
                  </Col>
                </Row>
              </>
            )}

            {/* Address for both volonteer and organization */}
            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Numéro de rue</output></Col>
              <Col sm={7}>
              {errors["adressList.streetNumber"] && <Form.Text className="text-danger">{errors["adressList.streetNumber"]}</Form.Text>}
                <InputGroup className="mb-3">
                  <Form.Control type="text" name="adressList.streetNumber" placeholder="ex : 12B" value={fields.adressList[0].streetNumber} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>

            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Nom de la rue</output></Col>
              <Col sm={7}>
              {errors["adressList.streetName"] && <Form.Text className="text-danger">{errors["adressList.streetName"]}</Form.Text>}
                <InputGroup className="mb-3">
                  <Form.Control type="text" name="adressList.streetName" placeholder="ex : Place de la victoire" value={fields.adressList[0].streetName} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>

            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Code Postal</output></Col>
              <Col sm={7}>
              {errors["adressList.postalCode"] && <Form.Text className="text-danger">{errors["adressList.postalCode"]}</Form.Text>}
                <InputGroup className="mb-3">
                  <Form.Control type="text" name="adressList.postalCode" placeholder="ex : 75000" value={fields.adressList[0].postalCode} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>

            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Ville</output></Col>
              <Col sm={7}>
              {errors["adressList.city"] && <Form.Text className="text-danger">{errors["adressList.city"]}</Form.Text>}
                <InputGroup className="mb-3">
                  <Form.Control type="text" name="adressList.city" placeholder="ex : Paris" value={fields.adressList[0].city} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>

            {/* Validation */}
            <Row className="pb-3 ps-3 pe-3">
              <Col className="text-center">
                <Nav.Link
                  className="btn w-100 text-white"
                  onClick={handleSubmit}
                >
                  Inscription
                </Nav.Link>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </Row>
  );
}
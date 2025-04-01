import React, { useContext, useState } from "react";
import { Row,Col,Card,InputGroup,Form,Nav,Button } from "react-bootstrap";
import { Link } from "react-router-dom";


export default function RegisterView() {
  const [userType, setUserType] = useState(null); 
  const [fields, setFields] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    roleName: "",
    name: "",
    firstName: "",
    birthDate: "",
    adress: {
      streetNumber: "",
      streetName: "",
      streetType: "",
      postalCode: "",
      city: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("adress.")) {
      const addressField = name.split(".")[1];
      setFields({ ...fields, adress: { ...fields.adress, [addressField]: value } });
    } else {
      setFields({ ...fields, [name]: value });
    }
  };

  return (
    <Row className="d-flex justify-content-center p-3 pt-5">
      <Card className="max-width-50-rem p-0">
        <Card.Header className="text-center">Inscription</Card.Header>

        {/* Button setting the UserType*/}
        <Row className="text-center p-3">
          <Col>
            <Button variant={userType === "volunteer" ? "primary" : "outline-primary"} onClick={() => setUserType("volunteer")}>
              Je suis Bénévole
            </Button>
          </Col>
          <Col>
            <Button variant={userType === "organization" ? "primary" : "outline-primary"} onClick={() => setUserType("organization")}>
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
                <InputGroup className="mb-3">
                  <InputGroup.Text><i className="fa fa-user"></i></InputGroup.Text>
                  <Form.Control type="text" name="email" placeholder="Votre email" value={fields.email} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>
            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Mot de passe</output></Col>
              <Col sm={7}>
                <InputGroup className="mb-3">
                  <InputGroup.Text><i className="fa fa-key"></i></InputGroup.Text>
                  <Form.Control type="password" name="password" placeholder="Votre mot de passe" value={fields.password} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>
            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Numéro de téléphone</output></Col>
              <Col sm={7}>
              <InputGroup className="mb-3">
              <InputGroup.Text><i className="fa fa-phone"></i></InputGroup.Text>
                <Form.Control type="text" name="phoneNumber" placeholder="Numéro de téléphone" value={fields.phoneNumber} onChange={handleChange} />
                </InputGroup>
              </Col>
            </Row>

            <Row className="ps-3 pe-3">
                  <Col sm={3}><output>Nom</output></Col>
                  <Col sm={7}>
                  <InputGroup className="mb-3">
                    <Form.Control type="text" name="name" placeholder="Nom" value={fields.name} onChange={handleChange} />
                    </InputGroup>
                  </Col>
                </Row>

            {/* Volonteer fields */}
            {userType === "volunteer" && (
              <>

                <Row className="ps-3 pe-3">
                  <Col sm={3}><output>Prénom</output></Col>
                  <Col sm={7}>
                  <InputGroup className="mb-3">
                    <Form.Control type="text" name="firstName" placeholder="Prénom" value={fields.firstName} onChange={handleChange} />
                    </InputGroup>
                  </Col>
                </Row>

                <Row className="ps-3 pe-3">
                  <Col sm={3}><output>Date de naissance</output></Col>
                  <Col sm={7}>
                  <InputGroup className="mb-3">
                    <Form.Control type="date" name="birthDate" value={fields.birthDate} onChange={handleChange} />
                  </InputGroup>
                  </Col>
                </Row>
              </>
            )}

            {/* Address for both volonteer and organization */}
            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Numéro de rue</output></Col>
              <Col sm={7}>
              <InputGroup className="mb-3">
                <Form.Control type="text" name="adress.streetNumber" placeholder="N°" value={fields.adress.streetNumber} onChange={handleChange} />
              </InputGroup>
              </Col>
            </Row>

            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Type de voie</output></Col>
              <Col sm={7}>
              <InputGroup className="mb-3">
                <Form.Control type="text" name="adress.streetType" placeholder="Ex: Avenue, Boulevard" value={fields.adress.streetType} onChange={handleChange} />
              </InputGroup>
              </Col>
            </Row>
            
            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Nom de la rue</output></Col>
              <Col sm={7}>
              <InputGroup className="mb-3">
                <Form.Control type="text" name="adress.streetName" placeholder="Nom de la rue" value={fields.adress.streetName} onChange={handleChange} />
              </InputGroup>
              </Col>
            </Row>


            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Code Postal</output></Col>
              <Col sm={7}>
              <InputGroup className="mb-3">
                <Form.Control type="text" name="adress.postalCode" placeholder="Code postal" value={fields.adress.postalCode} onChange={handleChange} />
              </InputGroup>
              </Col>
            </Row>

            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Ville</output></Col>
              <Col sm={7}>
              <InputGroup className="mb-3">
                <Form.Control type="text" name="adress.city" placeholder="Ville" value={fields.adress.city} onChange={handleChange} />
              </InputGroup>
              </Col>
            </Row>

            {/* Validation */}
            <Row className="pb-3 ps-3 pe-3">
              <Col className="text-center">
                <Button variant="success" onClick={() => console.log(fields)}>
                  S'inscrire
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </Row>
  );
}

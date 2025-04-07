import React, { useContext, useState } from "react";
import { Row,Col,Card,InputGroup,Form,Nav,Button } from "react-bootstrap";
import { Link } from "react-router-dom";


export default function RegisterView(props) {
  const [userType,setUserType] = useState(null);

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
  

  return (
    <Row className="d-flex justify-content-center p-3 pt-5">
      <Card className="max-width-50-rem p-0">
        <Card.Header className="text-center">Inscription</Card.Header>

        {/* Button setting the UserType*/}
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
              <Col sm={3}><output>Confirmez votre mot de passe</output></Col>
              <Col sm={7}>
                <InputGroup className="mb-3">
                  <InputGroup.Text><i className="fa fa-key"></i></InputGroup.Text>
                  <Form.Control type="password" name="confirmationPassword" placeholder="Votre mot de passe" value={fields.confirmationPassword} onChange={handleChange} />
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
                  <Col sm={3}><output>Date de naissance</output></Col>
                  <Col sm={7}>
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
                  <InputGroup className="mb-3">
                    <Form.Control type="text" name="rna" placeholder="N°" value={fields.rna} onChange={handleChange} />
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
                <Form.Control type="text" name="adressList.streetNumber" placeholder="N°" value={fields.adressList[0].streetNumber} onChange={handleChange} />
              </InputGroup>
              </Col>
            </Row>
            
            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Nom de la rue</output></Col>
              <Col sm={7}>
              <InputGroup className="mb-3">
                <Form.Control type="text" name="adressList.streetName" placeholder="Nom de la rue" value={fields.adressList[0].streetName} onChange={handleChange} />
              </InputGroup>
              </Col>
            </Row>


            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Code Postal</output></Col>
              <Col sm={7}>
              <InputGroup className="mb-3">
                <Form.Control type="text" name="adressList.postalCode" placeholder="Code postal" value={fields.adressList[0].postalCode} onChange={handleChange} />
              </InputGroup>
              </Col>
            </Row>

            <Row className="ps-3 pe-3">
              <Col sm={3}><output>Ville</output></Col>
              <Col sm={7}>
              <InputGroup className="mb-3">
                <Form.Control type="text" name="adressList.city" placeholder="Ville" value={fields.adressList[0].city} onChange={handleChange} />
              </InputGroup>
              </Col>
            </Row>

            {/* Validation */}
            <Row className="pb-3 ps-3 pe-3">
              <Col className="text-center">
                <Nav.Link
                     className="btn bg-black w-100 text-white"
                    as={Link} to="/welcome"
                    onClick={() => props.register(fields)}
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

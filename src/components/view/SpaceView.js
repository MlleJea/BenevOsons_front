import React, { useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";

export default function SpaceView({ user, updateUser }) {
    const userType = user.role;

    const firstAddress = user.userAdressList?.[0] || {};

    const [editableFields, setEditableFields] = useState({
        phoneNumber: user.phoneNumber || "",
        password: "",
        passwordConfirmation : "",
        userAdressList: {
            streetNumber: firstAddress.streetNumber || "",
            streetName: firstAddress.streetName || "",
            postalCode: firstAddress.postalCode || "",
            city: firstAddress.city || "",
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("adress.")) {
            const field = name.split(".")[1];
            setEditableFields((prev) => ({
                ...prev,
                userAdressList: {
                    ...prev.userAdressList,
                    [field]: value,
                },
            }));
        } else {
            setEditableFields((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        updateUser(editableFields);
    };

    return (
        <Row className="justify-content-center p-4">
            <Card className="p-4 w-50">
                <Card.Header className="text-center">Mes informations</Card.Header>
                <Card.Body>
                    <Row className="mb-3"><Col><strong>Email:</strong> {user.email}</Col></Row>
                    <Row className="mb-3"><Col><strong>Nom:</strong> {user.name}</Col></Row>

                    {userType === "volunteer" && (
                        <Row className="mb-3"><Col><strong>Date de naissance:</strong> {user.birthDate}</Col></Row>
                    )}
                    {userType === "organization" && (
                        <Row className="mb-3"><Col><strong>RNA:</strong> {user.rna}</Col></Row>
                    )}

                    <Row className="mb-3"><Col><strong>Inscription le:</strong> {user.registrationDate}</Col></Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Numéro de téléphone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={editableFields.phoneNumber}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col><Form.Label>Adresse</Form.Label></Col>
                    </Row>
                    {["streetNumber", "streetName", "postalCode", "city"].map((field, i) => (
                        <Row className="mb-3" key={i}>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name={`adress.${field}`}
                                    placeholder={field}
                                    value={editableFields.userAdressList[field]}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                    ))}

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Nouveau mot de passe"
                                value={editableFields.password}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                    <Col>
                            <Form.Label>Confirmez le mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="passwordConfirmation"
                                placeholder="Confirmez le nouveau mot de passe"
                                value={editableFields.passwordConfirmation}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col className="text-center">
                            <Button variant="success" onClick={handleSubmit}>Enregistrer</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            
            {userType === "volunteer" && (
                <Card>
                    <Card.Header className="text-center">Mes informations</Card.Header>
                    <Card.Body>
                        <></>
                        <Button onClick={addSkill}>Ajouter une compétence</Button>
                    </Card.Body>
                </Card>
            )}
            

        </Row>
    );
}

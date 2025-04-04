import React, { useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";

export default function SpaceView({ user, updateUser }) {
    const [editableFields, setEditableFields] = useState({
        phoneNumber: user.phoneNumber,
        password: "",
        adress: { ...user.adress },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("adress.")) {
            const addressField = name.split(".")[1];
            setEditableFields({
                ...editableFields,
                adress: { ...editableFields.adress, [addressField]: value },
            });
        } else {
            setEditableFields({ ...editableFields, [name]: value });
        }
    };

    const handleSubmit = () => {
        updateUser(editableFields);
    };

    return (
        <Row className="justify-content-center p-4">
            <Card className="p-4 w-50">
                <Card.Header className="text-center">Mon espace</Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col><strong>Email:</strong> {user.email}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Nom:</strong> {user.name}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Prénom:</strong> {user.firstName}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Date de naissance:</strong> {user.birthDate}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Inscription le:</strong> {user.registrationDate}</Col>
                    </Row>

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
                        <Col>
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="adress.streetNumber" 
                                placeholder="N°"
                                value={editableFields.adress.streetNumber} 
                                onChange={handleChange} 
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control 
                                type="text" 
                                name="adress.streetType" 
                                placeholder="Type de voie"
                                value={editableFields.adress.streetType} 
                                onChange={handleChange} 
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control 
                                type="text" 
                                name="adress.streetName" 
                                placeholder="Nom de la rue"
                                value={editableFields.adress.streetName} 
                                onChange={handleChange} 
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control 
                                type="text" 
                                name="adress.postalCode" 
                                placeholder="Code postal"
                                value={editableFields.adress.postalCode} 
                                onChange={handleChange} 
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control 
                                type="text" 
                                name="adress.city" 
                                placeholder="Ville"
                                value={editableFields.adress.city} 
                                onChange={handleChange} 
                            />
                        </Col>
                    </Row>

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

                    <Row className="mt-3">
                        <Col className="text-center">
                            <Button variant="success" onClick={handleSubmit}>Enregistrer</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Row>
    );
}

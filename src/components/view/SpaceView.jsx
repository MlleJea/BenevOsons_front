import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";

import { 
    validatePassword, 
    validateConfirmPassword, 
    validateFrenchPhone,
    validateRequiredText, 
    validateAddress
  } from "../../utils/validationUtils";

export default function SpaceView({ user, role, updateUser, addSkill, skillTypes = [], grades = [], id, skills = [] }) {
    if (!user) {
        return <div>Chargement des données utilisateur...</div>;
    }

      const [errors, setErrors] = useState({});
    

    const firstAddress = user.userAdressList?.[0] || {};

    const [profilFields, setProfilFields] = useState({
        phoneNumber: user.phoneNumber || "",
        password: "",
        passwordConfirmation: "",
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
            setProfilFields((prev) => ({
                ...prev,
                userAdressList: {
                    ...prev.userAdressList,
                    [field]: value,
                },
            }));
        } else {
            setProfilFields((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleProfileSubmit = () => {
        if (profilFields.password && profilFields.password !== profilFields.passwordConfirmation) {
        
            return;
        }

        const dataToUpdate = {
            phoneNumber: profilFields.phoneNumber,
            userAdressList: [profilFields.userAdressList],
        };

        if (profilFields.password) {
            dataToUpdate.password = profilFields.password;
        }

        updateUser(dataToUpdate);
    };

    // Skills
    const [newSkill, setNewSkill] = useState({
        labelSkill: "",
        grade: "",
        skillTypeLabel: "",
        volunteerId: id,
    });

    const [displayedSkills, setDisplayedSkills] = useState(skills || []);

    useEffect(() => {
        setDisplayedSkills(skills || []);
    }, [skills]);

    const handleSkillChange = (e) => {
        const { name, value } = e.target;
        setNewSkill(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleAddSkill = () => {
        if (!newSkill.skillTypeLabel || !newSkill.labelSkill || !newSkill.grade) {
            return;
        }
        setDisplayedSkills(prevSkills => [...prevSkills, newSkill]);

        addSkill(newSkill);


        setNewSkill({
            labelSkill: "",
            grade: "",
            skillTypeLabel: "",
            volunteerId: user.id
        });
    };

    return (
        <>
            <Row className="justify-content-center p-4">
                <Card className="p-4 w-50 mb-4">
                    <Card.Header className="text-center">Mes informations</Card.Header>
                    <Card.Body>
                        <Row className="mb-3"><Col><strong>Email:</strong> {user.email}</Col></Row>
                        <Row className="mb-3"><Col><strong>Nom:</strong> {user.name}</Col></Row>

                        {role === "VOLUNTEER" && (
                            <Row className="mb-3"><Col><strong>Date de naissance:</strong> {user.birthDate}</Col></Row>
                        )}
                        {role === "ORGANIZATION" && (
                            <Row className="mb-3"><Col><strong>RNA:</strong> {user.rna}</Col></Row>
                        )}

                        <Row className="mb-3"><Col><strong>Inscription le:</strong> {user.registrationDate}</Col></Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Numéro de téléphone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={profilFields.phoneNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Adresse</Form.Label>
                            {["streetNumber", "streetName", "postalCode", "city"].map((field, i) => (
                                <Form.Control
                                    key={i}
                                    type="text"
                                    name={`adress.${field}`}
                                    placeholder={field}
                                    value={profilFields.userAdressList[field]}
                                    onChange={handleChange}
                                    className="mb-2"
                                />
                            ))}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Nouveau mot de passe"
                                value={profilFields.password}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmez le mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="passwordConfirmation"
                                placeholder="Confirmez le nouveau mot de passe"
                                value={profilFields.passwordConfirmation}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button variant="success" onClick={handleProfileSubmit}>Enregistrer</Button>
                        </div>
                    </Card.Body>
                </Card>

                {role === "VOLUNTEER" && (
                    <Card className="p-4 w-50">
                        <Card.Header className="text-center">Mes compétences</Card.Header>
                        <Card.Body>
                            {displayedSkills.length > 0 ? (
                                <ul className="list-group mb-3">
                                    {displayedSkills.map((skill, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{skill.skillType?.label || skill.skillTypeLabel} : </strong>
                                                <>{skill.labelSkill}</>
                                            </div>
                                            <span className="badge bg-primary rounded-pill">{skill.grade}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-muted">Aucune compétence ajoutée</p>
                            )}

                            <div>Ajouter une compétence</div>
                            <Form.Group className="mb-3">
                                <Form.Select
                                    name="skillTypeLabel"
                                    value={newSkill.skillTypeLabel}
                                    onChange={handleSkillChange}
                                >
                                    <option value="">Choisir un type</option>
                                    {skillTypes.map((skillType, index) => (
                                        <option key={index} value={skillType.label}>
                                            {skillType.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Libellé</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="labelSkill"
                                    value={newSkill.labelSkill}
                                    onChange={handleSkillChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Niveau</Form.Label>
                                <Form.Select
                                    name="grade"
                                    value={newSkill.grade}
                                    onChange={handleSkillChange}
                                >
                                    <option value="">Choisir un niveau</option>
                                    {grades.map((grade, index) => (
                                        <option key={index} value={grade}>{grade}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <div className="text-center">
                                <Button variant="primary" onClick={handleAddSkill}>Ajouter une compétence</Button>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </Row>
        </>
    );
}
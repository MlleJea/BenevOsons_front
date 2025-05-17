import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import FormGroupRow from "@components/FormGroupRow";
import {
    validatePassword,
    validateConfirmPassword,
    validateFrenchPhone,
    validateRequiredText,
    validateAddress
} from "@utils/validationUtils";

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
                        <Row className="mb-3">
                            <Col>
                                <strong>Email:</strong> {user.email}
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <strong>Nom:</strong> {user.name}
                            </Col>
                        </Row>

                        {role === "VOLUNTEER" && (
                            <Row className="mb-3">
                                <Col>
                                    <strong>Date de naissance:</strong> {user.birthdate}
                                </Col>
                            </Row>
                        )}
                        {role === "ORGANIZATION" && (
                            <Row className="mb-3">
                                <Col>
                                    <strong>RNA:</strong> {user.rna}
                                </Col>
                            </Row>
                        )}

                        <Row className="mb-3">
                            <Col>
                                <strong>Inscription le:</strong> {user.registrationDate}
                            </Col>
                        </Row>

                        {/* Téléphone */}
                        <FormGroupRow
                            label="Numéro de téléphone"
                            name="phoneNumber"
                            type="text"
                            value={profilFields.phoneNumber}
                            onChange={handleChange}
                            placeholder="06 00 00 00 00"
                            icon="fa-phone"
                            error={errors.phoneNumber}
                        />

                        {/* Adresse */}
                        <h6 className="mt-3">Adresse</h6>
                        {[
                            {
                                name: "adress.streetNumber",
                                label: "N°",
                                placeholder: "12",
                                icon: "fa-map-marker",
                            },
                            {
                                name: "adress.streetName",
                                label: "Rue",
                                placeholder: "Rue du Bac",
                                icon: "fa-road",
                            },
                            {
                                name: "adress.postalCode",
                                label: "Code postal",
                                placeholder: "75007",
                                icon: "fa-location-arrow",
                            },
                            {
                                name: "adress.city",
                                label: "Ville",
                                placeholder: "Paris",
                                icon: "fa-city",
                            },
                        ].map(({ name, label, placeholder, icon }) => (
                            <FormGroupRow
                                key={name}
                                label={label}
                                name={name}
                                type="text"
                                value={profilFields.userAdressList[name.split(".")[1]]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                icon={icon}
                                error={errors[name]}
                            />
                        ))}

                        {/* Mot de passe */}
                        <FormGroupRow
                            label="Mot de passe"
                            name="password"
                            type="password"
                            value={profilFields.password}
                            onChange={handleChange}
                            placeholder="Nouveau mot de passe"
                            icon="fa-lock"
                            error={errors.password}
                        />

                        <FormGroupRow
                            label="Confirmer le mot de passe"
                            name="passwordConfirmation"
                            type="password"
                            value={profilFields.passwordConfirmation}
                            onChange={handleChange}
                            placeholder="Confirmez le mot de passe"
                            icon="fa-lock"
                            error={errors.passwordConfirmation}
                        />

                        <div className="text-center">
                            <Button variant="success" onClick={handleProfileSubmit}>
                                Enregistrer
                            </Button>
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
                                        <li
                                            key={idx}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <div>
                                                <strong>
                                                    {skill.skillType?.label || skill.skillTypeLabel} :{" "}
                                                </strong>
                                                <>{skill.labelSkill}</>
                                            </div>
                                            <span className="badge rounded-pill">{skill.grade}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-muted">Aucune compétence ajoutée</p>
                            )}

                            <div>Ajouter une compétence</div>
                            <Form.Group className="mb-3">
                                <Form.Label>Type de compétence</Form.Label>
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

                            <FormGroupRow
                                label="Libellé"
                                name="labelSkill"
                                type="text"
                                value={newSkill.labelSkill}
                                onChange={handleSkillChange}
                            />

                            <Form.Group className="mb-3">
                                <Form.Label>Niveau</Form.Label>
                                <Form.Select
                                    name="grade"
                                    value={newSkill.grade}
                                    onChange={handleSkillChange}
                                >
                                    <option value="">Choisir un niveau</option>
                                    {grades.map((grade, index) => (
                                        <option key={index} value={grade}>
                                            {grade}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <div className="text-center">
                                <Button variant="primary" onClick={handleAddSkill}>
                                    Ajouter une compétence
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </Row>
        </>
    );
}
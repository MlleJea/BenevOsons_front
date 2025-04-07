import React, { useState } from "react";
import { Row, Col, Card, Form, Button, Toast, ToastContainer } from "react-bootstrap";

export default function SpaceView({ user, role, updateUser, skillTypes = [], grades = [] }) {
    if (!user) {
        return <div>Chargement des données utilisateur...</div>;
    }

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

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");

    const showNotification = (message, variant = "success") => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
    };

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
            showNotification("Les mots de passe ne correspondent pas", "danger");
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
        showNotification("Informations mises à jour avec succès");
    };

    // Skills
    const [newSkill, setNewSkill] = useState({
        typeSkill: "",
        skillLabel: "",
        grade: "",
    });

    const [localSkills, setLocalSkills] = useState(user.skills || []);

    const handleSkillChange = (e) => {
        const { name, value } = e.target;
        setNewSkill((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (!newSkill.typeSkill || !newSkill.skillLabel || !newSkill.grade) {
            showNotification("Tous les champs de compétence sont requis", "warning");
            return;
        }

        const updatedSkills = [...localSkills, newSkill];
        setLocalSkills(updatedSkills);
        updateUser({ skills: updatedSkills });

        setNewSkill({ typeSkill: "", skillLabel: "", grade: "" });
        showNotification("Compétence ajoutée");
    };

    return (
        <>
            <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body className={toastVariant === "danger" ? "text-white" : ""}>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

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
                            {localSkills.length > 0 ? (
                                <ul className="list-group mb-3">
                                    {localSkills.map((skill, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{skill.skillLabel}</strong>
                                            </div>
                                            <span className="badge bg-primary rounded-pill">{skill.grade}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-muted">Aucune compétence ajoutée</p>
                            )}

                            <Form.Group className="mb-3">
                            <Form.Select
                                name="typeSkill"
                                value={newSkill.typeSkill}
                                onChange={handleSkillChange}
                            >
                                <option value="">Choisir un type</option>
                                {skillTypes.map((skill, id) => (
                                    <option key={id} value={skill.idSkillType}>{skill.label}</option>
                                ))}
                            </Form.Select>

                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Libellé</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="skillLabel"
                                    value={newSkill.skillLabel}
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
                                    {grades.map((grade,id) => (
                                        <option key={id} value={grade}>{grade}</option>
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

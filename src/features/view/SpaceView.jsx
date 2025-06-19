import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import FormGroupRow from "@components/FormGroupRow";
import AddressForm from "@components/AddressForm";
import {
    validatePassword,
    validateConfirmPassword,
    validateFrenchPhone,
} from "@utils/validationUtils";

export default function SpaceView({
    user,
    role,
    updateUser,
    addSkill,
    skillTypes = [],
    grades = [],
    id,
    skills = [],
}) {
    if (!user) {
        return <div>Chargement des données utilisateur...</div>;
    }

    const [errors, setErrors] = useState({});
    const addressFormRef = useRef();

    // Valeurs initiales (pour comparaison)
    const [initialValues] = useState({
        phoneNumber: user.phoneNumber || "",
        addressList: user.userAddressList?.[0] || {
            streetNumber: "",
            streetName: "",
            postalCode: "",
            city: "",
        },
    });

    // Valeurs actuelles du formulaire
    const [profilFields, setProfilFields] = useState({
        phoneNumber: user.phoneNumber || "",
        password: "",
        passwordConfirmation: "",
        addressList: user.userAddressList?.[0] || {
            streetNumber: "",
            streetName: "",
            postalCode: "",
            city: "",
        },
    });

    const [displayedSkills, setDisplayedSkills] = useState(skills || []);

    useEffect(() => {
        setDisplayedSkills(skills || []);
    }, [skills]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfilFields((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleAddressChange = (newAddress) => {
        setProfilFields((prev) => ({
            ...prev,
            addressList: newAddress,
        }));
    };

    const handleDeleteAddress = () => {
        setProfilFields((prev) => ({
            ...prev,
            addressList: {
                streetNumber: "",
                streetName: "",
                postalCode: "",
                city: "",
            },
        }));
    };

    const handleProfileSubmit = () => {
        const newErrors = {};

        // Validation uniquement si les champs sont remplis
        if (profilFields.phoneNumber) {
            const phoneError = validateFrenchPhone(profilFields.phoneNumber);
            if (phoneError) newErrors.phoneNumber = phoneError;
        }

        if (profilFields.password) {
            const passwordError = validatePassword(profilFields.password);
            if (passwordError) newErrors.password = passwordError;

            const confirmError = validateConfirmPassword(profilFields.password, profilFields.passwordConfirmation);
            if (confirmError) newErrors.passwordConfirmation = confirmError;
        }

        if (addressFormRef.current && addressFormRef.current.validate) {
            const addressError = addressFormRef.current.validate();
            if (addressError) {
                newErrors.address = addressError;
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const dataToUpdate = {};

        // Téléphone : si différent de l'initial
        if (profilFields.phoneNumber !== initialValues.phoneNumber) {
            dataToUpdate.phoneNumber = profilFields.phoneNumber;
        }

        // Adresse : si au moins un champ d'adresse a changé
        const addressChanged =
            profilFields.addressList.streetNumber !== initialValues.addressList.streetNumber ||
            profilFields.addressList.streetName !== initialValues.addressList.streetName ||
            profilFields.addressList.postalCode !== initialValues.addressList.postalCode ||
            profilFields.addressList.city !== initialValues.addressList.city;

        if (addressChanged) {
            dataToUpdate.addressList = [profilFields.addressList];
        }

        // Mot de passe : si rempli
        if (profilFields.password.trim() !== "") {
            dataToUpdate.password = profilFields.password;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            console.log("Aucune modification détectée");
            return;
        }

        console.log("Données à envoyer :", dataToUpdate);
        updateUser(dataToUpdate);
    };

    // Skills 
    const [newSkill, setNewSkill] = useState({
        labelSkill: "",
        grade: "",
        skillTypeLabel: "",
        volunteerId: id,
    });

    const handleSkillChange = (e) => {
        const { name, value } = e.target;
        setNewSkill((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddSkill = () => {
        if (!newSkill.skillTypeLabel || !newSkill.labelSkill || !newSkill.grade) return;

        setDisplayedSkills((prevSkills) => [...prevSkills, newSkill]);
        addSkill(newSkill);

        setNewSkill({
            labelSkill: "",
            grade: "",
            skillTypeLabel: "",
            volunteerId: user.id,
        });
    };

    return (
        <Row className="justify-content-center p-4">
            <Card className="p-4 w-50 mb-4">
                <Card.Header className="text-center">Mes informations</Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col className="profile-info-label">
                            <i className="fa fa-envelope" /> Email: {user.email}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col className="profile-info-label">
                            <i className="fa fa-user" /> Nom: {user.name}
                        </Col>
                    </Row>
                    {role === "VOLUNTEER" && (
                        <Row className="mb-3">
                            <Col className="profile-info-label">
                                <i className="fa fa-birthday-cake" /> Date de naissance: {user.birthdate}
                            </Col>
                        </Row>
                    )}
                    {role === "ORGANIZATION" && (
                        <Row className="mb-3">
                            <Col className="profile-info-label">
                                <i className="fa fa-id-card" /> RNA: {user.rna}
                            </Col>
                        </Row>
                    )}
                    <Row className="mb-3">
                        <Col className="profile-info-label">
                            <i className="fa fa-calendar" /> Inscription le: {user.registrationDate}
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
                    <h6 className="mt-4 mb-2 profile-info-label">
                        <i className="fa fa-home" /> Adresse
                    </h6>
                    <div className="address-form-container">
                        <AddressForm
                            ref={addressFormRef}
                            address={profilFields.addressList}
                            onChange={handleAddressChange}
                            onDelete={handleDeleteAddress}
                            isEditable={false}
                            showActions={true}
                        />
                    </div>

                    {/* Mot de passe */}
                    <div className="mt-3">
                        <FormGroupRow
                            label="Nouveau mot de passe (optionnel)"
                            name="password"
                            type="password"
                            value={profilFields.password}
                            onChange={handleChange}
                            placeholder=""
                            icon="fa-lock"
                            error={errors.password}
                        />

                        {profilFields.password && (
                            <FormGroupRow
                                label="Confirmer le mot de passe"
                                name="passwordConfirmation"
                                type="password"
                                value={profilFields.passwordConfirmation}
                                onChange={handleChange}
                                placeholder="Confirmez le nouveau mot de passe"
                                icon="fa-lock"
                                error={errors.passwordConfirmation}
                            />
                        )}
                    </div>

                    <div className="text-center">
                        <Button variant="success" onClick={handleProfileSubmit}>
                            Enregistrer les modifications
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
                                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>
                                                {skill.skillType?.label || skill.skillTypeLabel} :{" "}
                                            </strong>
                                            {skill.labelSkill}
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
    );
}
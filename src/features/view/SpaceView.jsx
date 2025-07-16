import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import FormGroupRow from "@components/FormGroupRow";
import PasswordStrengthIndicator from "@components/PasswordStrengthIndicator";
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
  deleteSkill,
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

  const handleProfileSubmit = async () => {
    const newErrors = {};

    // Validation uniquement si les champs sont remplis
    if (profilFields.phoneNumber) {
      const phoneError = validateFrenchPhone(profilFields.phoneNumber);
      if (phoneError) newErrors.phoneNumber = phoneError;
    }

    // Validation du mot de passe et confirmation
    if (profilFields.password || profilFields.passwordConfirmation) {
      // Vérifie que les deux sont remplis
      if (!profilFields.password) {
        newErrors.password = "Le mot de passe est requis.";
      } else {
        const passwordError = validatePassword(profilFields.password);
        if (passwordError) newErrors.password = passwordError;
      }
      if (!profilFields.passwordConfirmation) {
        newErrors.passwordConfirmation = "La confirmation est requise.";
      } else {
        const confirmError = validateConfirmPassword(
          profilFields.password,
          profilFields.passwordConfirmation
        );
        if (confirmError) newErrors.passwordConfirmation = confirmError;
      }
    }

    //  Validation d'adresse si l'adresse a été modifiée
    const addressChanged =
      profilFields.addressList.streetNumber !==
      initialValues.addressList.streetNumber ||
      profilFields.addressList.streetName !==
      initialValues.addressList.streetName ||
      profilFields.addressList.postalCode !==
      initialValues.addressList.postalCode ||
      profilFields.addressList.city !== initialValues.addressList.city;

    if (
      addressChanged &&
      addressFormRef.current &&
      addressFormRef.current.validateAddress
    ) {
      const isAddressValid = await addressFormRef.current.validateAddress();
      if (!isAddressValid) {
        newErrors.address = "Veuillez vérifier l'adresse saisie";
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
    if (!newSkill.skillTypeLabel || !newSkill.labelSkill || !newSkill.grade)
      return;

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
      <div className="container-fluid p-4">
        {/* === SECTION PROFIL === */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={10} xl={8}>
            <Card className="shadow-sm">
              <Card.Header className="title text-center">
                Mes informations
              </Card.Header>
              <Card.Body className="p-4">
                {/* Informations non modifiables */}
                <Row className="mb-4">
                  <Col xs={12} md={6}>
                    <div className="profile-info-label">
                      <i className="fa fa-envelope me-2"></i>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div className="profile-info-label">
                      <i className="fa fa-user me-2"></i>
                      <strong>Nom:</strong> {user.name}
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    {role === "VOLUNTEER" && (
                      <div className="profile-info-label">
                        <i className="fa fa-birthday-cake me-2"></i>
                        <strong>Date de naissance:</strong> {user.birthdate}
                      </div>
                    )}
                    {role === "ORGANIZATION" && (
                      <div className="profile-info-label">
                        <i className="fa fa-id-card me-2"></i>
                        <strong>RNA:</strong> {user.rna}
                      </div>
                    )}
                    <div className="profile-info-label">
                      <i className="fa fa-calendar me-2"></i>
                      <strong>Inscription le:</strong> {user.registrationDate}
                    </div>
                  </Col>
                </Row>

                <hr className="my-4" />

                {/* Champs modifiables */}
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
                <div className="mt-4">
                  <h6 className="profile-info-label">
                    <i className="fa fa-home me-2"></i>
                    Adresse
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
                </div>

                {/* Mot de passe */}
                <Row className="ps-3 pe-3 mb-3">
                  <Col sm={3}>
                    <output>Nouveau mot de passe (optionnel)</output>
                  </Col>
                  <Col sm={7}>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fa fa-lock"></i>
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={profilFields.password}
                        onChange={handleChange}
                        placeholder="Saisissez un nouveau mot de passe"
                        isInvalid={!!errors.password}
                      />
                    </div>
                    {errors.password && (
                      <div className="text-danger mt-1">{errors.password}</div>
                    )}
                    <PasswordStrengthIndicator password={profilFields.password} />
                  </Col>
                </Row>

                {profilFields.password && (
                  <Row className="ps-3 pe-3 mb-3">
                    <Col sm={3}>
                      <output>Confirmer le mot de passe</output>
                    </Col>
                    <Col sm={7}>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa fa-lock"></i>
                        </span>
                        <Form.Control
                          type="password"
                          name="passwordConfirmation"
                          value={profilFields.passwordConfirmation}
                          onChange={handleChange}
                          placeholder="Confirmez le nouveau mot de passe"
                          isInvalid={!!errors.passwordConfirmation}
                        />
                      </div>
                      {errors.passwordConfirmation && (
                        <div className="text-danger mt-1">
                          {errors.passwordConfirmation}
                        </div>
                      )}
                    </Col>
                  </Row>
                )}

                <div className="text-center mt-4">
                  <Button size="lg" onClick={handleProfileSubmit}>
                    <i className="fa fa-save me-2"></i>
                    Enregistrer les modifications0
                  </Button>
                </div>
                <a
                  href="mailto:Benevosons@gmail.com"
                  style={{ fontSize: '12px' }}
                >
                  Je souhaite supprimer mon profil ? J'envoie un mail à
                  Benevosons@gmail.com
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* === SECTION COMPÉTENCES === */}
        {role === "VOLUNTEER" && (
          <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={8}>
              <Card className="shadow-sm">
                <Card.Header className="title text-center">
                  Mes compétences
                </Card.Header>
                <Card.Body className="p-4">
                  {/* Liste des compétences existantes */}
                  {displayedSkills.length > 0 ? (
                    <div className="mb-4">
                      <h6 className="title mb-3">
                        <i className="fa fa-list me-2"></i>
                        Compétences actuelles ({displayedSkills.length})
                      </h6>
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
                              {skill.labelSkill}
                            </div>
                            <span className="badge rounded-pill">
                              {skill.grade}
                            </span>
                            <Button onClick={() => deleteSkill(skill)}>X</Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-center text-muted">
                      Aucune compétence ajoutée pour le moment
                    </p>
                  )}

                  <hr className="my-4" />

                  {/* Formulaire d'ajout de compétence */}
                  <div>
                    <h6 className="title mb-3">
                      <i className="fa fa-plus-circle me-2"></i>
                      Ajouter une nouvelle compétence
                    </h6>

                    <Row className="g-3">
                      <Col xs={12} md={6}>
                        <Form.Group>
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
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Niveau</Form.Label>
                          <Form.Select
                            name="grade"
                            value={newSkill.grade}
                            onChange={handleSkillChange}
                          >
                            <option value="">Choisir un niveau</option>
                            {grades.map((grade, index) => (
                              <option key={index} value={grade}>
                                Niveau {grade}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <FormGroupRow
                          label="Libellé de la compétence"
                          name="labelSkill"
                          type="text"
                          value={newSkill.labelSkill}
                          onChange={handleSkillChange}
                          placeholder="Ex: Gestion de projet, Communication..."
                          icon="fa-tag"
                        />
                      </Col>
                    </Row>

                    <div className="text-center mt-4">
                      <Button
                        onClick={handleAddSkill}
                        disabled={
                          !newSkill.skillTypeLabel ||
                          !newSkill.labelSkill ||
                          !newSkill.grade
                        }
                      >
                        <i className="fa fa-plus me-2"></i>
                        Ajouter cette compétence
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    );
  }

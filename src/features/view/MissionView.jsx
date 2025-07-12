import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  FormSelect,
  Container,
} from "react-bootstrap";
import MissionCard from "@components/MissionCard";
import AddressForm from "@components/AddressForm";
import FormGroupRow from "@components/FormGroupRow";
import {
  formatLocalDateTimeForBackend,
  updateMissionDateTime,
} from "@utils/formatDate";
import { getMissionStatus } from "../../utils/missionUtils";
import { validateMissionDates } from "../../utils/validationUtils";

export default function MissionView({
  addMission,
  missionsToDisplay,
  skillTypes,
  role,
}) {
  const [newMission, setNewMission] = useState({
    title: "",
    description: "",
    missionSkillsTypeList: [],
    numberVolunteerSearch: "",
    address: {
      streetNumber: "",
      streetName: "",
      postalCode: "",
      city: "",
    },
    period: {
      periodId: null,
      startDate: "",
      endDate: "",
    },
  });
  const addressFormRef = useRef();
  const [displayMission, setDisplayedMission] = useState(
    missionsToDisplay || []
  );
  const [filterStatus, setFilterStatus] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setDisplayedMission(missionsToDisplay || []);
  }, [missionsToDisplay]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMission((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (updatedAddress) => {
    setNewMission((prev) => ({
      ...prev,
      address: updatedAddress,
    }));
  };

  const handleDateTimeChange = (field, type, value) => {
    setNewMission((prev) => ({
      ...prev,
      period: {
        ...prev.period,
        [field]: updateMissionDateTime(prev.period[field], value, type),
      },
    }));
  };

  const handleAddMission = async () => {
    let errors = {};

    if (!newMission.title) errors.title = "Le titre est requis.";
    if (!newMission.description)
      errors.description = "La description est requise.";
    if (!newMission.numberVolunteerSearch)
      errors.numberVolunteerSearch = "Le nombre de bénévoles est requis.";
    if (!newMission.period.startDate)
      errors.startDate = "La date de début est requise.";
    if (!newMission.period.endDate)
      errors.endDate = "La date de fin est requise.";
    if (
      !newMission.missionSkillsTypeList ||
      newMission.missionSkillsTypeList.length === 0
    ) {
      errors.missionSkillsTypeList = "Au moins une compétence est requise.";
    }
    const isAddressValid = await addressFormRef.current?.validateAddress();
    if (!isAddressValid) {
      errors.address = "Adresse invalide ou non reconnue.";
    }
    if (newMission.period.startDate && newMission.period.endDate) {
      const dateErrors = validateMissionDates(
        newMission.period.startDate,
        newMission.period.endDate
      );
      errors = { ...errors, ...dateErrors };
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const missionToSend = {
      ...newMission,
      period: {
        periodId: newMission.period.periodId || null,
        startDate: formatLocalDateTimeForBackend(newMission.period.startDate),
        endDate: formatLocalDateTimeForBackend(newMission.period.endDate),
      },
    };


    console.log(missionToSend);

    
    addMission(missionToSend);

    setNewMission({
      title: "",
      description: "",
      missionSkillsTypeList: [],
      numberVolunteerSearch: "",
      address: {
        streetNumber: "",
        streetName: "",
        postalCode: "",
        city: "",
      },
      period: {
        periodId: null,
        startDate: "",
        endDate: "",
      },
    });

    setFormErrors({});
  };

  const renderError = (field) =>
    formErrors[field] && (
      <div className="text-danger" style={{ fontSize: "0.9em" }}>
        {formErrors[field]}
      </div>
    );

  const handleAddSkillType = (selectedLabel) => {
    const selectedSkill = skillTypes.find(
      (skill) => skill.label === selectedLabel
    );
    if (
      selectedSkill &&
      !newMission.missionSkillsTypeList.find((s) => s.idSkillType === selectedSkill.idSkillType)
    ) {
      setNewMission((prev) => ({
        ...prev,
        missionSkillsTypeList: [
          ...prev.missionSkillsTypeList,
          { label: selectedSkill.label, idSkillType: selectedSkill.idSkillType },
        ],
      }));

      console.log(newMission.missionSkillsTypeList);
    }
  };

  const handleRemoveSkillType = (idToRemove) => {
    setNewMission((prev) => ({
      ...prev,
      missionSkillsTypeList: prev.missionSkillsTypeList.filter(
        (skill) => skill.id !== idToRemove
      ),
    }));
  };

  const filteredMissions = displayMission.filter((mission) => {
    const status = getMissionStatus(
      mission.period.startDate,
      mission.period.endDate
    ).label;
    return !filterStatus || status === filterStatus;
  });

  return (
    <Container className="py-4">
      {/* === SECTION CREATION DE MISSION === */}
      {role === "ORGANIZATION" && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={10} xl={8}>
            <Card className="shadow-sm">
              <Card.Header className="title text-center">
                <i className="fa fa-plus-circle me-2"></i>
                Créer une nouvelle mission
              </Card.Header>
              <Card.Body className="p-4">
                {/* Informations générales */}
                <div className="form-section">
                  <h6 className="profile-info-label mb-3">
                    <i className="fa fa-info-circle me-2"></i>
                    Informations générales
                  </h6>

                  <FormGroupRow
                    label="Titre de la mission"
                    name="title"
                    type="text"
                    value={newMission.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Distribution alimentaire..."
                    icon="fa-tag"
                    error={formErrors.title}
                  />

                  <Row className="ps-3 pe-3 mb-3">
                    <Col sm={3}>
                      <output>Description</output>
                    </Col>
                    <Col sm={7}>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa fa-align-left"></i>
                        </span>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={newMission.description}
                          onChange={handleInputChange}
                          placeholder="Décrivez la mission et les tâches à accomplir..."
                          isInvalid={!!formErrors.description}
                        />
                      </div>
                      {formErrors.description && (
                        <div className="text-danger mt-1">{formErrors.description}</div>
                      )}
                    </Col>
                  </Row>

                  <FormGroupRow
                    label="Nombre de bénévoles"
                    name="numberVolunteerSearch"
                    type="number"
                    value={newMission.numberVolunteerSearch}
                    onChange={handleInputChange}
                    placeholder="Ex: 5"
                    icon="fa-users"
                    min="1"
                    max="100"
                    error={formErrors.numberVolunteerSearch}
                  />
                </div>
                <hr className="my-4" />

                {/* Compétences requises */}
                <div className="form-section">
                  <h6 className="profile-info-label mb-3">
                    <i className="fa fa-cogs me-2"></i>
                    Compétences recherchées
                  </h6>

                  {newMission.missionSkillsTypeList.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted">Compétences sélectionnées :</small>
                      <div className="mt-2">
                        {newMission.missionSkillsTypeList.map((skill, index) => (
                          <span
                            key={`${skill.id}-${index}`}
                            className="badge me-2 mb-2 p-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRemoveSkillType(skill.id)}
                            title="Cliquez pour supprimer"
                          >
                            {skill.label} <i className="fa fa-times ms-1"></i>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <Row className="ps-3 pe-3 mb-3">
                    <Col sm={3}>
                      <output>Ajouter une compétence</output>
                    </Col>
                    <Col sm={5}>
                      <Form.Select id="skillTypeSelect">
                        <option value="">Choisir un type de compétence</option>
                        {skillTypes.map((skillType) => (
                          <option key={skillType.id} value={skillType.label}>
                            {skillType.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col sm={2}>
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          const selectEl = document.getElementById("skillTypeSelect");
                          if (selectEl.value) {
                            handleAddSkillType(selectEl.value);
                            selectEl.value = "";
                          }
                        }}
                      >
                        Ajouter
                      </Button>
                    </Col>
                  </Row>
                  {formErrors.missionSkillsTypeList && (
                    <Row className="ps-3 pe-3">
                      <Col sm={{ span: 7, offset: 3 }}>
                        <div className="text-danger">{formErrors.missionSkillsTypeList}</div>
                      </Col>
                    </Row>
                  )}
                </div>

                <hr className="my-4" />


                {/* Localisation */}
                <div className="form-section">
                  <h6 className="profile-info-label mb-3">
                    <i className="fa fa-map-marker-alt me-2"></i>
                    Lieu de la mission
                  </h6>
                  <AddressForm
                    ref={addressFormRef}
                    address={newMission.address}
                    onChange={handleAddressChange}
                  />
                  {formErrors.address && (
                    <div className="text-danger mt-2">{formErrors.address}</div>
                  )}
                </div>

                <hr className="my-4" />

                {/* Période */}
                <div className="form-section">
                  <h6 className="profile-info-label mb-3">
                    <i className="fa fa-calendar me-2"></i>
                    Période de la mission
                  </h6>

                  <Row className="g-3">
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="fa fa-play me-2"></i>
                          Date et heure de début
                        </label>
                        <Form.Control
                          type="date"
                          className="mb-2"
                          onChange={(e) => handleDateTimeChange("startDate", "date", e.target.value)}
                          isInvalid={!!formErrors.startDate}
                        />
                        <Form.Control
                          type="time"
                          onChange={(e) => handleDateTimeChange("startDate", "time", e.target.value)}
                          isInvalid={!!formErrors.startDate}
                        />
                        {formErrors.startDate && (
                          <div className="text-danger mt-1">{formErrors.startDate}</div>
                        )}
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="fa fa-stop me-2"></i>
                          Date et heure de fin
                        </label>
                        <Form.Control
                          type="date"
                          className="mb-2"
                          onChange={(e) => handleDateTimeChange("endDate", "date", e.target.value)}
                          isInvalid={!!formErrors.endDate}
                        />
                        <Form.Control
                          type="time"
                          onChange={(e) => handleDateTimeChange("endDate", "time", e.target.value)}
                          isInvalid={!!formErrors.endDate}
                        />
                        {formErrors.endDate && (
                          <div className="text-danger mt-1">{formErrors.endDate}</div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="text-center mt-4">
                  <Button size="lg" onClick={handleAddMission}>
                    Créer la mission
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* === SECTION LISTE DES MISSIONS === */}
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <Card className="shadow-sm">
            <Card.Header className="title text-center">
              <i className="fa fa-list me-2"></i>
              {role === "ORGANIZATION" ? "Mes missions" : "Missions disponibles"}
            </Card.Header>
            <Card.Body className="p-4">
              {/* Filtre */}
              <div className="mb-4">
                <Row className="align-items-center">
                  <Col md={4}>
                    <h6 className="profile-info-label mb-0">
                      <i className="fa fa-filter me-2"></i>
                      Filtrer par statut
                    </h6>
                  </Col>
                  <Col md={4}>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">Toutes les missions</option>
                      <option value="À venir">À venir</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminée">Terminée</option>
                    </Form.Select>
                  </Col>
                  <Col md={4} className="text-end">
                    <small className="text-muted">
                      {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} trouvée{filteredMissions.length > 1 ? 's' : ''}
                    </small>
                  </Col>
                </Row>
              </div>

              <hr className="my-4" />

              {/* Liste des missions */}
              {filteredMissions.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {filteredMissions.map((mission, index) => (
                    <Col key={index}>
                      <MissionCard mission={mission} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <i className="fa fa-search fa-3x text-muted mb-3"></i>
                  <p className="text-muted mb-0">
                    {filterStatus
                      ? `Aucune mission "${filterStatus.toLowerCase()}" trouvée`
                      : "Aucune mission disponible pour le moment"
                    }
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
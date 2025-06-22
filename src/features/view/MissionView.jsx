import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Form, Button, Badge, FormSelect } from "react-bootstrap";
import MissionCard from "@components/MissionCard";
import AddressForm from "@components/AddressForm";
import { formatLocalDateTimeForBackend, updateMissionDateTime } from "@utils/formatDate";
import { getMissionStatus } from "../../utils/missionUtils";

export default function MissionView({ addMission, missionsToDisplay, skillTypes }) {
  const [newMission, setNewMission] = useState({
    title: "",
    description: "",
    missionSkillsTypeList: [],
    numberVolunteerSearch: "",
    address: {
      streetNumber: "",
      streetName: "",
      postalCode: "",
      city: ""
    },
    period: {
      periodId: null,
      startDate: "",
      endDate: "",
    },
  });
  const [userType, setUserType] = useState(null);

  const addressFormRef = useRef();
  const [displayMission, setDisplayedMission] = useState(missionsToDisplay || []);
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
        [field]: updateMissionDateTime(prev.period[field], value, type)
      }
    }));
  };

  const handleAddMission = async () => {
    const errors = {};

    if (!newMission.title) errors.title = "Le titre est requis.";
    if (!newMission.description) errors.description = "La description est requise.";
    if (!newMission.numberVolunteerSearch) errors.numberVolunteerSearch = "Le nombre de bénévoles est requis.";
    if (!newMission.period.startDate) errors.startDate = "La date de début est requise.";
    if (!newMission.period.endDate) errors.endDate = "La date de fin est requise.";
    if (!newMission.missionSkillsTypeList || newMission.missionSkillsTypeList.length === 0) {
      errors.missionSkillsTypeList = "Au moins une compétence est requise.";
    }
    const isAddressValid = await addressFormRef.current?.validateAddress();
    if (!isAddressValid) {
      errors.address = "Adresse invalide ou non reconnue.";
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
      <div className="text-danger" style={{ fontSize: "0.9em" }}>{formErrors[field]}</div>
    );

  const handleAddSkillType = (selectedLabel) => {
    const selectedSkill = skillTypes.find(skill => skill.label === selectedLabel);
    if (selectedSkill && !newMission.missionSkillsTypeList.find(s => s.id === selectedSkill.id)) {
      setNewMission(prev => ({
        ...prev,
        missionSkillsTypeList: [...prev.missionSkillsTypeList, { label: selectedSkill.label, id: selectedSkill.id }],
      }));
    }
  };

  const handleRemoveSkillType = (idToRemove) => {
    setNewMission(prev => ({
      ...prev,
      missionSkillsTypeList: prev.missionSkillsTypeList.filter(skill => skill.id !== idToRemove),
    }));
  };

  const filteredMissions = displayMission.filter((mission) => {
    const status = getMissionStatus(mission.period.startDate, mission.period.endDate).label;
    return !filterStatus || status === filterStatus;
  });

  return (
    <>
      {userType === "organization" && ( <Row className="flex justify-content-center p-4">
        <Card className="p-4 w-75 mb-4 yellow-border">
          <Card.Header className="title yellow-border align-text-center">Ajouter une mission</Card.Header>
          <Card.Body>
            <Form className="flex align-item-center">
              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newMission.title}
                  onChange={handleInputChange}
                />
                {renderError("title")}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={newMission.description}
                  onChange={handleInputChange}
                />
                {renderError("description")}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nombre de bénévoles recherchés</Form.Label>
                <Form.Control
                  type="number"
                  name="numberVolunteerSearch"
                  value={newMission.numberVolunteerSearch}
                  min={1}
                  max={100}
                  onChange={handleInputChange}
                />
                {renderError("numberVolunteerSearch")}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Compétences recherchées</Form.Label>
                <div className="mb-2 badge">
                  {newMission.missionSkillsTypeList.map((skill) => (
                    <Badge bg="secondary" key={skill.id} className="me-2">
                      {skill.label}{" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveSkillType(skill.id)}
                      >
                        X
                      </span>
                    </Badge>
                  ))}
                </div>
                <Row>
                  <Col>
                    <Form.Select id="skillTypeSelect">
                      <option value="">Choisir un type</option>
                      {skillTypes.map((skillType) => (
                        <option key={skillType.id} value={skillType.label}>
                          {skillType.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        const selectEl = document.getElementById("skillTypeSelect");
                        handleAddSkillType(selectEl.value);
                      }}
                    >
                      Ajouter
                    </Button>
                  </Col>
                </Row>
                {renderError("missionSkillsTypeList")}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Adresse</Form.Label>
                <AddressForm
                  ref={addressFormRef}
                  address={newMission.address}
                  onChange={handleAddressChange}
                />
                {renderError("address")}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Période</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Label>Début</Form.Label>
                    <Form.Control
                      type="date"
                      onChange={(e) => handleDateTimeChange("startDate", "date", e.target.value)}
                    />
                    <Form.Control
                      type="time"
                      className="mt-2"
                      onChange={(e) => handleDateTimeChange("startDate", "time", e.target.value)}
                    />
                    {renderError("startDate")}
                  </Col>
                  <Col md={6}>
                    <Form.Label>Fin</Form.Label>
                    <Form.Control
                      type="date"
                      onChange={(e) => handleDateTimeChange("endDate", "date", e.target.value)}
                    />
                    <Form.Control
                      type="time"
                      className="mt-2"
                      onChange={(e) => handleDateTimeChange("endDate", "time", e.target.value)}
                    />
                    {renderError("endDate")}
                  </Col>
                </Row>
              </Form.Group>

              <div className="d-flex justify-content-center mt-3">
                <Button variant="primary" onClick={handleAddMission}>
                  Ajouter la mission
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Row>
      )}

      <Row className="justify-content-center p-4">
        <Form.Label>Filtrer les missions</Form.Label>
        <Form.Select
          className="w-25"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Toutes les missions</option>
          <option value="À venir">À venir</option>
          <option value="En cours">En cours</option>
          <option value="Terminée">Terminée</option>
        </Form.Select>

        {filteredMissions.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredMissions.map((mission, index) => {
              return (
                <Col key={index}>
                  <MissionCard mission={mission} />
                </Col>
              );
            })}
          </Row>
        ) : (
          <p>Aucune mission trouvée pour ce filtre.</p>
        )}
      </Row>
    </>
  );
}
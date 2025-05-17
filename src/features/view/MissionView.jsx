import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Badge, FormSelect } from "react-bootstrap";
import MissionCard from "@components/MissionCard";

export default function MissionView({ addMission, missionsToDisplay, skillTypes }) {
  const [newMission, setNewMission] = useState({
    title: "",
    description: "",
    missionSkillsTypeList: [],
    nbVolunteerSearch: "",
    adress: {
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

  const [displayMission, setDisplayedMission] = useState(missionsToDisplay || []);
  const [filterStatus, setFilterStatus] = useState("");

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

  const handleAdressChange = (e) => {
    const { name, value } = e.target;
    setNewMission((prev) => ({
      ...prev,
      adress: {
        ...prev.adress,
        [name]: value,
      },
    }));
  };

  const handleDateTimeChange = (field, type, value) => {
    setNewMission((prev) => {
      let datePart = "";
      let timePart = "";

      if (prev.period[field]) {
        [datePart, timePart] = prev.period[field].split("T");
      }

      if (type === "date") {
        datePart = value;
      } else if (type === "time") {
        timePart = value;
        if (timePart && timePart.length === 5) {
          timePart = `${timePart}:00`;
        }
      }

      const fullISO = datePart && timePart ? `${datePart}T${timePart}` : datePart ? `${datePart}T00:00:00` : "";

      return {
        ...prev,
        period: {
          ...prev.period,
          [field]: fullISO,
        },
      };
    });
  };

  const handleAddMission = () => {
    if (!newMission.title || !newMission.description) {
      return;
    }

    const missionToSend = {
      ...newMission,
      period: {
        periodId: newMission.period.periodId || null,
        startDate: newMission.period.startDate || null,
        endDate: newMission.period.endDate || null,
      },
    };

    addMission(missionToSend);

    setNewMission({
      title: "",
      description: "",
      missionSkillsTypeList: [],
      nbVolunteerSearch: "",
      adress: {
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
  };

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

  const getMissionStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { label: "À venir", color: "success" };
    if (now >= start && now <= end) return { label: "En cours", color: "warning" };
    if (now > end) return { label: "Terminée", color: "danger" };
    return { label: "Inconnu", color: "secondary" };
  };

  const filteredMissions = displayMission.filter((mission) => {
    const status = getMissionStatus(mission.period.startDate, mission.period.endDate).label;
    return !filterStatus || status === filterStatus;
  });

  return (
    <>
      <Row className="justify-center p-4">
        <Card className="p-4 w-75 mb-4 yellow-border">
          <Card.Header className="title yellow-border">Ajouter une mission</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newMission.title}
                  onChange={handleInputChange}
                />
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
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nombre de bénévoles recherchés</Form.Label>
                <Form.Control
                  type="number"
                  name="nbVolunteerSearch"
                  value={newMission.nbVolunteerSearch}
                  min={1}
                  max={100}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Compétences recherchées</Form.Label>
                <div className="mb-2 badge">
                  {newMission.missionSkillsTypeList.map((skill) => (
                    <Badge bg="secondary" key={skill.id} className="me-2">
                      {skill.label} {" "}
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
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Adresse</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      placeholder="Numéro"
                      name="streetNumber"
                      value={newMission.adress.streetNumber}
                      onChange={handleAdressChange}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      placeholder="Rue"
                      name="streetName"
                      value={newMission.adress.streetName}
                      onChange={handleAdressChange}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <Form.Control
                      placeholder="Code postal"
                      name="postalCode"
                      value={newMission.adress.postalCode}
                      onChange={handleAdressChange}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      placeholder="Ville"
                      name="city"
                      value={newMission.adress.city}
                      onChange={handleAdressChange}
                    />
                  </Col>
                </Row>
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
                  </Col>
                </Row>
              </Form.Group>

              <Button variant="primary" onClick={handleAddMission}>
                Ajouter la mission
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Row>

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
              const status = getMissionStatus(mission.period.startDate, mission.period.endDate);
              return (
                <Col key={index}>
                    <MissionCard mission={mission} getMissionStatus={getMissionStatus} />
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

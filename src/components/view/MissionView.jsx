import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, ListGroup } from "react-bootstrap";

export default function MissionView({ addMission, missionsToDisplay }) {
  const [newMission, setNewMission] = useState({
    title: "",
    description: "",
    missionSkillsTypeList: [{ label: "", id: "" }],
    adress: {
      streetNumber: "",
      streetName: "",
      postalCode: "",
      city: "",
    },
    period: {
      startDate: "",
      endDate: "",
    },
  });

  const [displayMission, setDisplayedMission] = useState(missionsToDisplay || []);

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
      const existing = prev.period[field] || "";
      let [datePart, timePart] = existing.split("T");
  
      if (type === "date") datePart = value;
      if (type === "time") timePart = value;
  
      const fullISO = datePart && timePart ? `${datePart}T${timePart}:00` : "";
  
      return {
        ...prev,
        period: {
          ...prev.period,
          [field]: fullISO,
        },
      };
    });
  };
  

  const handleAddSkill = () => {
    if (!newMission.title || !newMission.description) {
      return;
    }
    setDisplayedMission((prev) => [...prev, newMission]);
    addMission(newMission);
    setNewMission({
      title: "",
      description: "",
      missionSkillsTypeList: [{ label: "", id: "" }],
      adress: {
        streetNumber: "",
        streetName: "",
        postalCode: "",
        city: "",
      },
      period: {
        startDate: "",
        endDate: "",
      },
    });
  };


return (
    <>

{missionsToDisplay === null && (
<Row className="justify-content-center p-4">
        <Card className="p-4 w-75">
            <Card.Header className="text-center">Liste des missions</Card.Header>
            <Card.Body>
            <ListGroup>
                {displayMission.map((mission, index) => (
                <ListGroup.Item key={index}>
                    <h5>{mission.title}</h5>
                    <p>{mission.description}</p>
                    <p>
                    {mission.adress.streetNumber} {mission.adress.streetName},{" "}
                    {mission.adress.postalCode} {mission.adress.city}
                    </p>
                    <p>
                    Du {mission.period.startDate} au {mission.period.endDate}
                    </p>
                </ListGroup.Item>
                ))}
            </ListGroup>
            </Card.Body>
        </Card>
        </Row>
)}

        <Row className="justify-content-center p-4">
        <Card className="p-4 w-75 mb-4">
            <Card.Header className="text-center">Ajouter une mission</Card.Header>
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
        name="startDate"
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
        name="endDate"
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


                <Button variant="primary" onClick={handleAddSkill}>
                Ajouter la mission
                </Button>
            </Form>
            </Card.Body>
        </Card>
        </Row>

       
    </>
    );
}
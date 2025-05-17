import React, { useState } from "react";
import { Row, Col, Form, Button, Container, Card } from "react-bootstrap";
import MissionCard from "@components/MissionCard";
import SearchField from "@components/SearchField";

export default function SearchView({ allMissions, skillTypes, getMissionStatus, onSearch }) {
  const [filters, setFilters] = useState({
    city: "",
    distanceKm: "",
    referenceAddress: "",
    skillType: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Rechercher une mission</h2>

      <Card className="p-4 shadow-sm mb-5">
        <Form>
          <Row className="g-3">
            <Col md={3}>
              <SearchField label="Ville" name="city" value={filters.city} onChange={handleChange} />
            </Col>

            <Col md={3}>
              <Form.Group controlId="skillType">
                <Form.Label>Compétence</Form.Label>
                <Form.Select name="skillType" value={filters.skillType} onChange={handleChange}>
                  <option value="">Toutes</option>
                  {skillTypes.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <SearchField
                label="Adresse de référence"
                name="referenceAddress"
                value={filters.referenceAddress}
                onChange={handleChange}
                placeholder="10 rue de Paris, Lyon"
              />
            </Col>

            <Col md={3}>
              <SearchField
                label="Distance (km)"
                name="distanceKm"
                type="number"
                value={filters.distanceKm}
                onChange={handleChange}
              />
            </Col>

            <Col md={3}>
              <SearchField
                label="Date de début"
                name="startDate"
                type="date"
                value={filters.startDate}
                onChange={handleChange}
              />
            </Col>

            <Col md={3}>
              <SearchField
                label="Date de fin"
                name="endDate"
                type="date"
                value={filters.endDate}
                onChange={handleChange}
              />
            </Col>

            <Col md={12}>
              <Button variant="primary" onClick={() => onSearch(filters)}>
                🔍 Lancer la recherche
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row xs={1} md={2} lg={3} className="g-4">
        {allMissions.length > 0 ? (
          allMissions.map((mission) => (
            <Col key={mission.id}>
              <MissionCard mission={mission} getMissionStatus={getMissionStatus} showApplyButton={true} />
            </Col>
          ))
        ) : (
          <p>Aucune mission ne correspond à ces critères.</p>
        )}
      </Row>
    </Container>
  );
}

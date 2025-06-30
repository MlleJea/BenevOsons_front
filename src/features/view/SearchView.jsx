import React, { useState } from "react";
import { Row, Col, Form, Button, Container, Card } from "react-bootstrap";
import MissionCard from "@components/MissionCard";
import SearchField from "@components/SearchField";
import LocationSearch from "@components/LocationSearch";
import { formatSearchStartDate, formatSearchEndDate } from "@utils/formatDate";

export default function SearchView({ allMissions, skillTypes, getMissionStatus, onSearch, userAddresses = [] }) {

  const initialFilters = {
    skillType: "",
    startDate: "",
    endDate: "",
    location: {
      type: "",
      postalCode: "",
      city: "",
      selectedAddress: "",
      radiusKm: "",
      isValid: false
    }
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (locationData) => {
    setFilters((prev) => ({
      ...prev,
      location: locationData
    }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  const handleSearch = () => {
    const hasSkillType = filters.skillType && filters.skillType !== "";
    const hasStartDate = filters.startDate && filters.startDate !== "";
    const hasEndDate = filters.endDate && filters.endDate !== "";
    const hasLocation = filters.location.isValid;

    if (!hasSkillType && !hasStartDate && !hasEndDate && !hasLocation) {
      alert("Veuillez entrer au moins un critère de recherche");
      return;
    }

    let userLatitude = null;
    let userLongitude = null;
    let postalCode = null;
    let radiusKm = null;

    if (hasLocation){
      radiusKm = parseInt(filters.location.radiusKm);
    }

    if (filters.location.isValid) {
      if (filters.location.type === "myAddress") {
        const selectedAddr = userAddresses.find(
          (addr) => addr.id === parseInt(filters.location.selectedAddress)
        );
        if (selectedAddr) {
          userLatitude = selectedAddr.latitude;
          userLongitude = selectedAddr.longitude;
        }
      } else if (filters.location.type === "city") {
        postalCode = filters.location.postalCode;
      }
    }
    const searchCriteria = {
      skillTypeIds: hasSkillType ? [parseInt(filters.skillType)] : [],
      startDate: formatSearchStartDate(filters.startDate),
      endDate: formatSearchEndDate(filters.endDate),
      postalCode: postalCode,
      radiusKm: radiusKm,
      userLatitude,
      userLongitude,
    };

    onSearch(searchCriteria);
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Rechercher une mission</h2>

      <Card className="p-4 shadow-sm mb-5">
        <Form>
          {/* Section Compétences */}
          <div className="form-section">
            <h5><i className="fa fa-tools"></i> Recherche par compétence</h5>
            <small>Trouvez des missions correspondant à vos compétences spécifiques</small>
            <Row className="g-3 mt-2">
              <Col md={6}>
                <Form.Group controlId="skillType">
                  <Form.Label><i className="fa fa-cogs"></i> Type de compétence recherché</Form.Label>
                  <Form.Select
                    name="skillType"
                    value={filters.skillType}
                    onChange={handleChange}
                  >
                    <option value="">Toutes les compétences</option>
                    {skillTypes.map((skill) => (
                      <option key={skill.idSkillType} value={skill.idSkillType}>
                        {skill.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <hr />

          {/* Section Disponibilités */}
          <div className="form-section">
            <h5><i className="fa fa-calendar"></i> Recherche par disponibilités</h5>
            <small>Filtrez selon vos créneaux de disponibilité</small>
            <Row className="g-3 mt-2">
              <Col md={6}>
                <SearchField
                  label="Date de début souhaitée"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <SearchField
                  label="Date de fin souhaitée"
                  name="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </div>

          <hr />

          {/* Section Localisation */}
          <div className="form-section">
            <h5><i className="fa fa-map-marker-alt"></i> Recherche par localisation géographique</h5>
            <small>Trouvez des missions près de chez vous avec un rayon personnalisable</small>
            <div className="mt-3">
              <LocationSearch
                onLocationChange={handleLocationChange}
                userAddresses={userAddresses}
                value={filters.location}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <Row className="mt-4">
            <Col md={12} className="text-center">
              <Button
                variant="primary"
                size="md"
                onClick={handleSearch}
                className="px-5 me-3"
              >
                Rechercher des missions
              </Button>
              <Button
                variant="outline-secondary"
                size="md"
                onClick={handleReset}
                className="px-4"
              >
                Réinitialiser les filtres
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Résultats de recherche */}
      <div className="mb-3">
        <h4>Résultats de recherche ({allMissions.length} mission{allMissions.length > 1 ? 's' : ''} trouvée{allMissions.length > 1 ? 's' : ''})</h4>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {allMissions.length > 0 ? (
          allMissions.map((mission) => (
            <Col key={mission.missionId || mission.id}>
              <MissionCard
                mission={mission}
                getMissionStatus={getMissionStatus}
                showApplyButton={true}
              />
            </Col>
          ))
        ) : (
          <Col md={12}>
            <Card className="text-center p-4">
              <Card.Body>
                <p className="mb-0">Aucune mission ne correspond à ces critères de recherche.</p>
                <small className="text-muted">
                  Essayez d'élargir vos critères ou de modifier vos filtres.
                </small>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}
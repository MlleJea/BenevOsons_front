import React, { useState } from "react";
import { Row, Col, Form, Button, Container, Card } from "react-bootstrap";
import MissionCard from "@components/MissionCard";
import SearchField from "@components/SearchField";
import { formatSearchStartDate,formatSearchEndDate } from "@utils/formatDate";

export default function SearchView({ allMissions, skillTypes, getMissionStatus, onSearch }) {
  const [filters, setFilters] = useState({
    skillType: "",
    
    city: "",
    distanceKm: "",
    referenceAddress: "",
    
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    if (filters.referenceAddress && !filters.distanceKm) {
      alert("Veuillez spécifier un rayon de recherche avec l'adresse de référence");
      return;
    }

    // Vérification qu'au moins un critère est renseigné
    const hasSkillType = filters.skillType && filters.skillType !== "";
    const hasCity = filters.city && filters.city.trim() !== "";
    const hasAddress = filters.referenceAddress && filters.referenceAddress.trim() !== "";
    const hasStartDate = filters.startDate && filters.startDate !== "";
    const hasEndDate = filters.endDate && filters.endDate !== "";

    if (!hasSkillType && !hasCity && !hasAddress && !hasStartDate && !hasEndDate) {
      alert("Veuillez entrer au moins un critère de recherche");
      return;
    }

    const searchCriteria = {
      skillTypeIds: hasSkillType ? [parseInt(filters.skillType)] : [],
      
      city: hasCity ? filters.city : null,
      referenceAddress: hasAddress ? filters.referenceAddress : null,
      distanceKm: filters.distanceKm ? parseInt(filters.distanceKm) : null,
      
      startDate: formatSearchStartDate(filters.startDate),
      endDate: formatSearchEndDate(filters.endDate),
    };

    console.log("Critères de recherche envoyés:", searchCriteria);
    onSearch(searchCriteria);
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Rechercher une mission</h2>
      
      <Card className="p-4 shadow-sm mb-5">
        <Form>
          {/* Section Compétences*/}
          <Row className="g-3 mb-4">
            <Col md={12}>
              <h5 className="text-muted">Recherche par compétence</h5>
              <small className="text-muted">
                Trouvez des missions correspondant à vos compétences spécifiques
              </small>
            </Col>
            <Col md={6}>
              <Form.Group controlId="skillType">
                <Form.Label>Type de compétence recherché</Form.Label>
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

          <hr />

          {/* Section Disponibilités */}
          <Row className="g-3 mb-4">
            <Col md={12}>
              <h5 className="text-muted">Recherche par disponibilités</h5>
              <small className="text-muted">
                Filtrez selon vos créneaux de disponibilité
              </small>
            </Col>
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

          <hr />

          {/* Section Localisation  */}
          <Row className="g-3 mb-4">
            <Col md={12}>
              <h5 className="text-muted">Recherche par localisation géographique</h5>
              <small className="text-muted">
                Trouvez des missions près de chez vous avec un rayon personnalisable
              </small>
            </Col>
            <Col md={4}>
              <SearchField 
                label="Ville" 
                name="city" 
                value={filters.city} 
                onChange={handleChange}
                placeholder="Ex: Lyon, Paris..."
              />
            </Col>
            <Col md={4}>
              <SearchField
                label="Adresse de référence (optionnel)"
                name="referenceAddress"
                value={filters.referenceAddress}
                onChange={handleChange}
                placeholder="10 rue de Paris, Lyon"
              />
            </Col>
            <Col md={4}>
              <SearchField
                label="Rayon de recherche (km)"
                name="distanceKm"
                type="number"
                value={filters.distanceKm}
                onChange={handleChange}
                placeholder="Ex: 10, 25, 50"
                min="1"
                max="100"
              />
            </Col>
          </Row>

          <Row>
            <Col md={12} className="text-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleSearch}
                className="px-5"
              >
                🔍 Rechercher des missions
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
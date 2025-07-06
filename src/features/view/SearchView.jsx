import React, { useState } from "react";
import { Row, Col, Form, Button, Container, Card } from "react-bootstrap";
import MissionCard from "@components/MissionCard";
import SearchField from "@components/SearchField";
import LocationSearch from "@components/LocationSearch";
import PopupModal from "@components/PopupModal";
import { formatSearchStartDate, formatSearchEndDate } from "@utils/formatDate";

export default function SearchView({ allMissions, skillTypes, getMissionStatus, onSearch, userAddresses = [] }) {

  const initialFilters = {
    skillType: "",
    startDate: "",
    endDate: "",
    useEndDate: false, // Nouveau champ pour contrôler l'affichage
    location: {
      type: "",
      postalCode: "",
      city: "",
      selectedAddress: "",
      userLatitude: null,
      userLongitude: null,
      radiusKm: "",
      isValid: false
    }
  };

  const [filters, setFilters] = useState(initialFilters);
  const [resetKey, setResetKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "useEndDate") {
      setFilters((prev) => ({
        ...prev,
        [name]: checked,
        // Réinitialiser la date de fin si on décoche
        endDate: checked ? prev.endDate : ""
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (locationData) => {
    setFilters((prev) => ({
      ...prev,
      location: locationData
    }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setResetKey(prev => prev + 1);
  };

  const showErrorModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const handleSearch = () => {
    const hasSkillType = filters.skillType && filters.skillType !== "";
    const hasStartDate = filters.startDate && filters.startDate !== "";
    const hasEndDate = filters.useEndDate && filters.endDate && filters.endDate !== "";
    const hasLocation = filters.location.isValid;

    if (!hasSkillType && !hasStartDate && !hasEndDate && !hasLocation) {
      showErrorModal("Veuillez entrer au moins un critère de recherche");
      return;
    }

    let userLatitude = null;
    let userLongitude = null;
    let postalCode = null;
    let radiusKm = null;

    if (hasLocation) {
      radiusKm = parseInt(filters.location.radiusKm);
    }

    if (filters.location.isValid) {
      if (filters.location.type === "myAddress") {
        const selectedAddr = userAddresses.find(
          (addr) => addr.addressId === parseInt(filters.location.selectedAddress)
        );
        if (selectedAddr) {
          userLatitude = selectedAddr.latitude;
          userLongitude = selectedAddr.longitude;
        }
      } else if (filters.location.type === "city") {
        postalCode = filters.location.postalCode;
      }
    }

    // Si on a une startDate mais pas d'endDate, utiliser startDate pour endDate
    let searchEndDate = null;
    if (filters.useEndDate && filters.endDate) {
      searchEndDate = formatSearchEndDate(filters.endDate);
    } else if (filters.startDate) {
      // Utiliser startDate comme endDate si pas d'endDate spécifiée
      searchEndDate = formatSearchEndDate(filters.startDate);
    }

    const searchCriteria = {
      skillTypeIds: hasSkillType ? [parseInt(filters.skillType)] : [],
      startDate: formatSearchStartDate(filters.startDate),
      endDate: searchEndDate,
      postalCode: postalCode,
      radiusKm: radiusKm,
      userLatitude,
      userLongitude,
    };

    console.log(searchCriteria);

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
              <Col md={12}>
                <Form.Group controlId="useEndDate" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="useEndDate"
                    checked={filters.useEndDate}
                    onChange={handleChange}
                    label="Spécifier une date de fin (optionnel)"
                    className="text-muted "
                  />
                </Form.Group>
              </Col>
              {filters.useEndDate && (
                <Col md={6}>
                  <SearchField
                    label="Date de fin souhaitée"
                    name="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={handleChange}
                  />
                </Col>
              )}
            </Row>
          </div>

          <hr />

          {/* Section Localisation */}
          <div className="form-section">
            <h5><i className="fa fa-map-marker-alt"></i> Recherche par localisation géographique</h5>
            <small>Trouvez des missions près de chez vous avec un rayon personnalisable</small>
            <div className="mt-3">
              <LocationSearch
                key={resetKey}
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
                hideStatus={true}
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
      {showModal && (
        <PopupModal
          message={modalMessage}
          onClose={closeModal}
        />
      )}
    </Container>
  );
}
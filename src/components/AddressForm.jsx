import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { validateAddress, verifyAddressExists } from "@utils/validationUtils";

const AddressForm = forwardRef(({
  address = {},
  onChange,
  onValidityChange,
  isEditable = true,
  onDelete,
  showActions = false, // pour SpaceView
  compact = false, // pour RegisterView/MissionView
}, ref) => {
  const [localAddress, setLocalAddress] = useState({
    streetNumber: address.streetNumber || "",
    streetName: address.streetName || "",
    postalCode: address.postalCode || "",
    city: address.city || "",
  });
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [editing, setEditing] = useState(isEditable);

  // Pour SpaceView : placeholders avec l'adresse actuelle
  useEffect(() => {
    setLocalAddress({
      streetNumber: address.streetNumber || "",
      streetName: address.streetName || "",
      postalCode: address.postalCode || "",
      city: address.city || "",
    });
  }, [address]);

  // Récupère les villes après saisie d'un code postal valide
  useEffect(() => {
    const fetchCities = async () => {
      if (localAddress.postalCode.length === 5) {
        try {
          const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${localAddress.postalCode}&type=municipality&limit=10`);
          const data = await res.json();
          if (data.features) {
            const cityList = [...new Set(data.features.map(f => f.properties.city))];
            setCities(cityList);
          }
        } catch {
          setCities([]);
        }
      } else {
        setCities([]);
      }
    };
    fetchCities();
  }, [localAddress.postalCode]);

  // Validation  
  useImperativeHandle(ref, () => ({
    validateAddress: async () => {
      const validationErrors = validateAddress(localAddress);
      if (Object.keys(validationErrors).length === 0) {
        const exists = await verifyAddressExists(localAddress);
        if (exists === true) {
          setErrors({});
          onValidityChange && onValidityChange(true);
          return true;
        } else {
          setErrors({ general: typeof exists === "string" ? exists : "Adresse non reconnue" });
          onValidityChange && onValidityChange(false);
          return false;
        }
      } else {
        setErrors(validationErrors);
        onValidityChange && onValidityChange(false);
        return false;
      }
    }
  }));

  // Gestion des changements de champ
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...localAddress, [name]: value };
    // Si code postal change, reset la ville
    if (name === "postalCode") {
      updated.city = "";
    }
    setLocalAddress(updated);
    setErrors({});
    onChange && onChange(updated);
  };

  // Affichage en lecture pour SpaceView
  if (!editing && !isEditable) {
    const fullAddress = [address.streetNumber, address.streetName, address.postalCode, address.city]
      .filter(Boolean)
      .join(" ");

    return (
      <>
        <Card className="border-light">
          <Card.Body className="py-2">
            <Row className="align-items-center">
              <Col>
                <div className="text-break">
                  <i className="fa fa-map-marker-alt text-muted me-2"></i>
                  {fullAddress || "Aucune adresse renseignée"}
                </div>
              </Col>
              {showActions && (
                <Col xs="auto">
                  <div className="d-flex gap-1">
                    <Button size="sm" variant="outline-primary" onClick={() => setEditing(true)}>
                      <i className="fa fa-edit me-1"></i>
                      <span className="d-none d-sm-inline">Modifier</span>
                    </Button>
                  </div>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }

  // Version compacte pour RegisterView/MissionView
  if (compact) {
    return (
      <>
        <div>
          <Row className="g-2">
            {/* Numéro et Rue sur la même ligne */}
            <Col xs={12} sm={3}>
              <Form.Group>
                <Form.Label className="small text-muted">Numéro</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="streetNumber"
                  value={localAddress.streetNumber}
                  onChange={handleChange}
                  placeholder="123"
                  isInvalid={!!errors.streetNumber}
                />
                <Form.Control.Feedback type="invalid">{errors.streetNumber}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} sm={9}>
              <Form.Group>
                <Form.Label className="small text-muted">Rue</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="streetName"
                  value={localAddress.streetName}
                  onChange={handleChange}
                  placeholder="Rue de la Paix"
                  isInvalid={!!errors.streetName}
                />
                <Form.Control.Feedback type="invalid">{errors.streetName}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-2 mt-1">
            {/* Code postal et Ville sur la même ligne */}
            <Col xs={12} sm={4}>
              <Form.Group>
                <Form.Label className="small text-muted">Code postal</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="postalCode"
                  value={localAddress.postalCode}
                  onChange={handleChange}
                  placeholder="75001"
                  isInvalid={!!errors.postalCode}
                />
                <Form.Control.Feedback type="invalid">{errors.postalCode}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} sm={8}>
              <Form.Group>
                <Form.Label className="small text-muted">Ville</Form.Label>
                <Form.Select
                  size="sm"
                  name="city"
                  value={localAddress.city}
                  onChange={handleChange}
                  isInvalid={!!errors.city}
                  disabled={cities.length === 0}
                >
                  <option value="">Sélectionnez une ville</option>
                  {cities.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {errors.general && <div className="text-danger small mt-2">{errors.general}</div>}
        </div>
      </>
    );
  }

  // Version normale pour MissionView
  return (
    <>
      <div>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Numéro</Form.Label>
              <Form.Control
                type="text"
                name="streetNumber"
                value={localAddress.streetNumber}
                onChange={handleChange}
                placeholder={address.streetNumber || "ex : 123"}
                isInvalid={!!errors.streetNumber}
              />
              <Form.Control.Feedback type="invalid">{errors.streetNumber}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Rue</Form.Label>
              <Form.Control
                type="text"
                name="streetName"
                value={localAddress.streetName}
                onChange={handleChange}
                placeholder={address.streetName || "ex : Rue de la Paix"}
                isInvalid={!!errors.streetName}
              />
              <Form.Control.Feedback type="invalid">{errors.streetName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="g-3 mt-1">
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Code postal</Form.Label>
              <Form.Control
                type="text"
                name="postalCode"
                value={localAddress.postalCode}
                onChange={handleChange}
                placeholder={address.postalCode || "ex : 75001"}
                isInvalid={!!errors.postalCode}
              />
              <Form.Control.Feedback type="invalid">{errors.postalCode}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} md={8}>
            <Form.Group>
              <Form.Label>Ville</Form.Label>
              <Form.Select
                name="city"
                value={localAddress.city}
                onChange={handleChange}
                isInvalid={!!errors.city}
                disabled={cities.length === 0}
              >
                <option value="">Sélectionnez une ville</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city}>{city}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {errors.general && <div className="text-danger mt-2">{errors.general}</div>}

        {showActions && (
          <div className="d-flex gap-2 mt-3">
            <Button size="sm" variant="success" onClick={() => setEditing(false)}>
              <i className="fa fa-save me-1"></i>
              Enregistrer
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
              <i className="fa fa-times me-1"></i>
              Annuler
            </Button>
          </div>
        )}
      </div>
    </>
  );
});

export default AddressForm;
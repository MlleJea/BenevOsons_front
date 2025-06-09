import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { validateAddress, verifyAddressExists } from "@utils/validationUtils";

const AddressForm = forwardRef(({
  address = {},
  onChange,
  onValidityChange,
  isEditable = true,
  onDelete,
  showActions = false, // pour SpaceView
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

  // Validation à la demande (ex: RegisterView)
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

  // Pour SpaceView : édition/suppression
  if (!editing && !isEditable) {
    return (
      <div>
        <Row>
          <Col>
            <Form.Control
              plaintext
              readOnly
              value={
                [address.streetNumber, address.streetName, address.postalCode, address.city]
                  .filter(Boolean)
                  .join(" ")
              }
            />
          </Col>
          {showActions && (
            <>
              <Col xs="auto">
                <Button size="sm" variant="primary" onClick={() => setEditing(true)}>Modifier</Button>
              </Col>
              <Col xs="auto">
                <Button size="sm" variant="danger" onClick={onDelete}>Supprimer</Button>
              </Col>
            </>
          )}
        </Row>
      </div>
    );
  }

  // Formulaire d'adresse homogène
  return (
    <div>
      <Form.Group className="mb-2">
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
      <Form.Group className="mb-2">
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
      <Form.Group className="mb-2">
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
      <Form.Group className="mb-2">
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
      {errors.general && <div className="text-danger mb-2">{errors.general}</div>}
      {showActions && (
        <div className="d-flex gap-2 mt-2">
          <Button size="sm" variant="success" onClick={() => setEditing(false)}>Enregistrer</Button>
          <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>Annuler</Button>
        </div>
      )}
    </div>
  );
});

export default AddressForm;
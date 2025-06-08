import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function AddressForm({
  address = {},
  onChange,
  onDelete,
  isEditableContext = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localAddress, setLocalAddress] = useState({
    streetNumber: address.streetNumber || "",
    streetName: address.streetName || "",
    postalCode: address.postalCode || "",
    city: address.city || "",
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...localAddress, [name]: value };
    setLocalAddress(updated);
    onChange && onChange(updated); // si callback fourni
  };

  const handleEditClick = () => setIsEditing(true);
  const handleDeleteClick = () => {
    if (onDelete) onDelete();
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onChange && onChange(localAddress);
  };

  const handleCancelClick = () => {
    setLocalAddress({
      streetNumber: address.streetNumber || "",
      streetName: address.streetName || "",
      postalCode: address.postalCode || "",
      city: address.city || "",
    });
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <Form.Group className="mb-2">
            <Form.Label>Numéro</Form.Label>
            <Form.Control
              type="text"
              name="streetNumber"
              value={localAddress.streetNumber}
              onChange={handleFieldChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Rue</Form.Label>
            <Form.Control
              type="text"
              name="streetName"
              value={localAddress.streetName}
              onChange={handleFieldChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Code postal</Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              value={localAddress.postalCode}
              onChange={handleFieldChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Ville</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={localAddress.city}
              onChange={handleFieldChange}
            />
          </Form.Group>

          <div className="d-flex gap-2 mt-2">
            <Button variant="success" onClick={handleSaveClick}>
              Enregistrer
            </Button>
            <Button variant="secondary" onClick={handleCancelClick}>
              Annuler
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>
            {address.streetNumber} {address.streetName}, {address.postalCode} {address.city}
          </p>

          {isEditableContext && (
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleEditClick}>
                Modifier
              </Button>
              <Button variant="danger" onClick={handleDeleteClick}>
                Supprimer
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

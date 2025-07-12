import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import FormGroupRow from "@components/FormGroupRow";
import { validatePostalCode } from "@utils/validationUtils";

export default function LocationSearch({
  onLocationChange,
  userAddresses = [],
  value = { type: "", postalCode: "", city: "", selectedAddress: "", radiusKm: "" }
}) {
  const [searchType, setSearchType] = useState(value.type || "");
  const [postalCode, setPostalCode] = useState(value.postalCode || "");
  const [city, setCity] = useState(value.city || "");
  const [selectedAddress, setSelectedAddress] = useState(value.selectedAddress || "");
  const [radiusKm, setRadiusKm] = useState(value.radiusKm || "");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      if (postalCode.length === 5) {
        try {
          const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${postalCode}&type=municipality&limit=10`);
          const data = await response.json();
          if (data.features) {
            const cityList = [...new Set(data.features.map(f => f.properties.city))];
            setCities(cityList);
          }
        } catch (error) {
          console.error("Erreur récupération villes:", error);
          setCities([]);
        }
      } else {
        setCities([]);
        setCity("");
      }
    };

    if (searchType === "city") {
      fetchCities();
    }
  }, [postalCode, searchType]);

  useEffect(() => {
    const radiusValid = radiusKm && !isNaN(radiusKm) && radiusKm > 0;

    let locationData = {
      type: searchType,
      postalCode,
      city,
      selectedAddress,
      radiusKm,
      isValid: false,
      userLatitude: null,
      userLongitude: null
    };
    if (searchType === "city" && city && postalCode.length === 5 && radiusValid) {
      locationData.isValid = true;
    } else if (searchType === "myAddress" && selectedAddress && radiusValid) {
      const selectedAddr = userAddresses.find(
        (addr) => addr.addressId === parseInt(selectedAddress)
      );
      if (selectedAddr && selectedAddr.latitude && selectedAddr.longitude) {
        locationData.userLatitude = selectedAddr.latitude;
        locationData.userLongitude = selectedAddr.longitude;
        locationData.isValid = true;
      }
    }

    onLocationChange(locationData);
  }, [searchType, city, postalCode, selectedAddress, radiusKm, userAddresses]);

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setPostalCode("");
    setCity("");
    setSelectedAddress("");
    setCities([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "postalCode") setPostalCode(value);
    else if (name === "radiusKm") setRadiusKm(value);
  };

  return (
    <div>
      {/* Choix du type de recherche */}
      <Row className="mb-3">
        <Col>
          <Form.Check
            type="radio"
            id="searchByCity"
            name="searchType"
            label="Rechercher par ville"
            checked={searchType === "city"}
            onChange={() => handleSearchTypeChange("city")}
          />
        </Col>
        <Col>
          <Form.Check
            type="radio"
            id="searchByMyAddress"
            name="searchType"
            label="Rechercher depuis mon adresse"
            checked={searchType === "myAddress"}
            onChange={() => handleSearchTypeChange("myAddress")}
          />
        </Col>
      </Row>

      {/* Recherche par ville */}
      {searchType === "city" && (
        <div>
          <FormGroupRow
            label="Code postal"
            name="postalCode"
            type="text"
            value={postalCode}
            onChange={handleInputChange}
            placeholder="Ex: 69000"
            icon="fa-map-pin"
          />

          <Row className="ps-3 pe-3">
            <Col sm={3}><output>Ville</output></Col>
            <Col sm={7}>
              <Form.Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={cities.length === 0}
                className="mb-3"
              >
                <option value="">Sélectionnez une ville</option>
                {cities.map((cityName, idx) => (
                  <option key={idx} value={cityName}>{cityName}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <FormGroupRow
            label="Rayon (km)"
            name="radiusKm"
            type="number"
            value={radiusKm}
            onChange={handleInputChange}
            placeholder="Ex: 25"
            icon="fa-circle"
          />
        </div>
      )}

      {/* Recherche par adresse utilisateur */}
      {searchType === "myAddress" && (
        <div>
          <Row className="ps-3 pe-3">
            <Col sm={3}><output>Mon adresse</output></Col>
            <Col sm={7}>
              <Form.Select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="mb-3"
              >
                <option value="">Choisissez une de vos adresses</option>
                {userAddresses.map((address) => (
                  <option key={address.addressId} value={address.addressId}>
                    {address.streetNumber} {address.streetName}, {address.postalCode} {address.city}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <FormGroupRow
            label="Rayon (km)"
            name="radiusKm"
            type="number"
            value={radiusKm}
            onChange={handleInputChange}
            placeholder="Ex: 25"
            icon="fa-circle"
          />
        </div>
      )}
    </div>
  );
}
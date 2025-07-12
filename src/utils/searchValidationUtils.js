/**
 * Utilitaires de validation pour le système de recherche de missions
 * @author Jeanne GRUSON
 * @version 1.0
 */

/**
 * Valide un code postal français
 * @param {string} postalCode - Le code postal à valider
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode) {
    return { isValid: false, error: "Le code postal est requis" };
  }

  const trimmedCode = postalCode.trim();
  
  // Vérifier le format (5 chiffres)
  const postalCodeRegex = /^[0-9]{5}$/;
  if (!postalCodeRegex.test(trimmedCode)) {
    return { isValid: false, error: "Le code postal doit contenir exactement 5 chiffres" };
  }

  // Vérifier que c'est un code postal français valide (commence par 01-95, 97, 98)
  const firstTwoDigits = parseInt(trimmedCode.substring(0, 2));
  if ((firstTwoDigits < 1 || firstTwoDigits > 95) && firstTwoDigits !== 97 && firstTwoDigits !== 98) {
    return { isValid: false, error: "Code postal français non valide" };
  }

  return { isValid: true, error: null };
};

/**
 * Valide les dates de mission (début et fin)
 * @param {string} startDate - Date de début au format YYYY-MM-DD
 * @param {string} endDate - Date de fin au format YYYY-MM-DD (optionnel)
 * @param {boolean} allowPastDates - Autoriser les dates passées (défaut: false)
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateMissionDates = (startDate, endDate = null, allowPastDates = false) => {
  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer seulement la date

  // Validation de la date de début
  if (startDate) {
    const start = new Date(startDate);
    
    if (isNaN(start.getTime())) {
      errors.startDate = "Format de date de début invalide";
    } else {
      // Vérifier si la date de début est dans le passé
      if (!allowPastDates && start < today) {
        errors.startDate = "La date de début ne peut pas être dans le passé";
      }
    }
  }

  // Validation de la date de fin
  if (endDate) {
    const end = new Date(endDate);
    
    if (isNaN(end.getTime())) {
      errors.endDate = "Format de date de fin invalide";
    } else {
      // Vérifier si la date de fin est dans le passé
      if (!allowPastDates && end < today) {
        errors.endDate = "La date de fin ne peut pas être dans le passé";
      }
      
      // Vérifier que la date de fin est après la date de début
      if (startDate && !errors.startDate) {
        const start = new Date(startDate);
        if (end < start) {
          errors.endDate = "La date de fin doit être postérieure à la date de début";
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valide le rayon de recherche
 * @param {string|number} radius - Le rayon en kilomètres
 * @param {number} minRadius - Rayon minimum autorisé (défaut: 1)
 * @param {number} maxRadius - Rayon maximum autorisé (défaut: 100)
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateRadius = (radius, minRadius = 1, maxRadius = 100) => {
  if (!radius) {
    return { isValid: false, error: "Le rayon est requis" };
  }

  const numRadius = Number(radius);
  
  if (isNaN(numRadius)) {
    return { isValid: false, error: "Le rayon doit être un nombre" };
  }

  if (numRadius < minRadius) {
    return { isValid: false, error: `Le rayon minimum est de ${minRadius} km` };
  }

  if (numRadius > maxRadius) {
    return { isValid: false, error: `Le rayon maximum est de ${maxRadius} km` };
  }

  if (numRadius % 1 !== 0) {
    return { isValid: false, error: "Le rayon doit être un nombre entier" };
  }

  return { isValid: true, error: null };
};

/**
 * Valide les données de localisation
 * @param {object} locationData - Les données de localisation
 * @param {Array} userAddresses - Les adresses de l'utilisateur
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateLocationData = (locationData, userAddresses = []) => {
  const errors = {};

  if (!locationData.type) {
    return { isValid: false, errors: { type: "Type de recherche requis" } };
  }

  // Validation du rayon
  if (locationData.radiusKm) {
    const radiusValidation = validateRadius(locationData.radiusKm);
    if (!radiusValidation.isValid) {
      errors.radius = radiusValidation.error;
    }
  } else {
    errors.radius = "Le rayon est requis";
  }

  // Validation spécifique selon le type de recherche
  if (locationData.type === "city") {
    // Validation du code postal
    if (locationData.postalCode) {
      const postalValidation = validatePostalCode(locationData.postalCode);
      if (!postalValidation.isValid) {
        errors.postalCode = postalValidation.error;
      }
    } else {
      errors.postalCode = "Le code postal est requis";
    }

    // Validation de la ville
    if (!locationData.city) {
      errors.city = "La ville est requise";
    }
  } else if (locationData.type === "myAddress") {
    // Validation de l'adresse sélectionnée
    if (!locationData.selectedAddress) {
      errors.selectedAddress = "Une adresse doit être sélectionnée";
    } else {
      const selectedId = parseInt(locationData.selectedAddress);
      const addressExists = userAddresses.some(addr => addr.id === selectedId || addr.addressId === selectedId);
      if (!addressExists) {
        errors.selectedAddress = "L'adresse sélectionnée n'est pas valide";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valide les critères de recherche globaux
 * @param {object} searchCriteria - Les critères de recherche
 * @param {Array} userAddresses - Les adresses de l'utilisateur
 * @returns {object} - { isValid: boolean, errors: object, warnings: Array }
 */
export const validateSearchCriteria = (searchCriteria, userAddresses = []) => {
  const errors = {};
  const warnings = [];

  const {
    skillType,
    startDate,
    endDate,
    useEndDate,
    location
  } = searchCriteria;

  // Vérifier qu'au moins un critère est spécifié
  const hasSkillType = skillType && skillType !== "";
  const hasStartDate = startDate && startDate !== "";
  const hasEndDate = useEndDate && endDate && endDate !== "";
  const hasLocation = location && location.type && location.isValid;

  if (!hasSkillType && !hasStartDate && !hasEndDate && !hasLocation) {
    errors.global = "Veuillez spécifier au moins un critère de recherche";
  }

  // Validation des dates
  if (hasStartDate || hasEndDate) {
    const dateValidation = validateMissionDates(
      hasStartDate ? startDate : null,
      hasEndDate ? endDate : null
    );
    
    if (!dateValidation.isValid) {
      Object.assign(errors, dateValidation.errors);
    }
  }

  // Validation de la localisation
  if (location && location.type) {
    const locationValidation = validateLocationData(location, userAddresses);
    if (!locationValidation.isValid) {
      errors.location = locationValidation.errors;
    }
  }

  // Avertissements
  if (hasSkillType && !hasStartDate && !hasEndDate) {
    warnings.push("Ajouter des dates peut améliorer la pertinence des résultats");
  }

  if ((hasStartDate || hasEndDate) && !hasLocation) {
    warnings.push("Ajouter une localisation peut réduire les résultats");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};

/**
 * Valide les IDs de types de compétences
 * @param {Array} skillTypeIds - Liste des IDs de compétences
 * @param {Array} availableSkillTypes - Liste des types de compétences disponibles
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateSkillTypeIds = (skillTypeIds, availableSkillTypes = []) => {
  if (!Array.isArray(skillTypeIds)) {
    return { isValid: false, error: "Les IDs de compétences doivent être un tableau" };
  }

  if (skillTypeIds.length === 0) {
    return { isValid: true, error: null }; // Vide est accepté
  }

  // Vérifier que tous les IDs sont des nombres valides
  const invalidIds = skillTypeIds.filter(id => isNaN(Number(id)) || Number(id) <= 0);
  if (invalidIds.length > 0) {
    return { isValid: false, error: "Tous les IDs de compétences doivent être des nombres positifs" };
  }

  // Si on a la liste des compétences disponibles, vérifier l'existence
  if (availableSkillTypes.length > 0) {
    const availableIds = availableSkillTypes.map(skill => skill.idSkillType);
    const unknownIds = skillTypeIds.filter(id => !availableIds.includes(Number(id)));
    
    if (unknownIds.length > 0) {
      return { isValid: false, error: `Types de compétences non trouvés: ${unknownIds.join(', ')}` };
    }
  }

  return { isValid: true, error: null };
};

/**
 * Nettoie et formate les critères de recherche pour l'envoi au backend
 * @param {object} filters - Les filtres du formulaire
 * @param {Array} userAddresses - Les adresses de l'utilisateur
 * @returns {object} - Les critères formatés pour l'API
 */
export const formatSearchCriteriaForAPI = (filters, userAddresses = []) => {
  const {
    skillType,
    startDate,
    endDate,
    useEndDate,
    location
  } = filters;

  const criteria = {
    skillTypeIds: [],
    startDate: null,
    endDate: null,
    postalCode: null,
    radiusKm: null,
    userLatitude: null,
    userLongitude: null
  };

  // Formatage des compétences
  if (skillType && skillType !== "") {
    criteria.skillTypeIds = [parseInt(skillType)];
  }

  // Formatage des dates
  if (startDate) {
    criteria.startDate = startDate;
  }

  if (useEndDate && endDate) {
    criteria.endDate = endDate;
  } else if (startDate && !useEndDate) {
    // Si pas de date de fin spécifiée, utiliser la date de début comme date de fin
    criteria.endDate = startDate;
  }

  // Formatage de la localisation
  if (location && location.isValid) {
    criteria.radiusKm = parseInt(location.radiusKm);

    if (location.type === "city") {
      criteria.postalCode = location.postalCode;
    } else if (location.type === "myAddress") {
      const selectedAddr = userAddresses.find(
        addr => (addr.id || addr.addressId) === parseInt(location.selectedAddress)
      );
      if (selectedAddr) {
        criteria.userLatitude = selectedAddr.latitude;
        criteria.userLongitude = selectedAddr.longitude;
      }
    }
  }

  return criteria;
};

/**
 * Valide la réponse de l'API de géocodage
 * @param {object} geoResponse - Réponse de l'API de géocodage
 * @returns {object} - { isValid: boolean, error: string|null, data: object|null }
 */
export const validateGeocodingResponse = (geoResponse) => {
  if (!geoResponse) {
    return { isValid: false, error: "Aucune réponse de l'API de géocodage", data: null };
  }

  if (!geoResponse.features || !Array.isArray(geoResponse.features)) {
    return { isValid: false, error: "Format de réponse invalide", data: null };
  }

  if (geoResponse.features.length === 0) {
    return { isValid: false, error: "Aucun résultat trouvé pour cette localisation", data: null };
  }

  const feature = geoResponse.features[0];
  if (!feature.geometry || !feature.geometry.coordinates) {
    return { isValid: false, error: "Coordonnées manquantes dans la réponse", data: null };
  }

  const [longitude, latitude] = feature.geometry.coordinates;
  if (isNaN(latitude) || isNaN(longitude)) {
    return { isValid: false, error: "Coordonnées invalides", data: null };
  }

  return {
    isValid: true,
    error: null,
    data: {
      latitude,
      longitude,
      city: feature.properties?.city || feature.properties?.name,
      postalCode: feature.properties?.postcode
    }
  };
};
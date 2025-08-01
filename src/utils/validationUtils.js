export const verifyAddressExists = async (address) => {
  const query = `${address.streetNumber} ${address.streetName}, ${address.postalCode} ${address.city}`;
  try {
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`);
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return "Adresse non reconnue. Veuillez vérifier les informations saisies.";
    }

    const result = data.features[0];
    const props = result.properties;

    const expectedLabel = `${address.streetNumber} ${address.streetName} ${address.postalCode} ${address.city}`.toLowerCase().replace(/\s+/g, ' ').trim();
    const returnedLabel = props.label.toLowerCase().replace(/\s+/g, ' ').trim();

    if (returnedLabel === expectedLabel) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erreur de vérification d'adresse :", error);
    return "Erreur lors de la vérification de l'adresse.";
  }
};

export const validateEmail = (email, maxLength = 250) => {
  if (!email) {
    return "L'email est requis.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Format d'email invalide.";
  }
  if (email.length > maxLength) {
    return `L'email ne doit pas dépasser ${maxLength} caractères.`;
  }
  return null;
};

export const validatePassword = (password, maxLength = 120) => {
  if (!password) {
    return "Le mot de passe est requis.";
  }
  if (password.length > maxLength) {
    return `Le mot de passe ne doit pas dépasser ${maxLength} caractères.`;
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "La confirmation du mot de passe est requise.";
  }
  if (password !== confirmPassword) {
    return "Les mots de passe ne correspondent pas.";
  }
  return null;
};

export const validateFrenchPhone = (phone) => {
  if (!phone) {
    return "Le numéro de téléphone est requis.";
  }
  
  const cleanPhone = phone.replace(/\s/g, '');
  if (!/^0[1-9][0-9]{8}$/.test(cleanPhone)) {
    return "Format de téléphone français invalide (10 chiffres commençant par 0).";
  }
  return null;
};

export const validateRequiredText = (value, fieldName, maxLength) => {
  if (!value) {
    return `${fieldName} est requis.`;
  }
  if (maxLength && value.length > maxLength) {
    return `${fieldName} ne doit pas dépasser ${maxLength} caractères.`;
  }
  return null;
};

export const validateDate = (date, fieldName) => {
  if (!date) {
    return `${fieldName} est requise.`;
  }

  const birthDate = new Date(date);
  const today = new Date();

  const ageDiff = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  const is18OrOlder =
    ageDiff > 18 ||
    (ageDiff === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

  if (!is18OrOlder) {
    return "Vous devez avoir au moins 18 ans pour vous inscrire.";
  }

  return null;
};

export const validatePostalCode = (postalCode) => {
  if (!postalCode) {
    return "Le code postal est requis.";
  }
  if (!/^\d{5}$/.test(postalCode)) {
    return "Le code postal doit contenir exactement 5 chiffres (métropole et Corse).";
  }
  return null;
};

export const validateRNA = (rna) => {
  if (!rna) {
    return "Le numéro RNA est requis.";
  }
  if (!/^W\d{9}$/.test(rna)) {
    return "Le format du RNA doit être 'W' suivi de 9 chiffres.";
  }
  return null;
};

export const validateAddress = (address) => {
  const addressErrors = {};
  
  const streetNumberError = validateRequiredText(address.streetNumber, "Le numéro de rue", 10);
  if (streetNumberError) addressErrors["streetNumber"] = streetNumberError;
   
  const streetNameError = validateRequiredText(address.streetName, "Le nom de la rue", 60);
  if (streetNameError) addressErrors["streetName"] = streetNameError;
  
  const postalCodeError = validatePostalCode(address.postalCode);
  if (postalCodeError) addressErrors["postalCode"] = postalCodeError;
  
  const cityError = validateRequiredText(address.city, "La ville", 50);
  if (cityError) addressErrors["city"] = cityError;
  
  return addressErrors;
};

export const validateMissionDates = (startDate, endDate) => {
  const errors = {};
  
  if (!startDate) {
    errors.startDate = "La date de début est requise.";
  }
  if (!endDate) {
    errors.endDate = "La date de fin est requise.";
  }
  
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.startDate = "La date de début doit être antérieure à la date de fin.";
    errors.endDate = "La date de fin doit être postérieure à la date de début.";
  }
  
  return errors;
}
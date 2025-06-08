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


    console.log(expectedLabel);
    console.log(returnedLabel);


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

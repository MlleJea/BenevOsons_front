export const verifyAddressExists = async (address) => {
    const query = `${address.streetNumber} ${address.streetName}, ${address.postalCode} ${address.city}`;
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`);
    const data = await response.json();
    return data.features && data.features.length > 0;
  };
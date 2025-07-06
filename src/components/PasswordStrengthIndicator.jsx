import React from "react";

const PasswordStrengthIndicator = ({ password }) => {
  const criteria = [
    {
      text: "Au moins 8 caractères",
      test: (pwd) => pwd.length >= 8
    },
    {
      text: "Au moins une majuscule",
      test: (pwd) => /.*[A-Z].*/.test(pwd)
    },
    {
      text: "Au moins un chiffre",
      test: (pwd) => /.*[0-9].*/.test(pwd)
    }
  ];

  // N'afficher que si l'utilisateur a commencé à taper
  if (!password) return null;

  return (
    <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
      {criteria.map((criterion, index) => {
        const isValid = criterion.test(password);
        return (
          <div key={index} style={{ 
            color: isValid ? '#28a745' : '#dc3545',
            marginBottom: '4px'
          }}>
            <i className={`fa ${isValid ? 'fa-check' : 'fa-times'}`} 
               style={{ marginRight: '8px', width: '12px' }}>
            </i>
            {criterion.text}
          </div>
        );
      })}
    </div>
  );
};

export default PasswordStrengthIndicator;
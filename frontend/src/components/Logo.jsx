import React from 'react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_buildrs-app/artifacts/2axsy0ty_Logo%20Buildrs%20%284%29.png';

/**
 * BuildrsLogo — utilise le vrai logo de la marque
 * @param {number} height - hauteur en px (défaut: 28)
 * @param {string} className - classes CSS additionnelles
 */
export default function BuildrsLogo({ height = 28, className = '' }) {
  return (
    <img
      src={LOGO_URL}
      alt="Buildrs"
      height={height}
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      className={className}
    />
  );
}

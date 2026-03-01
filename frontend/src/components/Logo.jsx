import React from 'react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_buildrs-app/artifacts/l0v9g12h_Logo%20Buildrs%20%28500%20x%20200%20px%29.png';

/**
 * BuildrsLogo — logo officiel Buildrs (500×200px, fond noir)
 * @param {number} height - hauteur en px (défaut: 30)
 */
export default function BuildrsLogo({ height = 30, className = '' }) {
  return (
    <img
      src={LOGO_URL}
      alt="Buildrs"
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      className={className}
    />
  );
}

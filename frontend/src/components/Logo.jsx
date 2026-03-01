import React from 'react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_buildrs-app/artifacts/2axsy0ty_Logo%20Buildrs%20%284%29.png';

// The 1080×1080 image has the logo content roughly at:
//   Y: 35% → 65%  (30% of image height)
//   X: 11% → 89%  (78% of image width)
// We crop to show only the logo area.

export default function BuildrsLogo({ contentHeight = 22, className = '' }) {
  const imgSize   = Math.round(contentHeight / 0.30);   // full image display size
  const marginTop = -Math.round(imgSize * 0.35);        // crop top black padding

  return (
    <div
      style={{ overflow: 'hidden', height: `${contentHeight}px`, width: `${imgSize}px`, flexShrink: 0 }}
      className={className}
    >
      <img
        src={LOGO_URL}
        alt="Buildrs"
        style={{ width: `${imgSize}px`, height: `${imgSize}px`, marginTop: `${marginTop}px`, display: 'block' }}
      />
    </div>
  );
}

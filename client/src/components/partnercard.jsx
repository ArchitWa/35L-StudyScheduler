import React from 'react';
import './partnercard.css';

// --- Partner Card Component ---
const PartnerCard = ({ firstName, lastInitial, profileImageUrl, onNameClick }) => {
  const displayName = `${firstName} ${lastInitial}.`;

  return (
    <div className="partner-card">
      <div className="partner-card-image-wrap">
        <img
          className="partner-card-image"
          src={profileImageUrl}
          alt={`${displayName} profile`}
        />
      </div>
      <button
        type="button"
        className="partner-card-name"
        onClick={onNameClick}
      >
        {displayName}
      </button>
      <div className="partner-card-subtext">Potential study partner</div>
    </div>
  );
};

export default PartnerCard;

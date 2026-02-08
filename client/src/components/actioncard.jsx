import React from 'react';
import './actioncard.css';

const ActionCard = ({ actionLabel, iconUrl, onAction }) => {
  return (
    <button type="button" className="action-card" onClick={onAction}>
      <div className="action-card-icon-wrap">
        <img className="action-card-icon" src={iconUrl} alt={`${actionLabel} icon`} />
      </div>
      <div className="action-card-label">{actionLabel}</div>
    </button>
  );
};

export default ActionCard;

import React from 'react';
import { useTranslation } from 'react-i18next';
import './TitleBar.module.css';

export const TitleBar: React.FC = () => {
  const { t } = useTranslation('common');

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximize();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  };

  return (
    <div className="title-bar">
      <div className="title-bar-drag-region">
        <div className="title-bar-title">
          Artif Visio
        </div>
      </div>
      <div className="title-bar-controls">
        <button 
          className="title-bar-button minimize" 
          onClick={handleMinimize}
          title={t('minimize')}
        >
          ─
        </button>
        <button 
          className="title-bar-button maximize" 
          onClick={handleMaximize}
          title={t('maximize')}
        >
          □
        </button>
        <button 
          className="title-bar-button close" 
          onClick={handleClose}
          title={t('close')}
        >
          ×
        </button>
      </div>
    </div>
  );
};
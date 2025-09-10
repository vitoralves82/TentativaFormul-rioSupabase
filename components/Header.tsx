import React from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  onViewChange: (viewMode: ViewMode) => void;
  isRespondentPreviewable: boolean;
}

const Header: React.FC<HeaderProps> = ({ viewMode, onViewChange, isRespondentPreviewable }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-emerald-700">EnvironPact Formulário</h1>
          </div>
          <div className="flex items-center space-x-2 p-1 bg-gray-200 rounded-lg">
            <button
              onClick={() => onViewChange('admin')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                viewMode === 'admin' ? 'bg-white text-emerald-700 shadow' : 'text-gray-600 hover:bg-gray-300'
              }`}
            >
              Visão do Administrador
            </button>
            <button
              onClick={() => onViewChange('respondent')}
              disabled={!isRespondentPreviewable}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                viewMode === 'respondent' ? 'bg-white text-emerald-700 shadow' : 'text-gray-600 hover:bg-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Visão do Respondente
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
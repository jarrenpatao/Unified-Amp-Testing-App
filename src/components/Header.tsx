import React from 'react';
import { Zap, TestTube } from 'lucide-react';

interface HeaderProps {
  isDarkTheme?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isDarkTheme = false }) => {
  const headerClasses = isDarkTheme 
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-200 text-gray-900';

  const subtitleClasses = isDarkTheme
    ? 'text-gray-300'
    : 'text-gray-600';

  return (
    <header className={`border-b px-6 py-4 transition-colors duration-500 ${headerClasses}`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-blue-600" />
          <TestTube className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Amplitude Experiment Testing</h1>
          <p className={`text-sm ${subtitleClasses}`}>HTTP API Event Testing & Variant Management</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
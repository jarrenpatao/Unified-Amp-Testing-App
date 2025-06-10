import React from 'react';
import { Settings, FlaskRound as Flask, BarChart3, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkTheme?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange, isDarkTheme = false }) => {
  const sections = [
    {
      id: 'setup',
      name: 'Setup',
      icon: Settings,
      description: 'Configure Amplitude SDK'
    },
    {
      id: 'experiments',
      name: 'Experiments',
      icon: Flask,
      description: 'Flags & Variant Testing'
    },
    {
      id: 'analytics',
      name: 'Analytics & Results',
      icon: BarChart3,
      description: 'Event Tracking & Test Results'
    }
  ];

  const navClasses = isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textClasses = isDarkTheme ? 'text-gray-300' : 'text-gray-600';

  return (
    <nav className={`w-64 min-h-screen border-r ${navClasses} p-6`}>
      <div className="mb-8">
        <h1 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Amplitude Testing
        </h1>
        <p className={`text-sm mt-1 ${textClasses}`}>
          Unified SDK
        </p>
      </div>

      <div className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-colors text-left ${
                isActive
                  ? isDarkTheme
                    ? 'bg-blue-900/50 text-blue-200 border border-blue-700'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                  : isDarkTheme
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-5 w-5 mt-0.5 ${isActive ? 'text-current' : ''}`} />
              <div>
                <div className="font-medium">{section.name}</div>
                <div className={`text-xs ${isActive ? 'text-current opacity-80' : textClasses}`}>
                  {section.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className={`text-xs ${textClasses}`}>
          <p className="font-medium mb-1">Quick Guide:</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Configure SDK in Setup</li>
            <li>Set up experiments/flags</li>
            <li>Track events & view results</li>
          </ol>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
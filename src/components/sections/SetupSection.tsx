import React from 'react';
import ConfigurationPanel from '../ConfigurationPanel';

interface SetupSectionProps {
  onConfigUpdate: (config: { apiKey: string; userId: string; deviceId: string }) => void;
  isDarkTheme: boolean;
  isInitialized: boolean;
}

const SetupSection: React.FC<SetupSectionProps> = ({ onConfigUpdate, isDarkTheme, isInitialized }) => {
  const cardClasses = isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          SDK Setup
        </h2>
        <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          Configure your Amplitude SDK with API key and user information to get started.
        </p>
      </div>

      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <ConfigurationPanel onConfigUpdate={onConfigUpdate} isDarkTheme={isDarkTheme} />
      </div>

      {isInitialized && (
        <div className={`rounded-lg border p-4 ${
          isDarkTheme ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={`text-sm font-medium ${
              isDarkTheme ? 'text-green-300' : 'text-green-800'
            }`}>
              ✅ Amplitude SDK initialized successfully! You can now proceed to Experiments or Analytics.
            </span>
          </div>
        </div>
      )}

      <div className={`rounded-lg border p-4 ${
        isDarkTheme ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${isDarkTheme ? 'text-blue-200' : 'text-blue-800'}`}>
          💡 Getting Started
        </h3>
        <ul className={`text-sm space-y-1 ${isDarkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
          <li>• Enter your Amplitude project's API key</li>
          <li>• Set a User ID for testing (e.g., "test-user-123")</li>
          <li>• Device ID will be auto-generated if not provided</li>
          <li>• Your configuration will be saved locally for future sessions</li>
        </ul>
      </div>
    </div>
  );
};

export default SetupSection; 
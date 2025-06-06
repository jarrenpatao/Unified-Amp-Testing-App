import React, { useState, useEffect } from 'react';
import { Settings, Key, User, RotateCcw } from 'lucide-react';
import { useAmplitudeConfig } from '../hooks/useLocalStorage';

interface ConfigurationPanelProps {
  onConfigUpdate: (config: { apiKey: string; userId: string; deviceId: string }) => void;
  isDarkTheme?: boolean;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ onConfigUpdate, isDarkTheme = false }) => {
  const [savedConfig, setSavedConfig] = useAmplitudeConfig();
  const [config, setConfig] = useState(savedConfig);

  // Sync with saved config when it changes
  useEffect(() => {
    setConfig(savedConfig);
  }, [savedConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedConfig(config); // Save to local storage
    onConfigUpdate(config);
  };

  const handleChange = (field: keyof typeof config, value: string) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
  };

  const handleClearSavedData = () => {
    const emptyConfig = { apiKey: '', userId: '', deviceId: '' };
    setSavedConfig(emptyConfig);
    setConfig(emptyConfig);
  };

  const textClasses = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const labelClasses = isDarkTheme ? 'text-gray-200' : 'text-gray-700';
  const inputClasses = isDarkTheme 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-transparent';

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Settings className={`h-5 w-5 ${textClasses}`} />
          <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Configuration</h2>
          {(savedConfig.apiKey || savedConfig.userId || savedConfig.deviceId) && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Auto-filled
            </span>
          )}
        </div>
        {(savedConfig.apiKey || savedConfig.userId || savedConfig.deviceId) && (
          <button
            type="button"
            onClick={handleClearSavedData}
            className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-md transition-colors ${
              isDarkTheme 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Clear saved data"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className={`flex items-center space-x-2 text-sm font-medium mb-2 ${labelClasses}`}>
            <Key className="h-4 w-4" />
            <span>API Key</span>
          </label>
          <input
            type="text"
            id="apiKey"
            value={config.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
            placeholder="Enter your Amplitude API key"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="userId" className={`flex items-center space-x-2 text-sm font-medium mb-2 ${labelClasses}`}>
              <User className="h-4 w-4" />
              <span>User ID</span>
            </label>
            <input
              type="text"
              id="userId"
              value={config.userId}
              onChange={(e) => handleChange('userId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
              placeholder="test-user-123"
            />
          </div>

          <div>
            <label htmlFor="deviceId" className={`flex items-center space-x-2 text-sm font-medium mb-2 ${labelClasses}`}>
              <Settings className="h-4 w-4" />
              <span>Device ID</span>
            </label>
            <input
              type="text"
              id="deviceId"
              value={config.deviceId}
              onChange={(e) => handleChange('deviceId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
              placeholder="device-123"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Initialize Amplitude
        </button>
      </form>
    </>
  );
};

export default ConfigurationPanel;
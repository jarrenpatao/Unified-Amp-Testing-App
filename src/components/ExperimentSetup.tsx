import React, { useState, useEffect } from 'react';
import { FlaskRound as Flask, Key, Globe, Flag, RotateCcw } from 'lucide-react';
import { ExperimentConfig } from '../types/amplitude';
import { useExperimentConfig } from '../hooks/useLocalStorage';

interface ExperimentSetupProps {
  onExperimentConfig: (config: ExperimentConfig) => void;
  isConfigured: boolean;
  isDarkTheme?: boolean;
}

const ExperimentSetup: React.FC<ExperimentSetupProps> = ({ onExperimentConfig, isConfigured, isDarkTheme = false }) => {
  const [savedConfig, setSavedConfig] = useExperimentConfig();
  const [config, setConfig] = useState<ExperimentConfig>(savedConfig);
  const [flagKeyInput, setFlagKeyInput] = useState('');

  // Sync with saved config when it changes
  useEffect(() => {
    setConfig(savedConfig);
  }, [savedConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.deploymentKey && config.flagKeys.length > 0) {
      setSavedConfig(config); // Save to local storage
      onExperimentConfig(config);
    }
  };

  const handleClearSavedData = () => {
    const emptyConfig: ExperimentConfig = {
      deploymentKey: '',
      serverUrl: 'https://api.lab.amplitude.com',
      flagKeys: [],
      environment: 'development',
    };
    setSavedConfig(emptyConfig);
    setConfig(emptyConfig);
  };

  const addFlagKey = () => {
    if (flagKeyInput.trim() && !config.flagKeys.includes(flagKeyInput.trim())) {
      setConfig(prev => ({
        ...prev,
        flagKeys: [...prev.flagKeys, flagKeyInput.trim()]
      }));
      setFlagKeyInput('');
    }
  };

  const removeFlagKey = (key: string) => {
    setConfig(prev => ({
      ...prev,
      flagKeys: prev.flagKeys.filter(k => k !== key)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFlagKey();
    }
  };

  const textClasses = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const labelClasses = isDarkTheme ? 'text-gray-200' : 'text-gray-700';
  const inputClasses = isDarkTheme 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-400 focus:border-purple-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-transparent';

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Flask className={`h-5 w-5 ${textClasses}`} />
          <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Experiment Configuration</h2>
          {isConfigured && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Connected
            </span>
          )}
          {(savedConfig.deploymentKey || savedConfig.flagKeys.length > 0) && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
              Auto-filled
            </span>
          )}
        </div>
        {(savedConfig.deploymentKey || savedConfig.flagKeys.length > 0) && (
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
          <label htmlFor="deploymentKey" className={`flex items-center space-x-2 text-sm font-medium mb-2 ${labelClasses}`}>
            <Key className="h-4 w-4" />
            <span>Deployment Key *</span>
          </label>
          <input
            type="text"
            id="deploymentKey"
            value={config.deploymentKey}
            onChange={(e) => setConfig(prev => ({ ...prev, deploymentKey: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
            placeholder="client-xxxxx"
            required
          />
          <p className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            Find this in your Amplitude Experiment project settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="environment" className={`flex items-center space-x-2 text-sm font-medium mb-2 ${labelClasses}`}>
              <Globe className="h-4 w-4" />
              <span>Environment</span>
            </label>
            <select
              id="environment"
              value={config.environment}
              onChange={(e) => setConfig(prev => ({ ...prev, environment: e.target.value as any }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>

          <div>
            <label htmlFor="serverUrl" className={`block text-sm font-medium mb-2 ${labelClasses}`}>
              Server URL (Optional)
            </label>
            <input
              type="url"
              id="serverUrl"
              value={config.serverUrl}
              onChange={(e) => setConfig(prev => ({ ...prev, serverUrl: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
              placeholder="https://api.lab.amplitude.com"
            />
          </div>
        </div>

        <div>
          <label className={`flex items-center space-x-2 text-sm font-medium mb-2 ${labelClasses}`}>
            <Flag className="h-4 w-4" />
            <span>Flag Keys *</span>
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={flagKeyInput}
              onChange={(e) => setFlagKeyInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
              placeholder="Enter flag key (e.g., theme-toggle-test)"
            />
            <button
              type="button"
              onClick={addFlagKey}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              Add
            </button>
          </div>
          
          {config.flagKeys.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {config.flagKeys.map((key) => (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {key}
                  <button
                    type="button"
                    onClick={() => removeFlagKey(key)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            Add the flag keys you want to test. Try "theme-toggle-test" to see visual changes based on variants.
          </p>
        </div>

        <button
          type="submit"
          disabled={!config.deploymentKey || config.flagKeys.length === 0}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConfigured ? 'Update' : 'Connect'} Experiment
        </button>
      </form>
    </>
  );
};

export default ExperimentSetup;
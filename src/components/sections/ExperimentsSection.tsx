import React from 'react';
import ExperimentSetup from '../ExperimentSetup';
import FlagViewer from '../FlagViewer';
import { ExperimentConfig, ExperimentFlag } from '../../types/amplitude';

interface ExperimentsSectionProps {
  onExperimentConfig: (config: ExperimentConfig) => void;
  isConfigured: boolean;
  isDarkTheme: boolean;
  isInitialized: boolean;
  experimentConfig: ExperimentConfig | null;
  activeFlags: ExperimentFlag[];
  onRefreshFlags: () => void;
  isFetchingFlags: boolean;
  onAssignLightMode: () => void;
  onAssignDarkMode: () => void;
}

const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({
  onExperimentConfig,
  isConfigured,
  isDarkTheme,
  isInitialized,
  experimentConfig,
  activeFlags,
  onRefreshFlags,
  isFetchingFlags,
  onAssignLightMode,
  onAssignDarkMode,
}) => {
  const cardClasses = isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Experiments
          </h2>
          <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Set up experiment flags and test different variants.
          </p>
        </div>

        <div className={`rounded-lg border p-6 text-center ${
          isDarkTheme ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className={`text-lg mb-2 ${isDarkTheme ? 'text-yellow-200' : 'text-yellow-800'}`}>
            ⚠️ SDK Not Initialized
          </div>
          <p className={`${isDarkTheme ? 'text-yellow-300' : 'text-yellow-700'}`}>
            Please configure the Amplitude SDK in the Setup section first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Experiments
        </h2>
        <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          Configure experiment flags, assign variants, and test different experiences.
        </p>
      </div>

      {/* Experiment Setup */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <ExperimentSetup 
          onExperimentConfig={onExperimentConfig}
          isConfigured={isConfigured}
          isDarkTheme={isDarkTheme}
        />
      </div>

      {/* Manual Variant Assignment CTAs */}
      {experimentConfig && (
        <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
          <div className="flex items-center space-x-2 mb-4">
            <span className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              🎨 Manual Variant Assignment
            </span>
          </div>
          <p className={`text-sm mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Manually assign variants to test theme changes. <strong>Treatment = Dark Mode</strong>, <strong>Control = Light Mode</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={onAssignLightMode}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors border"
            >
              <span>☀️</span>
              <span>Assign Light Mode (Control)</span>
            </button>
            <button
              onClick={onAssignDarkMode}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors border border-gray-600"
            >
              <span>🌙</span>
              <span>Assign Dark Mode (Treatment)</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Flags */}
      {experimentConfig && (
        <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
          <FlagViewer 
            flags={activeFlags}
            onRefresh={onRefreshFlags}
            isLoading={isFetchingFlags}
            isDarkTheme={isDarkTheme}
          />
        </div>
      )}

      {/* Experiment Guide */}
      <div className={`rounded-lg border p-4 ${
        isDarkTheme ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${isDarkTheme ? 'text-purple-200' : 'text-purple-800'}`}>
          🧪 Experiment Testing Guide
        </h3>
        <ul className={`text-sm space-y-1 ${isDarkTheme ? 'text-purple-300' : 'text-purple-700'}`}>
          <li>• Configure your deployment key from Amplitude Experiment</li>
          <li>• Add flag keys you want to test (e.g., "theme-toggle-test")</li>
          <li>• Use the assignment buttons to manually trigger variants</li>
          <li>• Check Analytics section to see exposure/assignment events</li>
        </ul>
      </div>
    </div>
  );
};

export default ExperimentsSection; 
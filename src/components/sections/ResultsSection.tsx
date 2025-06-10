import React from 'react';
import TestResults from '../TestResults';
import { TestResult, ExperimentFlag } from '../../types/amplitude';

interface ResultsSectionProps {
  testResults: TestResult[];
  onClearResults: () => void;
  isDarkTheme: boolean;
  isInitialized: boolean;
  activeFlags: ExperimentFlag[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  testResults,
  onClearResults,
  isDarkTheme,
  isInitialized,
  activeFlags,
}) => {
  const cardClasses = isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Results
          </h2>
          <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Monitor test results and track your events.
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
          Results & Monitoring
        </h2>
        <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          View all test results, event tracking, and system status.
        </p>
      </div>

      {/* Status Overview */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          📊 System Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${
            isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              SDK Status
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                Initialized
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              Active Flags
            </div>
            <div className={`text-2xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {activeFlags.length}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              Events Sent
            </div>
            <div className={`text-2xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {testResults.length}
            </div>
          </div>
        </div>

        {activeFlags.length > 0 && (
          <div className="mt-4">
            <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              Current Flag States:
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFlags.map((flag) => (
                <span
                  key={flag.key}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    flag.variant === 'treatment'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {flag.key}: {flag.variant}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test Results */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <TestResults 
          results={testResults}
          onClearResults={onClearResults}
          isDarkTheme={isDarkTheme}
        />
      </div>

      {/* Results Guide */}
      <div className={`rounded-lg border p-4 ${
        isDarkTheme ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${isDarkTheme ? 'text-orange-200' : 'text-orange-800'}`}>
          📈 Results Monitoring Guide
        </h3>
        <ul className={`text-sm space-y-1 ${isDarkTheme ? 'text-orange-300' : 'text-orange-700'}`}>
          <li>• All events sent through the app are displayed here</li>
          <li>• Successful events show response data from Amplitude</li>
          <li>• Failed events include error information for debugging</li>
          <li>• Experiment exposure and assignment events are tracked separately</li>
          <li>• Use this to validate your tracking implementation</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsSection; 
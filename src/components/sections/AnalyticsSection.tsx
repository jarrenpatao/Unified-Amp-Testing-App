import React from 'react';
import EventForm from '../EventForm';
import TestResults from '../TestResults';
import { AmplitudeEvent, TestResult, ExperimentFlag, UserContext } from '../../types/amplitude';

interface AnalyticsSectionProps {
  onSendEvent: (event: AmplitudeEvent) => void;
  isLoading: boolean;
  isDarkTheme: boolean;
  isInitialized: boolean;
  hasExperiment: boolean;
  testResults: TestResult[];
  onClearResults: () => void;
  activeFlags: ExperimentFlag[];
  userContext: UserContext;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  onSendEvent,
  isLoading,
  isDarkTheme,
  isInitialized,
  hasExperiment,
  testResults,
  onClearResults,
  activeFlags,
  userContext,
}) => {
  const cardClasses = isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Analytics & Results
          </h2>
          <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Track events and monitor test results.
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
          Analytics & Results
        </h2>
        <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          Track events and monitor your testing results in real-time.
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
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                  }`}
                >
                  {flag.key}: {flag.variant}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Event Tracking */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <EventForm 
          onSendEvent={onSendEvent} 
          isLoading={isLoading} 
          isDarkTheme={isDarkTheme}
          userContext={userContext}
        />
      </div>

      {/* Test Results */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <TestResults 
          results={testResults}
          onClearResults={onClearResults}
          isDarkTheme={isDarkTheme}
        />
      </div>

      {/* Analytics Guide */}
      <div className={`rounded-lg border p-4 ${
        isDarkTheme ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${isDarkTheme ? 'text-green-200' : 'text-green-800'}`}>
          📊 Analytics & Results Guide
        </h3>
        <ul className={`text-sm space-y-1 ${isDarkTheme ? 'text-green-300' : 'text-green-700'}`}>
          <li>• Send custom events to test your tracking implementation</li>
          <li>• All events are logged with success/failure status below</li>
          <li>• Successful events show response data from Amplitude</li>
          <li>• Failed events include error information for debugging</li>
          {hasExperiment && <li>• Events automatically include active experiment flag data</li>}
          <li>• Use results to validate your integration works correctly</li>
        </ul>
      </div>

      {hasExperiment && (
        <div className={`rounded-lg border p-4 ${
          isDarkTheme ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className={`font-semibold ${isDarkTheme ? 'text-blue-200' : 'text-blue-800'}`}>
              🧪 Experiment Integration Active
            </span>
          </div>
          <p className={`text-sm ${isDarkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
            Your events will automatically include experiment flag data and exposure tracking.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSection; 
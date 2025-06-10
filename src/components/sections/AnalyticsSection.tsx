import React from 'react';
import UserContextManager from '../UserContextManager';
import EventForm from '../EventForm';
import { AmplitudeEvent, UserContext } from '../../types/amplitude';

interface AnalyticsSectionProps {
  onUserContextUpdate: (context: UserContext) => void;
  currentContext: UserContext;
  onSendEvent: (event: AmplitudeEvent) => void;
  isLoading: boolean;
  isDarkTheme: boolean;
  isInitialized: boolean;
  hasExperiment: boolean;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  onUserContextUpdate,
  currentContext,
  onSendEvent,
  isLoading,
  isDarkTheme,
  isInitialized,
  hasExperiment,
}) => {
  const cardClasses = isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Analytics
          </h2>
          <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Test event tracking and user context management.
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
          Analytics
        </h2>
        <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage user context and test event tracking functionality.
        </p>
      </div>

      {/* User Context Manager */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <UserContextManager
          onUserContextUpdate={onUserContextUpdate}
          currentContext={currentContext}
          isDarkTheme={isDarkTheme}
        />
      </div>

      {/* Event Tracking */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <EventForm 
          onSendEvent={onSendEvent} 
          isLoading={isLoading} 
          isDarkTheme={isDarkTheme} 
        />
      </div>

      {/* Analytics Guide */}
      <div className={`rounded-lg border p-4 ${
        isDarkTheme ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${isDarkTheme ? 'text-green-200' : 'text-green-800'}`}>
          📊 Analytics Testing Guide
        </h3>
        <ul className={`text-sm space-y-1 ${isDarkTheme ? 'text-green-300' : 'text-green-700'}`}>
          <li>• Update user context to test targeting and personalization</li>
          <li>• Try the theme examples to see visual changes</li>
          <li>• Send custom events to test your tracking implementation</li>
          {hasExperiment && <li>• Events will include active experiment flag data automatically</li>}
          <li>• Check the Results section to see all tracked events</li>
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
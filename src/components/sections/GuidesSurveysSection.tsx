import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Play, 
  Square, 
  RefreshCw, 
  Settings, 
  Users, 
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface GuidesSurveysSectionProps {
  isInitialized: boolean;
  isDarkTheme: boolean;
  getEngagementStatus: () => any;
  listGuidesAndSurveys: () => any[];
  showGuideOrSurvey: (key: string, stepIndex?: number) => void;
  closeAllGuidesAndSurveys: () => void;
  setUserProperties: (properties: Record<string, any>) => void;
  setSessionProperty: (key: string, value: any) => void;
}

const GuidesSurveysSection: React.FC<GuidesSurveysSectionProps> = ({
  isInitialized,
  isDarkTheme,
  getEngagementStatus,
  listGuidesAndSurveys,
  showGuideOrSurvey,
  closeAllGuidesAndSurveys,
  setUserProperties,
  setSessionProperty,
}) => {
  const [engagementStatus, setEngagementStatus] = useState<any>(null);
  const [guidesAndSurveys, setGuidesAndSurveys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProperties, setUserPropertiesState] = useState<Record<string, any>>({});
  const [sessionProperties, setSessionPropertiesState] = useState<Record<string, any>>({});
  const [newUserProperty, setNewUserProperty] = useState({ key: '', value: '' });
  const [newSessionProperty, setNewSessionProperty] = useState({ key: '', value: '' });

  const cardClasses = isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClasses = isDarkTheme 
    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500';
  const buttonClasses = isDarkTheme
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';
  const labelClasses = isDarkTheme ? 'text-gray-300' : 'text-gray-700';

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      const status = getEngagementStatus();
      const gs = listGuidesAndSurveys();
      setEngagementStatus(status);
      setGuidesAndSurveys(gs);
    } catch (error) {
      console.error('Failed to refresh Guides and Surveys status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      refreshStatus();
    }
  }, [isInitialized]);

  const handleShowGuide = (key: string) => {
    showGuideOrSurvey(key);
    setTimeout(refreshStatus, 1000); // Refresh after a short delay
  };

  const handleAddUserProperty = () => {
    if (newUserProperty.key && newUserProperty.value) {
      const updated = { ...userProperties, [newUserProperty.key]: newUserProperty.value };
      setUserPropertiesState(updated);
      setUserProperties(updated);
      setNewUserProperty({ key: '', value: '' });
    }
  };

  const handleAddSessionProperty = () => {
    if (newSessionProperty.key && newSessionProperty.value) {
      const updated = { ...sessionProperties, [newSessionProperty.key]: newSessionProperty.value };
      setSessionPropertiesState(updated);
      setSessionProperty(newSessionProperty.key, newSessionProperty.value);
      setNewSessionProperty({ key: '', value: '' });
    }
  };

  const handleRemoveUserProperty = (key: string) => {
    const updated = { ...userProperties };
    delete updated[key];
    setUserPropertiesState(updated);
    setUserProperties(updated);
  };

  const handleRemoveSessionProperty = (key: string) => {
    const updated = { ...sessionProperties };
    delete updated[key];
    setSessionPropertiesState(updated);
    // Note: There's no direct way to remove session properties, they expire with the session
  };

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Guides & Surveys
          </h2>
          <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage and test your Amplitude Guides and Surveys.
          </p>
        </div>

        <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
          <div className="flex items-center space-x-3">
            <AlertCircle className={`h-6 w-6 ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div>
              <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                SDK Not Initialized
              </h3>
              <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                Please configure Amplitude SDK first in the Setup section.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Guides & Surveys
        </h2>
        <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage and test your Amplitude Guides and Surveys. Configure user properties and session properties to control targeting.
        </p>
      </div>

      {/* Status Overview */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            📊 Engagement Status
          </h3>
          <button
            onClick={refreshStatus}
            disabled={isLoading}
            className={`px-3 py-1 rounded-md text-sm flex items-center space-x-2 ${buttonClasses} disabled:opacity-50`}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {engagementStatus ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-3 rounded-md ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {engagementStatus.stateInitialized ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    State Initialized
                  </span>
                </div>
                <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  {engagementStatus.stateInitialized ? 'Ready' : 'Not Ready'}
                </p>
              </div>

              <div className={`p-3 rounded-md ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {engagementStatus.decideSuccessful ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    Decide Successful
                  </span>
                </div>
                <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  {engagementStatus.decideSuccessful ? 'Connected' : 'Failed'}
                </p>
              </div>

              <div className={`p-3 rounded-md ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    Active Guides/Surveys
                  </span>
                </div>
                <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  {engagementStatus.num_guides_surveys || 0} available
                </p>
              </div>

              <div className={`p-3 rounded-md ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    User ID
                  </span>
                </div>
                <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  {engagementStatus.user?.user_id || 'Not set'}
                </p>
              </div>
            </div>

            {engagementStatus.user?.user_properties && Object.keys(engagementStatus.user.user_properties).length > 0 && (
              <div className={`p-3 rounded-md ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current User Properties:
                </h4>
                <pre className={`text-xs overflow-x-auto ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  {JSON.stringify(engagementStatus.user.user_properties, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
              Click "Refresh" to load engagement status
            </p>
          </div>
        )}
      </div>

      {/* User Properties Management */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          👤 User Properties
        </h3>
        <p className={`text-sm mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          Set user properties that can be used for targeting guides and surveys.
        </p>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Property key"
              value={newUserProperty.key}
              onChange={(e) => setNewUserProperty(prev => ({ ...prev, key: e.target.value }))}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
            />
            <input
              type="text"
              placeholder="Property value"
              value={newUserProperty.value}
              onChange={(e) => setNewUserProperty(prev => ({ ...prev, value: e.target.value }))}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
            />
            <button
              onClick={handleAddUserProperty}
              className={`px-4 py-2 rounded-md ${buttonClasses}`}
            >
              Add
            </button>
          </div>

          {Object.keys(userProperties).length > 0 && (
            <div className="space-y-2">
              <h4 className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                Current User Properties:
              </h4>
              {Object.entries(userProperties).map(([key, value]) => (
                <div key={key} className={`flex items-center justify-between p-2 rounded ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    {key}: {String(value)}
                  </span>
                  <button
                    onClick={() => handleRemoveUserProperty(key)}
                    className={`text-xs px-2 py-1 rounded ${isDarkTheme ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Session Properties Management */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          🔄 Session Properties
        </h3>
        <p className={`text-sm mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          Set session properties for additional targeting control. These expire when the session ends.
        </p>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Property key"
              value={newSessionProperty.key}
              onChange={(e) => setNewSessionProperty(prev => ({ ...prev, key: e.target.value }))}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
            />
            <input
              type="text"
              placeholder="Property value"
              value={newSessionProperty.value}
              onChange={(e) => setNewSessionProperty(prev => ({ ...prev, value: e.target.value }))}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
            />
            <button
              onClick={handleAddSessionProperty}
              className={`px-4 py-2 rounded-md ${buttonClasses}`}
            >
              Add
            </button>
          </div>

          {Object.keys(sessionProperties).length > 0 && (
            <div className="space-y-2">
              <h4 className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                Current Session Properties:
              </h4>
              {Object.entries(sessionProperties).map(([key, value]) => (
                <div key={key} className={`flex items-center justify-between p-2 rounded ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    {key}: {String(value)}
                  </span>
                  <button
                    onClick={() => handleRemoveSessionProperty(key)}
                    className={`text-xs px-2 py-1 rounded ${isDarkTheme ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Guides and Surveys List */}
      <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            📋 Available Guides & Surveys
          </h3>
          <button
            onClick={closeAllGuidesAndSurveys}
            className={`px-3 py-1 rounded-md text-sm flex items-center space-x-2 ${isDarkTheme ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
          >
            <Square className="h-4 w-4" />
            <span>Close All</span>
          </button>
        </div>

        {guidesAndSurveys.length > 0 ? (
          <div className="space-y-3">
            {guidesAndSurveys.map((item, index) => (
              <div key={index} className={`p-3 rounded-md border ${isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === 'visible' 
                          ? isDarkTheme ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                          : isDarkTheme ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status}
                      </span>
                      <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                        Step {item.step + 1}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleShowGuide(item.id.toString())}
                    className={`px-3 py-1 rounded-md text-sm flex items-center space-x-2 ${buttonClasses}`}
                  >
                    <Play className="h-4 w-4" />
                    <span>Show</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <MessageSquare className={`h-12 w-12 mx-auto mb-2 ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
              No guides or surveys available. Make sure you have created guides/surveys in your Amplitude project.
            </p>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className={`rounded-lg border p-4 ${
        isDarkTheme ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${isDarkTheme ? 'text-blue-200' : 'text-blue-800'}`}>
          📚 Guides & Surveys Help
        </h3>
        <ul className={`text-sm space-y-1 ${isDarkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
          <li>• User properties persist across sessions and can be used for targeting</li>
          <li>• Session properties expire when the session ends</li>
          <li>• Use the "Show" button to manually trigger guides/surveys for testing</li>
          <li>• Make sure Guides & Surveys is enabled in your Amplitude project settings</li>
          <li>• Check the browser console for detailed debugging information</li>
        </ul>
      </div>
    </div>
  );
};

export default GuidesSurveysSection;

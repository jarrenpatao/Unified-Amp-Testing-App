import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ConfigurationPanel from './components/ConfigurationPanel';
import ExperimentSetup from './components/ExperimentSetup';
import UserContextManager from './components/UserContextManager';
import EventForm from './components/EventForm';
import FlagViewer from './components/FlagViewer';
import TestResults from './components/TestResults';
import { useAmplitude } from './hooks/useAmplitude';
import { AmplitudeEvent, ExperimentConfig, TestResult, AmplitudePayload, UserContext } from './types/amplitude';

function App() {
  const { 
    isInitialized, 
    experiment,
    experimentConfig,
    activeFlags,
    initializeAmplitude, 
    initializeExperiment,
    updateUserContext,
    fetchVariants,
    sendHttpEvent,
    trackExposure,
    trackAssignment,
    assignVariant
  } = useAmplitude();
  
  const [apiKey, setApiKey] = useState('');
  const [userContext, setUserContext] = useState<UserContext>({
    user_id: '',
    device_id: '',
    user_properties: {},
    groups: {},
  });
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingFlags, setIsFetchingFlags] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Check for theme changes based on user properties or experiment flags
  useEffect(() => {
    // Check user properties for theme preference
    const themeFromUserProps = userContext.user_properties?.theme_preference === 'dark' ||
                              userContext.user_properties?.feature_flags?.dark_mode_enabled === true;
    
    // Check experiment flags for theme variants
    const themeFromFlags = activeFlags.some(flag => 
      (flag.key.includes('theme') || flag.key.includes('dark') || flag.key.includes('color')) &&
      (flag.variant === 'dark' || flag.variant === 'treatment' || flag.payload?.theme === 'dark')
    );

    setIsDarkTheme(themeFromUserProps || themeFromFlags);
  }, [userContext.user_properties, activeFlags]);

  const handleConfigUpdate = async (config: { apiKey: string; userId: string; deviceId: string }) => {
    setApiKey(config.apiKey);
    
    // Update user context
    const newUserContext = {
      ...userContext,
      user_id: config.userId,
      device_id: config.deviceId,
    };
    setUserContext(newUserContext);
    
    // Initialize Amplitude
    const success = initializeAmplitude(config.apiKey, config.userId);
    
    // Track initial exposure if initialization was successful
    if (success) {
      setTimeout(() => {
        trackExposure('app_initialization', 'initialized');
      }, 100);
    }
  };

  const handleExperimentConfig = async (config: ExperimentConfig) => {
    if (!isInitialized) {
      alert('Please configure Amplitude first');
      return;
    }

    await initializeExperiment(config, userContext);
  };

  const handleUserContextUpdate = async (newContext: UserContext) => {
    setUserContext(newContext);
    if (experiment) {
      await updateUserContext(newContext);
    }
  };

  const handleRefreshFlags = async () => {
    setIsFetchingFlags(true);
    await fetchVariants();
    setIsFetchingFlags(false);
  };

  const handleSendEvent = async (event: AmplitudeEvent) => {
    if (!apiKey) {
      alert('Please configure your API key first');
      return;
    }

    setIsLoading(true);

    // Use current user context if not provided in event
    const finalEvent = {
      ...event,
      user_id: event.user_id || userContext.user_id,
      device_id: event.device_id || userContext.device_id,
    };

    // Add experiment flag data to event properties
    if (activeFlags.length > 0) {
      const flagData = activeFlags.reduce((acc, flag) => {
        acc[`[Experiment] ${flag.key}`] = flag.variant;
        if (flag.payload) {
          Object.keys(flag.payload).forEach(key => {
            acc[`[Experiment] ${flag.key}.${key}`] = flag.payload[key];
          });
        }
        return acc;
      }, {} as Record<string, any>);

      finalEvent.event_properties = {
        ...finalEvent.event_properties,
        ...flagData,
      };
    }

    const payload: AmplitudePayload = {
      api_key: apiKey,
      events: [finalEvent],
    };

    try {
      const result = await sendHttpEvent(payload);
      
      const testResult: TestResult = {
        timestamp: Date.now(),
        experimentFlags: [...activeFlags],
        event: finalEvent,
        userContext: { ...userContext },
        success: result.success,
        responseData: result.data,
        error: result.error,
      };

      setTestResults(prev => [testResult, ...prev]);
    } catch (error) {
      const testResult: TestResult = {
        timestamp: Date.now(),
        experimentFlags: [...activeFlags],
        event: finalEvent,
        userContext: { ...userContext },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      setTestResults(prev => [testResult, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResults = () => {
    setTestResults([]);
  };

  const handleAssignLightMode = async () => {
    if (!experimentConfig?.flagKeys.length) {
      alert('Please configure experiment flags first');
      return;
    }
    
    const themeFlag = experimentConfig.flagKeys.find(key => 
      key.includes('theme') || key.includes('dark') || key.includes('color')
    ) || experimentConfig.flagKeys[0];
    
    await assignVariant(themeFlag, 'control');
  };

  const handleAssignDarkMode = async () => {
    if (!experimentConfig?.flagKeys.length) {
      alert('Please configure experiment flags first');
      return;
    }
    
    const themeFlag = experimentConfig.flagKeys.find(key => 
      key.includes('theme') || key.includes('dark') || key.includes('color')
    ) || experimentConfig.flagKeys[0];
    
    await assignVariant(themeFlag, 'treatment');
  };

  const themeClasses = isDarkTheme 
    ? 'min-h-screen bg-gray-900 text-white transition-colors duration-500'
    : 'min-h-screen bg-gray-50 text-gray-900 transition-colors duration-500';

  const cardClasses = isDarkTheme
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  return (
    <div className={themeClasses}>
      <Header isDarkTheme={isDarkTheme} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isDarkTheme && (
          <div className="mb-6 p-4 bg-purple-900 border border-purple-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-200 text-sm font-medium">
                  🌙 Dark theme active - triggered by user properties or experiment flags
                </span>
              </div>
              <div className="text-xs text-purple-300">
                {activeFlags.length > 0 && `Active flags: ${activeFlags.map(f => `${f.key}:${f.variant}`).join(', ')}`}
              </div>
            </div>
          </div>
        )}

        {!isDarkTheme && activeFlags.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-800 text-sm font-medium">
                  ☀️ Light theme active - experiment flags: {activeFlags.map(f => `${f.key}:${f.variant}`).join(', ')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
              <ConfigurationPanel onConfigUpdate={handleConfigUpdate} isDarkTheme={isDarkTheme} />
            </div>
            
            {isInitialized && (
              <>
                <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
                  <ExperimentSetup 
                    onExperimentConfig={handleExperimentConfig}
                    isConfigured={!!experimentConfig}
                    isDarkTheme={isDarkTheme}
                  />
                </div>

                {experiment && experimentConfig && (
                  <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg font-semibold">🎨 Theme Assignment CTAs</span>
                    </div>
                    <p className={`text-sm mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                      Manually assign variants to test theme changes. Treatment = Dark Mode, Control = Light Mode.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={handleAssignLightMode}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors border"
                      >
                        <span>☀️</span>
                        <span>Assign Light Mode (Control)</span>
                      </button>
                      <button
                        onClick={handleAssignDarkMode}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors border border-gray-600"
                      >
                        <span>🌙</span>
                        <span>Assign Dark Mode (Treatment)</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
                  <UserContextManager
                    onUserContextUpdate={handleUserContextUpdate}
                    currentContext={userContext}
                    isDarkTheme={isDarkTheme}
                  />
                </div>
              </>
            )}

            {experiment && (
              <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
                <EventForm onSendEvent={handleSendEvent} isLoading={isLoading} isDarkTheme={isDarkTheme} />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {experiment && (
              <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
                <FlagViewer
                  flags={activeFlags}
                  onRefresh={handleRefreshFlags}
                  isLoading={isFetchingFlags}
                  isDarkTheme={isDarkTheme}
                />
              </div>
            )}

            <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
              <TestResults
                results={testResults}
                onClearResults={handleClearResults}
                isDarkTheme={isDarkTheme}
              />
            </div>

            {/* Status Panel */}
            <div className={`rounded-lg shadow-sm border p-6 ${cardClasses}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Amplitude SDK</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    isInitialized
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isInitialized ? 'Initialized' : 'Not Initialized'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Experiment Client</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    experiment
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {experiment ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Active Flags</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {activeFlags.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Total Events Sent</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {testResults.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Theme Mode</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    isDarkTheme 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isDarkTheme ? '🌙 Dark' : '☀️ Light'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
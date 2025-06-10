import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import SetupSection from './components/sections/SetupSection';
import ExperimentsSection from './components/sections/ExperimentsSection';
import AnalyticsSection from './components/sections/AnalyticsSection';
import ResultsSection from './components/sections/ResultsSection';
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
  
  const [activeSection, setActiveSection] = useState('setup');
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
    
    // Check experiment flags for theme variants - more permissive logic
    const themeFromFlags = activeFlags.some(flag => {
      // Debug logging
      console.log('🔍 Checking flag for theme:', {
        key: flag.key,
        variant: flag.variant,
        payload: flag.payload,
        keyMatches: flag.key.includes('theme') || flag.key.includes('dark') || flag.key.includes('color'),
        variantMatches: flag.variant === 'treatment' || flag.variant === 'dark',
        payloadMatches: flag.payload?.theme === 'dark'
      });
      
      // Check any flag with treatment variant OR dark theme payload
      // This covers manually assigned variants regardless of flag key name
      return (
        // Manual assignment with treatment variant
        (flag.variant === 'treatment' && flag.metadata?.flagType === 'manual_assignment') ||
        // Traditional theme flags
        ((flag.key.includes('theme') || flag.key.includes('dark') || flag.key.includes('color')) &&
         (flag.variant === 'dark' || flag.variant === 'treatment' || flag.payload?.theme === 'dark')) ||
        // Any flag with dark theme payload
        flag.payload?.theme === 'dark'
      );
    });

    const newTheme = themeFromUserProps || themeFromFlags;
    console.log('🎨 Theme detection:', {
      userProps: themeFromUserProps,
      flags: themeFromFlags,
      activeFlags: activeFlags.map(f => ({ key: f.key, variant: f.variant, payload: f.payload })),
      finalTheme: newTheme
    });

    setIsDarkTheme(newTheme);
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

  const handleAssignLightMode = async () => {
    if (!experimentConfig?.flagKeys.length) {
      alert('Please configure experiment flags first');
      return;
    }
    
    const themeFlag = experimentConfig.flagKeys.find(key => 
      key.includes('theme') || key.includes('dark') || key.includes('color')
    ) || experimentConfig.flagKeys[0];
    
    console.log('☀️ Assigning light mode to flag:', themeFlag);
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
    
    console.log('🌙 Assigning dark mode to flag:', themeFlag);
    await assignVariant(themeFlag, 'treatment');
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

  const themeClasses = isDarkTheme 
    ? 'min-h-screen bg-gray-900 text-white transition-colors duration-500'
    : 'min-h-screen bg-gray-50 text-gray-900 transition-colors duration-500';

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'setup':
        return (
          <SetupSection
            onConfigUpdate={handleConfigUpdate}
            isDarkTheme={isDarkTheme}
            isInitialized={isInitialized}
          />
        );
      case 'experiments':
        return (
          <ExperimentsSection
            onExperimentConfig={handleExperimentConfig}
            isConfigured={!!experimentConfig}
            isDarkTheme={isDarkTheme}
            isInitialized={isInitialized}
            experimentConfig={experimentConfig}
            activeFlags={activeFlags}
            onRefreshFlags={handleRefreshFlags}
            isFetchingFlags={isFetchingFlags}
            onAssignLightMode={handleAssignLightMode}
            onAssignDarkMode={handleAssignDarkMode}
          />
        );
      case 'analytics':
        return (
          <AnalyticsSection
            onUserContextUpdate={handleUserContextUpdate}
            currentContext={userContext}
            onSendEvent={handleSendEvent}
            isLoading={isLoading}
            isDarkTheme={isDarkTheme}
            isInitialized={isInitialized}
            hasExperiment={!!experimentConfig}
          />
        );
      case 'results':
        return (
          <ResultsSection
            testResults={testResults}
            onClearResults={handleClearResults}
            isDarkTheme={isDarkTheme}
            isInitialized={isInitialized}
            activeFlags={activeFlags}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={themeClasses}>
      <div className="flex">
        {/* Left Navigation */}
        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isDarkTheme={isDarkTheme}
        />

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Theme Status Banner */}
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

          {/* Active Section Content */}
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default App;
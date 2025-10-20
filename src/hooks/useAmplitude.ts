import { useState } from 'react';
import { 
  initAll, 
  track,
  experiment
} from '@amplitude/unified';
import { ExperimentConfig, ExperimentFlag, UserContext } from '../types/amplitude';

export const useAmplitude = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [experimentConfig, setExperimentConfig] = useState<ExperimentConfig | null>(null);
  const [activeFlags, setActiveFlags] = useState<ExperimentFlag[]>([]);

  const initializeAmplitude = (apiKey: string) => {
    try {
      initAll(apiKey, {
        // Enable experiment with deployment key when available
        experiment: {
          // Will be configured later when experiment is set up
        },
        // Enable Guides and Surveys (using type assertion for beta SDK)
        engagement: {
          // Guides and Surveys options
          logLevel: 'warn' // Set to 'debug' for more verbose logging during development
        }
      } as any);
      
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize Amplitude:', error);
      return false;
    }
  };

  const initializeExperiment = async (config: ExperimentConfig, userContext?: UserContext) => {
    try {
      if (!isInitialized) {
        throw new Error('Amplitude not initialized');
      }

             // Store the config for later use - the unified SDK will handle experiment setup
       console.log('Experiment config set:', config);

      if (userContext && experiment) {
        // Set user context if experiment is available
        await experiment.setUser?.(userContext);
      }

      setExperimentConfig(config);
      
      // Fetch initial variants for configured flags
      await fetchVariants(config.flagKeys);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Experiment:', error);
      return null;
    }
  };

  const fetchVariants = async (flagKeys: string[]) => {
    try {
      if (!isInitialized || !experimentConfig || !experiment) {
        return [];
      }

      // For now, create mock flags since the unified SDK experiment API is still in beta
      const flags: ExperimentFlag[] = flagKeys.map(key => ({
        key,
        variant: 'control', // Default to control
        payload: undefined,
        metadata: { flagType: 'unified_sdk' },
      }));
      setActiveFlags(flags);
      
      // Track exposure events for each flag
      flags.forEach(flag => {
        trackExposure(flag.key, flag.variant);
      });
      
      return flags;
    } catch (error) {
      console.error('Failed to fetch variants:', error);
      return [];
    }
  };

  const trackExposure = (flagKey: string, variant: string) => {
    if (!isInitialized) return;
    
    track('[Experiment] Exposure', {
      flag_key: flagKey,
      variant: variant,
      timestamp: Date.now(),
    });
  };

  const trackAssignment = (flagKey: string, variant: string, source: 'automatic' | 'manual' = 'automatic') => {
    if (!isInitialized) return;
    
    track('[Experiment] Assignment', {
      flag_key: flagKey,
      variant: variant,
      source: source,
      timestamp: Date.now(),
    });
  };

  const assignVariant = async (flagKey: string, variant: 'control' | 'treatment') => {
    if (!experimentConfig) return false;

    try {
      // Manually set the variant
      const updatedFlags = activeFlags.map(flag => 
        flag.key === flagKey 
          ? { ...flag, variant }
          : flag
      );
      
      // If the flag doesn't exist, add it
      if (!updatedFlags.find(flag => flag.key === flagKey)) {
        updatedFlags.push({
          key: flagKey,
          variant,
          payload: variant === 'treatment' ? { theme: 'dark' } : { theme: 'light' },
          metadata: { flagType: 'manual_assignment' }
        });
      }
      
      setActiveFlags(updatedFlags);
      
      // Track the assignment
      trackAssignment(flagKey, variant, 'manual');
      
      return true;
    } catch (error) {
      console.error('Failed to assign variant:', error);
      return false;
    }
  };

  const updateUserContext = async (userContext: UserContext) => {
    if (!isInitialized) return;
    
    try {
      if (experiment && experiment.setUser) {
        await experiment.setUser(userContext);
      }

      if (experimentConfig) {
        await fetchVariants(experimentConfig.flagKeys);
      }
    } catch (error) {
      console.error('Failed to update user context:', error);
    }
  };

  const trackEvent = (eventType: string, eventProperties?: Record<string, any>) => {
    if (!isInitialized) {
      throw new Error('Amplitude not initialized');
    }
    track(eventType, eventProperties);
  };

  const sendHttpEvent = async (payload: any) => {
    try {
      const response = await fetch('https://api2.amplitude.com/2/httpapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  // Guides and Surveys utility functions
  const getEngagementStatus = () => {
    if (typeof window !== 'undefined' && (window as any).engagement) {
      return (window as any).engagement._debugStatus?.() || null;
    }
    return null;
  };

  const listGuidesAndSurveys = () => {
    if (typeof window !== 'undefined' && (window as any).engagement) {
      return (window as any).engagement.gs?.list?.() || [];
    }
    return [];
  };

  const showGuideOrSurvey = (key: string, stepIndex?: number) => {
    if (typeof window !== 'undefined' && (window as any).engagement) {
      (window as any).engagement.gs?.show?.(key, stepIndex);
    }
  };

  const closeAllGuidesAndSurveys = () => {
    if (typeof window !== 'undefined' && (window as any).engagement) {
      (window as any).engagement.gs?.closeAll?.();
    }
  };

  const setUserProperties = (userProperties: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).engagement) {
      (window as any).engagement._setUserProperties?.(userProperties);
    }
  };

  const setSessionProperty = (key: string, value: any) => {
    if (typeof window !== 'undefined' && (window as any).engagement) {
      (window as any).engagement.setSessionProperty?.(key, value);
    }
  };

  return {
    isInitialized,
    experiment: isInitialized, // For compatibility
    experimentConfig,
    activeFlags,
    initializeAmplitude,
    initializeExperiment,
    updateUserContext,
    fetchVariants: () => experimentConfig ? fetchVariants(experimentConfig.flagKeys) : Promise.resolve([]),
    trackEvent,
    sendHttpEvent,
    trackExposure,
    trackAssignment,
    assignVariant,
    // Guides and Surveys functions
    getEngagementStatus,
    listGuidesAndSurveys,
    showGuideOrSurvey,
    closeAllGuidesAndSurveys,
    setUserProperties,
    setSessionProperty,
  };
};
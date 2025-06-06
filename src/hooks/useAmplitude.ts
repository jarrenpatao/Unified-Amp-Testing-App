import { useEffect, useState } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { Experiment } from '@amplitude/experiment-js-client';
import { ExperimentConfig, ExperimentFlag, UserContext } from '../types/amplitude';

export const useAmplitude = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [experimentConfig, setExperimentConfig] = useState<ExperimentConfig | null>(null);
  const [activeFlags, setActiveFlags] = useState<ExperimentFlag[]>([]);

  const initializeAmplitude = (apiKey: string, userId?: string) => {
    try {
      amplitude.init(apiKey, userId, {
        defaultTracking: {
          sessions: true,
          pageViews: true,
          formInteractions: true,
          fileDownloads: true,
        },
      });
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize Amplitude:', error);
      return false;
    }
  };

  const initializeExperiment = async (config: ExperimentConfig, userContext?: UserContext) => {
    try {
      const experimentClient = Experiment.initialize(config.deploymentKey, {
        debug: true,
        fallbackVariant: {},
        initialVariants: {},
        source: 'amplitude-experiment-testing',
        serverUrl: config.serverUrl || 'https://api.lab.amplitude.com',
      });

      if (userContext) {
        experimentClient.setUser({
          user_id: userContext.user_id,
          device_id: userContext.device_id,
          user_properties: userContext.user_properties,
          groups: userContext.groups,
        });
      }

      await experimentClient.start();
      setExperiment(experimentClient);
      setExperimentConfig(config);
      
      // Fetch initial variants for configured flags
      await fetchVariants(experimentClient, config.flagKeys);
      
      return experimentClient;
    } catch (error) {
      console.error('Failed to initialize Experiment:', error);
      return null;
    }
  };

  const fetchVariants = async (experimentClient: Experiment, flagKeys: string[]) => {
    try {
      const variants = await experimentClient.all();
      const flags: ExperimentFlag[] = flagKeys.map(key => ({
        key,
        variant: variants[key]?.key || 'control',
        payload: variants[key]?.payload,
        metadata: variants[key]?.metadata,
      }));
      setActiveFlags(flags);
      return flags;
    } catch (error) {
      console.error('Failed to fetch variants:', error);
      return [];
    }
  };

  const updateUserContext = async (userContext: UserContext) => {
    if (!experiment) return;
    
    experiment.setUser({
      user_id: userContext.user_id,
      device_id: userContext.device_id,
      user_properties: userContext.user_properties,
      groups: userContext.groups,
    });

    if (experimentConfig) {
      await fetchVariants(experiment, experimentConfig.flagKeys);
    }
  };

  const trackEvent = (eventType: string, eventProperties?: Record<string, any>) => {
    if (!isInitialized) {
      throw new Error('Amplitude not initialized');
    }
    amplitude.track(eventType, eventProperties);
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

  return {
    isInitialized,
    experiment,
    experimentConfig,
    activeFlags,
    initializeAmplitude,
    initializeExperiment,
    updateUserContext,
    fetchVariants: () => experimentConfig && experiment ? fetchVariants(experiment, experimentConfig.flagKeys) : Promise.resolve([]),
    trackEvent,
    sendHttpEvent,
  };
};
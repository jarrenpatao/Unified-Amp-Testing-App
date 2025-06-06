export interface AmplitudeEvent {
  user_id?: string;
  device_id?: string;
  event_type: string;
  time?: number;
  event_properties?: Record<string, any>;
  user_properties?: Record<string, any>;
  groups?: Record<string, any>;
  app_version?: string;
  platform?: string;
  os_name?: string;
  os_version?: string;
  device_brand?: string;
  device_manufacturer?: string;
  device_model?: string;
  carrier?: string;
  country?: string;
  region?: string;
  city?: string;
  dma?: string;
  language?: string;
  price?: number;
  quantity?: number;
  revenue?: number;
  productId?: string;
  revenueType?: string;
  location_lat?: number;
  location_lng?: number;
  ip?: string;
  idfa?: string;
  idfv?: string;
  adid?: string;
  android_id?: string;
  event_id?: number;
  session_id?: number;
  insert_id?: string;
}

export interface AmplitudePayload {
  api_key: string;
  events: AmplitudeEvent[];
  options?: {
    min_id_length?: number;
  };
}

export interface ExperimentConfig {
  deploymentKey: string;
  serverUrl?: string;
  flagKeys: string[];
  environment: 'development' | 'staging' | 'production';
}

export interface ExperimentFlag {
  key: string;
  variant: string;
  payload?: any;
  metadata?: {
    flagType?: string;
    deployed?: boolean;
    segmentName?: string;
  };
}

export interface UserContext {
  user_id?: string;
  device_id?: string;
  user_properties?: Record<string, any>;
  groups?: Record<string, any>;
}

export interface TestResult {
  timestamp: number;
  experimentFlags: ExperimentFlag[];
  event: AmplitudeEvent;
  userContext: UserContext;
  success: boolean;
  responseData?: any;
  error?: string;
}
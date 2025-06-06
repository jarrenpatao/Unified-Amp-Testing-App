import React, { useState } from 'react';
import { Send, Plus, Minus } from 'lucide-react';
import { AmplitudeEvent } from '../types/amplitude';

interface EventFormProps {
  onSendEvent: (event: AmplitudeEvent) => void;
  isLoading?: boolean;
  isDarkTheme?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ onSendEvent, isLoading = false, isDarkTheme = false }) => {
  const [event, setEvent] = useState<AmplitudeEvent>({
    event_type: 'test_event',
    time: Date.now(),
    event_properties: {},
    user_properties: {},
  });

  const [eventPropertiesInput, setEventPropertiesInput] = useState('{}');
  const [userPropertiesInput, setUserPropertiesInput] = useState('{}');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventProperties = JSON.parse(eventPropertiesInput || '{}');
      const userProperties = JSON.parse(userPropertiesInput || '{}');
      
      const finalEvent = {
        ...event,
        event_properties: eventProperties,
        user_properties: userProperties,
        time: event.time || Date.now(),
      };
      
      onSendEvent(finalEvent);
    } catch (error) {
      alert('Invalid JSON in properties fields');
    }
  };

  const handleChange = (field: keyof AmplitudeEvent, value: any) => {
    setEvent(prev => ({ ...prev, [field]: value }));
  };

  const textClasses = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const labelClasses = isDarkTheme ? 'text-gray-200' : 'text-gray-700';
  const inputClasses = isDarkTheme 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-transparent';

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <Send className={`h-5 w-5 ${textClasses}`} />
        <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Send HTTP API Event</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventType" className={`block text-sm font-medium mb-2 ${labelClasses}`}>
              Event Type *
            </label>
            <input
              type="text"
              id="eventType"
              value={event.event_type}
              onChange={(e) => handleChange('event_type', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
              placeholder="button_click"
              required
            />
          </div>

          <div>
            <label htmlFor="userId" className={`block text-sm font-medium mb-2 ${labelClasses}`}>
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={event.user_id || ''}
              onChange={(e) => handleChange('user_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
              placeholder="user-123"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deviceId" className={`block text-sm font-medium mb-2 ${labelClasses}`}>
              Device ID
            </label>
            <input
              type="text"
              id="deviceId"
              value={event.device_id || ''}
              onChange={(e) => handleChange('device_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
              placeholder="device-123"
            />
          </div>

          <div>
            <label htmlFor="sessionId" className={`block text-sm font-medium mb-2 ${labelClasses}`}>
              Session ID
            </label>
            <input
              type="number"
              id="sessionId"
              value={event.session_id || ''}
              onChange={(e) => handleChange('session_id', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
              placeholder="1234567890"
            />
          </div>
        </div>

        <div>
          <label htmlFor="eventProperties" className={`block text-sm font-medium mb-2 ${labelClasses}`}>
            Event Properties (JSON)
          </label>
          <textarea
            id="eventProperties"
            value={eventPropertiesInput}
            onChange={(e) => setEventPropertiesInput(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors font-mono text-sm ${inputClasses}`}
            rows={4}
            placeholder='{"button_name": "signup", "page": "homepage"}'
          />
        </div>

        <div>
          <label htmlFor="userProperties" className={`block text-sm font-medium mb-2 ${labelClasses}`}>
            User Properties (JSON)
          </label>
          <textarea
            id="userProperties"
            value={userPropertiesInput}
            onChange={(e) => setUserPropertiesInput(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors font-mono text-sm ${inputClasses}`}
            rows={4}
            placeholder='{"subscription_tier": "premium", "country": "US"}'
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Send Event</span>
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default EventForm;
import React, { useState } from 'react';
import { Users, RefreshCw, Lightbulb } from 'lucide-react';
import { UserContext } from '../types/amplitude';

interface UserContextManagerProps {
  onUserContextUpdate: (context: UserContext) => void;
  currentContext: UserContext;
  isDarkTheme?: boolean;
}

const UserContextManager: React.FC<UserContextManagerProps> = ({ 
  onUserContextUpdate, 
  currentContext 
}) => {
  const [context, setContext] = useState<UserContext>(currentContext);
  const [userPropertiesInput, setUserPropertiesInput] = useState(
    JSON.stringify(currentContext.user_properties || {}, null, 2)
  );
  const [groupsInput, setGroupsInput] = useState(
    JSON.stringify(currentContext.groups || {}, null, 2)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userProperties = JSON.parse(userPropertiesInput || '{}');
      const groups = JSON.parse(groupsInput || '{}');
      
      const finalContext = {
        ...context,
        user_properties: userProperties,
        groups: groups,
      };
      
      onUserContextUpdate(finalContext);
    } catch (error) {
      alert('Invalid JSON in properties fields');
    }
  };

  const generateRandomUser = () => {
    const randomId = `test-user-${Math.floor(Math.random() * 10000)}`;
    const randomDevice = `device-${Math.floor(Math.random() * 10000)}`;
    
    setContext(prev => ({
      ...prev,
      user_id: randomId,
      device_id: randomDevice,
    }));
  };

  const setDarkThemeExample = () => {
    const darkThemeProperties = {
      theme_preference: "dark",
      subscription_tier: "premium",
      country: "US",
      feature_flags: {
        dark_mode_enabled: true
      }
    };
    setUserPropertiesInput(JSON.stringify(darkThemeProperties, null, 2));
  };

  const setLightThemeExample = () => {
    const lightThemeProperties = {
      theme_preference: "light",
      subscription_tier: "free",
      country: "CA",
      feature_flags: {
        dark_mode_enabled: false
      }
    };
    setUserPropertiesInput(JSON.stringify(lightThemeProperties, null, 2));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">User Context</h2>
        </div>
        <button
          type="button"
          onClick={generateRandomUser}
          className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Random User</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={context.user_id || ''}
              onChange={(e) => setContext(prev => ({ ...prev, user_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="user-123"
            />
          </div>

          <div>
            <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-2">
              Device ID
            </label>
            <input
              type="text"
              id="deviceId"
              value={context.device_id || ''}
              onChange={(e) => setContext(prev => ({ ...prev, device_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="device-123"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="userProperties" className="block text-sm font-medium text-gray-700">
              User Properties (JSON)
            </label>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-gray-500">Theme Examples:</span>
              <button
                type="button"
                onClick={setDarkThemeExample}
                className="px-2 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
              >
                Dark
              </button>
              <button
                type="button"
                onClick={setLightThemeExample}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
              >
                Light
              </button>
            </div>
          </div>
          <textarea
            id="userProperties"
            value={userPropertiesInput}
            onChange={(e) => setUserPropertiesInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
            rows={6}
            placeholder={`{
  "theme_preference": "dark",
  "subscription_tier": "premium",
  "country": "US",
  "feature_flags": {
    "dark_mode_enabled": true
  }
}`}
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Try the theme examples above to see how user properties can affect experiment targeting and visual changes
          </p>
        </div>

        <div>
          <label htmlFor="groups" className="block text-sm font-medium text-gray-700 mb-2">
            Groups (JSON)
          </label>
          <textarea
            id="groups"
            value={groupsInput}
            onChange={(e) => setGroupsInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
            rows={3}
            placeholder={`{
  "company": "amplitude",
  "team": "engineering",
  "plan": "enterprise"
}`}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Update User Context
        </button>
      </form>
    </div>
  );
};

export default UserContextManager;
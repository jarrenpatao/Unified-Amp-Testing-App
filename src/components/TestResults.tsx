import React from 'react';
import { Activity, CheckCircle, XCircle, Clock, Flag } from 'lucide-react';
import { TestResult } from '../types/amplitude';

interface TestResultsProps {
  results: TestResult[];
  onClearResults: () => void;
  isDarkTheme?: boolean;
}

const TestResults: React.FC<TestResultsProps> = ({ results, onClearResults, isDarkTheme = false }) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const textClasses = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const codeClasses = isDarkTheme ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700';

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className={`h-5 w-5 ${textClasses}`} />
          <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Test Results</h2>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {results.length} events
          </span>
        </div>
        {results.length > 0 && (
          <button
            onClick={onClearResults}
            className={`text-sm transition-colors ${
              isDarkTheme ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <p className={`text-center py-8 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            No test results yet. Send an event to see results here.
          </p>
        ) : (
          results.map((result, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                result.success
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium text-gray-900">
                      {result.event.event_type}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>User ID: {result.userContext.user_id || 'N/A'}</p>
                    <p>Device ID: {result.userContext.device_id || 'N/A'}</p>
                    
                    {result.experimentFlags.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-1 mb-1">
                          <Flag className="h-3 w-3 text-gray-500" />
                          <span className="text-xs font-medium text-gray-700">Active Flags:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {result.experimentFlags.map((flag) => (
                            <span
                              key={flag.key}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {flag.key}: {flag.variant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {result.error && (
                      <p className="text-red-600 font-medium">Error: {result.error}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimestamp(result.timestamp)}</span>
                </div>
              </div>

              {result.responseData && (
                <div className="mt-3 p-3 rounded-md">
                  <pre className={`text-xs overflow-x-auto ${codeClasses}`}>
                    {JSON.stringify(result.responseData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default TestResults;
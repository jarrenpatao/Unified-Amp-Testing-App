import React from 'react';
import { Flag, RefreshCw } from 'lucide-react';
import { ExperimentFlag } from '../types/amplitude';

interface FlagViewerProps {
  flags: ExperimentFlag[];
  onRefresh: () => void;
  isLoading?: boolean;
  isDarkTheme?: boolean;
}

const FlagViewer: React.FC<FlagViewerProps> = ({ flags, onRefresh, isLoading = false, isDarkTheme = false }) => {
  const textClasses = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const cardClasses = isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
  const codeClasses = isDarkTheme ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700';

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Flag className={`h-5 w-5 ${textClasses}`} />
          <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Active Flags</h2>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {flags.length} flags
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-3 py-1 text-sm rounded-md transition-colors disabled:opacity-50 ${
            isDarkTheme 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="space-y-3">
        {flags.length === 0 ? (
          <p className={`text-center py-8 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            No flags configured. Add flag keys in the Experiment Configuration.
          </p>
        ) : (
          flags.map((flag) => (
            <div
              key={flag.key}
              className={`p-4 border rounded-lg ${cardClasses}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{flag.key}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  flag.variant === 'control'
                    ? 'bg-gray-100 text-gray-800'
                    : flag.variant === 'treatment'
                    ? 'bg-green-100 text-green-800'
                    : flag.variant === 'dark'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {flag.variant}
                </span>
              </div>
              
              {flag.payload && Object.keys(flag.payload).length > 0 && (
                <div className="mt-3">
                  <h5 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>Payload:</h5>
                  <pre className={`text-xs p-3 rounded border overflow-x-auto ${codeClasses}`}>
                    {JSON.stringify(flag.payload, null, 2)}
                  </pre>
                </div>
              )}

              {flag.metadata && (
                <div className={`mt-3 text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                  {flag.metadata.flagType && (
                    <span className="mr-4">Type: {flag.metadata.flagType}</span>
                  )}
                  {flag.metadata.segmentName && (
                    <span className="mr-4">Segment: {flag.metadata.segmentName}</span>
                  )}
                  {flag.metadata.deployed !== undefined && (
                    <span>Deployed: {flag.metadata.deployed ? 'Yes' : 'No'}</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default FlagViewer;
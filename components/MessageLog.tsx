
import React from 'react';

interface MessageLogProps {
  logs: string[];
}

const MessageLog: React.FC<MessageLogProps> = ({ logs }) => {
  return (
    <div className="bg-black/20 p-3 rounded-lg border-2 border-yellow-800 shadow-md h-32 flex flex-col">
      <h2 className="text-center text-yellow-300 text-lg mb-2">로그</h2>
      <div className="space-y-1 overflow-y-auto flex-grow flex flex-col-reverse pr-1">
        {logs.map((log, index) => (
          <p key={index} className={`text-xs text-gray-300 opacity-80 ${index === 0 ? 'log-entry-animation' : ''}`}>
            {`> ${log}`}
          </p>
        ))}
      </div>
    </div>
  );
};

export default MessageLog;
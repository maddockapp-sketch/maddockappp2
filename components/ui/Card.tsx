
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-gray-800 rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`p-6 border-b border-gray-700 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <h3 className={`text-lg font-semibold font-display ${className}`}>
    {children}
  </h3>
);

export const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

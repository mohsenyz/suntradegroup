import React from 'react';

interface BuildInfoProps {
  className?: string;
}

const BuildInfo: React.FC<BuildInfoProps> = ({ className = '' }) => {
  const buildTime = process.env.BUILD_TIME || new Date().toISOString();
  const buildVersion = process.env.npm_package_version || '0.1.0';
  
  // Format build time for display
  const formatBuildTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tehran'
      });
    } catch {
      return isoString.split('T')[0]; // Fallback to date part
    }
  };

  // Calculate time since build
  const getTimeSinceBuild = (isoString: string) => {
    try {
      const buildDate = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - buildDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        return `${diffDays} روز پیش`;
      } else if (diffHours > 0) {
        return `${diffHours} ساعت پیش`;
      } else {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} دقیقه پیش`;
      }
    } catch {
      return '';
    }
  };

  const formattedTime = formatBuildTime(buildTime);
  const timeSince = getTimeSinceBuild(buildTime);

  return (
    <div className={`flex items-center space-x-2 space-x-reverse text-xs ${className}`}>
      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center">
        🏗️ نسخه v{buildVersion}
      </span>
      <span 
        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full cursor-help" 
        title={`آخرین به‌روزرسانی: ${formattedTime}`}
      >
        📅 {timeSince}
      </span>
    </div>
  );
};

export default BuildInfo;
import React from 'react';
import StatusIcon, { InvoiceStatus, getStatusConfig } from './StatusIcon';

interface StatusBadgeProps {
  status: InvoiceStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
  onClick?: () => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  showLabel = true,
  animate = false,
  className = '',
  onClick
}) => {
  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const badgeClasses = `
    inline-flex items-center rounded-full font-medium
    ${sizeClasses[size]}
    ${config.bgColor} ${config.color}
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `.trim();

  return (
    <span 
      className={badgeClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      title={config.description}
      aria-label={config.ariaLabel}
    >
      {showIcon && (
        <StatusIcon 
          status={status} 
          size={iconSizes[size]} 
          showTooltip={false}
          animate={animate}
          className={showLabel ? 'mr-1' : ''}
        />
      )}
      {showLabel && (
        <span>{config.label}</span>
      )}
    </span>
  );
};

export default StatusBadge;
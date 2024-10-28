import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
}) => {
  return (
    <div className="flex items-center gap-4">
      {(description || label.includes('Enable')) && (
        <div className="flex flex-col min-w-0">
          <span className="text-base font-medium text-foreground truncate">
            {label}
          </span>
          {description && (
            <span className="text-sm text-muted-foreground truncate mt-1">
              {description}
            </span>
          )}
        </div>
      )}
      <div className="flex-shrink-0">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={onChange}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            checked ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span className="sr-only">{label}</span>
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background shadow-sm ring-0 transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
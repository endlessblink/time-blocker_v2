import React, { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';

interface SoundTestButtonProps {
  onClick: () => Promise<void>;
  label: string;
  disabled?: boolean;
}

export const SoundTestButton: React.FC<SoundTestButtonProps> = ({
  onClick,
  label,
  disabled = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = async () => {
    if (isPlaying || disabled) return;
    
    setIsPlaying(true);
    setError(null);
    
    try {
      await onClick();
    } catch (err) {
      setError(err as Error);
      // Show error state briefly
      setTimeout(() => setError(null), 2000);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPlaying || disabled}
      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        disabled
          ? 'text-muted-foreground bg-muted cursor-not-allowed'
          : error
          ? 'text-destructive bg-destructive/10'
          : 'text-primary bg-primary/10 hover:bg-primary/20'
      }`}
      title={error?.message}
    >
      {isPlaying ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : error ? (
        <AlertCircle className="w-4 h-4 mr-2" />
      ) : (
        <Play className="w-4 h-4 mr-2" />
      )}
      {error ? 'Error' : isPlaying ? 'Playing...' : 'Test'}
    </button>
  );
}
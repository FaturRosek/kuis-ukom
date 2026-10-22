import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  durationSeconds: number;
  onTimeout: () => void;
  isPaused: boolean;
  onTick?: (remaining: number) => void;
}

export const Timer: React.FC<TimerProps> = ({
  durationSeconds,
  onTimeout,
  isPaused,
  onTick,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeout, onTick]);

  const isWarning = timeLeft <= 5 && timeLeft > 0;

  return (
    <div className={`timer-container ${isWarning ? 'timer-warning' : ''}`}>
      <Clock size={19} />
      <span>{timeLeft}s</span>
    </div>
  );
};

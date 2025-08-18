// src/Components/Ui/AnimatedBackground.tsx
import React from 'react';
import './AnimatedBackground.scss';

interface AnimatedBackgroundProps {
  className?: string;
  bubbleCount?: number;
  intensity?: 'low' | 'medium' | 'high';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
  bubbleCount = 38,
  intensity = 'medium'
}) => {
  // Generiere die Bubble-Elemente basierend auf der gewünschten Anzahl
  const bubbles = Array.from({ length: bubbleCount }, (_, index) => (
    <span
      key={index}
      className="Bubble"
      data-index={index}
      style={{
        '--bubble-index': index,
        animationDelay: `${-Math.random() * 300}s, ${-Math.random() * 15}s`
      } as React.CSSProperties}
    />
  ));

  const intensityClass = `Background-Bubbles--${intensity}`;

  return (
    <div
      className={`Background-Bubbles ${intensityClass} ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      {bubbles}
    </div>
  );
};

export default AnimatedBackground;
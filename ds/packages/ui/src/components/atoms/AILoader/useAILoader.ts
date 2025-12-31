import { useState, useEffect } from 'react';
import { AILoaderProps, TypingState } from './types';

export const useAILoader = (props: AILoaderProps) => {
  const { 
    messages = ['AI Processing...'], 
    speed = 'normal',
    className = ''
  } = props;

  const [displayedText, setDisplayedText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [typingState, setTypingState] = useState<TypingState>('typing');

  // Configuración de tiempos según prop speed
  const speeds = {
    fast: { type: 30, delete: 20, wait: 1000 },
    normal: { type: 80, delete: 40, wait: 2000 },
    slow: { type: 150, delete: 70, wait: 3000 }
  };
  
  const currentSpeed = speeds[speed];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (typingState === 'typing') {
      if (subIndex < messages[messageIndex].length) {
        // Escribiendo carácter
        timeout = setTimeout(() => {
          setDisplayedText(prev => prev + messages[messageIndex][subIndex]);
          setSubIndex(prev => prev + 1);
        }, currentSpeed.type);
      } else {
        // Terminó de escribir
        if (messages.length > 1) {
          setTypingState('waiting');
        }
      }
    } 
    
    if (typingState === 'waiting') {
      // Esperando antes de borrar
      timeout = setTimeout(() => {
        setTypingState('deleting');
      }, currentSpeed.wait);
    }

    if (typingState === 'deleting') {
      if (subIndex > 0) {
        // Borrando carácter
        timeout = setTimeout(() => {
          setDisplayedText(prev => prev.slice(0, -1));
          setSubIndex(prev => prev - 1);
        }, currentSpeed.delete);
      } else {
        // Terminó de borrar, pasar al siguiente mensaje
        setTypingState('typing');
        setMessageIndex(prev => (prev + 1) % messages.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [subIndex, typingState, messageIndex, messages, currentSpeed]);

  return {
    displayedText,
    className
  };
};

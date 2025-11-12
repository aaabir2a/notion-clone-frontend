import { useEffect, useState } from 'react';

export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

// Hook for keyboard shortcuts with modifiers
export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const modifierPressed =
        (keys.includes('ctrl') && event.ctrlKey) ||
        (keys.includes('meta') && event.metaKey) ||
        (keys.includes('shift') && event.shiftKey) ||
        (keys.includes('alt') && event.altKey);

      const keyPressed = keys.some(
        (key) => key.toLowerCase() === event.key.toLowerCase()
      );

      if (modifierPressed && keyPressed) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [keys, callback, ...dependencies]);
}

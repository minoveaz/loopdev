import React, { useState, useRef, useCallback } from 'react';
import { type Tag, generateId } from '@blueprints/components/functional/TagInput/utils';

export const useTagInput = (initialTags: Tag[] = [], maxTags: number = 10, onAddTag?: (tag: Tag) => void) => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = useCallback((label: string) => {
    const trimmedLabel = label.trim();
    
    // Validation
    if (!trimmedLabel) return;
    if (tags.length >= maxTags) return;
    if (tags.some(t => t.label.toLowerCase() === trimmedLabel.toLowerCase())) {
        // Prevent duplicates logic could go here (e.g. flash existing)
        setInputValue(''); 
        return;
    }

    const newTag: Tag = {
      id: generateId(),
      label: trimmedLabel,
      variant: 'primary' // Default to primary for user added tags
    };

    setTags(prev => [...prev, newTag]);
    setInputValue('');
    if (onAddTag) onAddTag(newTag);
  }, [tags, maxTags, onAddTag]);

  const removeTag = useCallback((id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag on backspace if input is empty
      removeTag(tags[tags.length - 1].id);
    }
  };

  return {
    tags,
    inputValue,
    inputRef,
    focusInput,
    handleInputChange,
    handleKeyDown,
    removeTag
  };
};
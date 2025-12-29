
import React from 'react';
import { useTagInput } from './useTagInput';
import { Container, Label, InputWrapper, TagItem, InputField, HelperText, ApiInfo } from './components';
import { type Tag, DEFAULT_TAGS } from './utils';

interface TagInputProps {
  initialTags?: Tag[];
  label?: string;
  placeholder?: string;
  maxTags?: number;
  className?: string;
  onTagsChange?: (tags: Tag[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  initialTags = DEFAULT_TAGS, 
  label = "Team Members", 
  placeholder = "Add member...", 
  maxTags = 10,
  className = "",
  onTagsChange
}) => {
  const {
    tags,
    inputValue,
    inputRef,
    focusInput,
    handleInputChange,
    handleKeyDown,
    removeTag
  } = useTagInput(initialTags, maxTags);

  // Notify parent on change (effect or callback wrapper could be used, simplified here)
  React.useEffect(() => {
    if (onTagsChange) onTagsChange(tags);
  }, [tags, onTagsChange]);

  return (
    <Container className={className}>
      <div className="mb-6">
        <Label text={label} />
        
        <InputWrapper onClick={focusInput}>
          {tags.map(tag => (
            <TagItem 
              key={tag.id} 
              tag={tag} 
              onRemove={removeTag} 
            />
          ))}
          <InputField 
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={tags.length < maxTags ? placeholder : "Limit reached"}
            disabled={tags.length >= maxTags}
          />
        </InputWrapper>
        
        <HelperText />
      </div>
      
      <ApiInfo maxTags={maxTags} />
    </Container>
  );
};

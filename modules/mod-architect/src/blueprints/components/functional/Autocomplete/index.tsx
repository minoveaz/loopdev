
import React from 'react';
import { useAutocomplete } from './useAutocomplete';
import { 
  AutocompleteContainer, 
  SearchLabel, 
  SearchInput, 
  DropdownContainer, 
  GroupHeader, 
  ResultItem, 
  SearchFooter,
  NoResults
} from './components';
import type { SearchResult } from './utils';

interface AutocompleteProps {
  initialQuery?: string;
  className?: string;
}

// Mock Data
const MOCK_RESULTS: SearchResult[] = [
  { 
    id: '1', 
    title: 'System Design 2024', 
    subtitle: 'Shared Drive / Engineering', 
    type: 'folder'
  },
  { 
    id: '2', 
    title: 'System Dependencies.pdf', 
    subtitle: 'Last edited 2m ago by AI Bot', 
    type: 'file'
  },
  { 
    id: '3', 
    title: 'Alex Dempsey', 
    subtitle: 'Product Designer', 
    type: 'person'
  },
  { 
    id: '4', 
    title: 'Alpha Protocol', 
    subtitle: 'Confidential', 
    type: 'folder'
  },
  { 
    id: '5', 
    title: 'Marketing Assets', 
    subtitle: 'Shared Drive / Marketing', 
    type: 'folder'
  }
];

export const Autocomplete: React.FC<AutocompleteProps> = ({ initialQuery = 'System De', className }) => {
  const { 
    query, 
    isOpen, 
    activeId, 
    filteredResults,
    highlightedIndex,
    handleInputChange, 
    handleSelect, 
    handleFocus,
    handleKeyDown,
    handleMouseEnterItem,
    containerRef
  } = useAutocomplete(initialQuery, MOCK_RESULTS);

  return (
    <AutocompleteContainer className={className}>
      <SearchLabel text="Search Project or File" />
      
      <div className="relative mb-6" ref={containerRef}>
        <SearchInput 
          value={query} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
        
        <DropdownContainer isOpen={isOpen}>
          {filteredResults.length > 0 ? (
            <>
              <GroupHeader text="Suggested Matches" />
              <ul role="listbox">
                {filteredResults.map((item, index) => (
                  <ResultItem 
                    key={item.id} 
                    item={item} 
                    isActive={activeId === item.id}
                    isHighlighted={highlightedIndex === index}
                    query={query}
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => handleMouseEnterItem(index)}
                  />
                ))}
              </ul>
            </>
          ) : (
            <NoResults />
          )}
        </DropdownContainer>
      </div>

      <SearchFooter />
    </AutocompleteContainer>
  );
};

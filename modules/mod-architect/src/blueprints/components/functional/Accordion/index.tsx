import React from 'react';
import { useAccordion } from './useAccordion';
import { AccordionContainer, AccordionWrapper, AccordionHeader, AccordionBody } from './components';
import { AccordionItemData } from './utils';

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false, className }) => {
  const { isExpanded, toggle } = useAccordion(allowMultiple);

  return (
    <AccordionContainer className={className}>
      {items.map((item) => {
        const open = isExpanded(item.id);
        return (
          <AccordionWrapper key={item.id} isOpen={open}>
            <AccordionHeader 
              title={item.title} 
              isOpen={open} 
              onClick={() => toggle(item.id)} 
            />
            <AccordionBody isOpen={open}>
              {item.content}
            </AccordionBody>
          </AccordionWrapper>
        );
      })}
    </AccordionContainer>
  );
};

import React from 'react';
import { useAccordion } from '@blueprints/components/functional/Accordion/useAccordion';
import { AccordionContainer, AccordionWrapper, AccordionHeader, AccordionBody } from '@blueprints/components/functional/Accordion/components';
import type { AccordionItemData } from '@blueprints/components/functional/Accordion/utils';

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

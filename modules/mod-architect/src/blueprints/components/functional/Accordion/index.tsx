import React from 'react';
import { useAccordion } from '@blueprints/components/functional/Accordion/useAccordion';
import { AccordionContainer, AccordionWrapper, AccordionHeader, AccordionBody } from '@blueprints/components/functional/Accordion/components';
import type { AccordionItemData } from '@blueprints/components/functional/Accordion/utils';

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: AccordionItemData[] = [
  { id: '1', title: 'What is LoopDev?', content: 'LoopDev is a next-gen digital product OS.' },
  { id: '2', title: 'How does the Architect work?', content: 'It automates Design System migration using AI.' },
  { id: '3', title: 'Is it scalable?', content: 'Absolutely, it is built for mass enterprise scale.' }
];

export const Accordion: React.FC<AccordionProps> = ({ 
  items = DEFAULT_ITEMS, 
  allowMultiple = false, 
  className 
}) => {
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

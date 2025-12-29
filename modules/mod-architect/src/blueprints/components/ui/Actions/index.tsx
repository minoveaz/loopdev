
import React from 'react';
import { IconButton, IconButtonProps } from '../IconButton';

// Semantic wrappers allow global updates to "Edit" behavior/iconography
// while keeping the implementation details abstract for consumers.

export const EditAction: React.FC<Omit<IconButtonProps, 'icon'>> = (props) => (
  <IconButton 
    icon="edit" 
    tooltip="Edit" 
    variant="neutral" // Default to neutral, but allows override
    {...props} 
  />
);

export const DeleteAction: React.FC<Omit<IconButtonProps, 'icon'>> = (props) => (
  <IconButton 
    icon="delete" 
    tooltip="Delete" 
    variant="danger" 
    {...props} 
  />
);

export const ViewAction: React.FC<Omit<IconButtonProps, 'icon'>> = (props) => (
  <IconButton 
    icon="visibility" 
    tooltip="View Details" 
    variant="primary" 
    {...props} 
  />
);

export const CopyAction: React.FC<Omit<IconButtonProps, 'icon'>> = (props) => (
  <IconButton 
    icon="content_copy" 
    tooltip="Copy to Clipboard" 
    variant="neutral" 
    {...props} 
  />
);

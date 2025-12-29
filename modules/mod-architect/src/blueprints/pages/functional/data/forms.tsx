
import React from 'react';
import { ComponentEntry } from '../types';
import { DateRangePicker } from '../components/functional/DateRangePicker/index';
import { FileUploader } from '../components/functional/FileUploader/index';
import { Autocomplete } from '../components/functional/Autocomplete/index';
import { TagInput } from '../components/functional/TagInput/index';

export const formsData: ComponentEntry[] = [
  {
    id: 'date-range-picker',
    title: 'Range Calendar',
    category: 'Forms',
    description: 'Smart date selection with dual-month view.',
    size: 'wide', 
    component: (
      <div className="w-full max-w-lg transform scale-90 md:scale-100 transition-transform">
        <DateRangePicker initialStartDate={new Date()} />
      </div>
    )
  },
  {
    id: 'file-uploader',
    title: 'Drop Zone',
    category: 'Forms',
    description: 'Drag & drop with simulated progress.',
    size: 'medium',
    component: (
      <div className="w-full">
        <FileUploader maxSizeInBytes={5242880} />
      </div>
    )
  },
  {
    id: 'autocomplete',
    title: 'Smart Search',
    category: 'Forms',
    description: 'Autocomplete with result types & highlighting.',
    size: 'medium',
    component: (
      <div className="w-full h-full min-h-[350px]">
        <Autocomplete />
      </div>
    )
  },
  {
    id: 'tag-input',
    title: 'Multi-Value Input',
    category: 'Forms',
    description: 'Tag creation with validation & limits.',
    size: 'medium',
    component: (
      <div className="w-full h-full">
        <TagInput />
      </div>
    )
  }
];

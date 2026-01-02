
import React from 'react';
import { DateRangePicker } from '@blueprints/components/functional/DateRangePicker/index';
import { FileUploader } from '@blueprints/components/functional/FileUploader/index';
import { Autocomplete } from '@blueprints/components/functional/Autocomplete/index';
import { TagInput } from '@blueprints/components/functional/TagInput/index';

export const ComplexForms: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 w-fit border border-blue-100 dark:border-blue-800">
            <span className="material-symbols-outlined text-primary text-sm">deployed_code</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wide">Core Components v2.4</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Complex Forms</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-3xl">
            Advanced data entry components designed for scalability and precision.
            Engineered to handle complex states, validation, and multi-step processes within the loop.dev ecosystem.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#0d121b] dark:text-white text-xl font-bold tracking-tight">Date Range Picker</h2>
            <span className="text-xs font-mono text-slate-400">Comp.DateRangePicker</span>
          </div>
          
          {/* Modular Component Usage */}
          <DateRangePicker 
            initialStartDate={new Date(2023, 9, 12)}
            initialEndDate={new Date(2023, 9, 24)}
          />

        </section>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#0d121b] dark:text-white text-xl font-bold tracking-tight">Autocomplete &amp; Search</h2>
            <span className="text-xs font-mono text-slate-400">Comp.Typeahead</span>
          </div>
          
          <Autocomplete />

        </section>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#0d121b] dark:text-white text-xl font-bold tracking-tight">File Uploader</h2>
            <span className="text-xs font-mono text-slate-400">Comp.FileDrop</span>
          </div>
          
          {/* Modular Component Usage */}
          <FileUploader 
            maxSizeInBytes={10 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
          />

        </section>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#0d121b] dark:text-white text-xl font-bold tracking-tight">Multi-Value Input</h2>
            <span className="text-xs font-mono text-slate-400">Comp.TagInput</span>
          </div>
          
          {/* Modular Component Usage */}
          <TagInput />
          
        </section>
      </div>
    </div>
  );
};

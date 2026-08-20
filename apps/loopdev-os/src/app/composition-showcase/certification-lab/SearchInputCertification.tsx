'use client';

import { useState } from 'react';
import { Button, Heading, SearchInput } from '@loopdev/ui';

export function SearchInputCertification() {
  const [query, setQuery] = useState('');
  const [themedQuery, setThemedQuery] = useState('');
  const [loadingQuery, setLoadingQuery] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <section className="space-y-4" aria-labelledby="search-input-examples">
      <div>
        <Heading
          as="h2"
          id="search-input-examples"
          size="lg"
          weight="bold"
          className="text-text-main"
        >
          SearchInput
        </Heading>
        <p className="text-sm text-text-muted">
          Controlled query entry with semantic tenant colors, clear, submit and loading states.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="certification-search-default" className="text-xs text-text-muted">
            Default semantic tokens
          </label>
          <SearchInput
            id="certification-search-default"
            value={themedQuery}
            onValueChange={setThemedQuery}
            placeholder="Search contacts, workspaces or records"
            aria-label="Search records"
            onSubmit={() => undefined}
          />
          <p className="text-xs text-text-muted" aria-live="polite">
            Query: {query || 'empty'}
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="certification-search-themed" className="text-xs text-text-muted">
            Tenant override props
          </label>
          <SearchInput
            id="certification-search-themed"
            value={loadingQuery}
            onValueChange={setLoadingQuery}
            placeholder="Tenant-colored search"
            aria-label="Search tenant records"
            tone="accent"
            colors={{
              surface: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
              border: 'var(--color-primary)',
              text: 'var(--color-text-main)',
              placeholder: 'var(--color-text-muted)',
              accent: 'var(--color-primary)',
            }}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="certification-search-loading" className="text-xs text-text-muted">
            Loading state
          </label>
          <SearchInput
            id="certification-search-loading"
            value={query}
            onValueChange={setQuery}
            loading={loading}
            aria-label="Search while loading"
            placeholder="Press the button to simulate loading"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLoading((current) => !current)}
          >
            {loading ? 'Stop loading' : 'Simulate loading'}
          </Button>
        </div>
      </div>
    </section>
  );
}

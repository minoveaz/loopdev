import { test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

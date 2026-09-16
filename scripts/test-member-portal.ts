import React from 'react';
import { render } from '@testing-library/react';
import { UniversalMemberPortal } from '../src/apps/franchise/portal/UniversalMemberPortal';
import { UserProfile, DEFAULT_OS_SETTINGS } from '../src/types/profile';

// Mock FranchiseFactory instead of using the real one since it might be unavailable yet.
const FranchiseFactory = {
  createInstance: (id: string) => ({
    id,
    b1Config: {},
    activeModules: [],
  })
};

// JSDOM Setup is required if we want to run this with npx tsx directly
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>');
global.window = dom.window as any;
global.document = dom.window.document;
// @ts-ignore
if (typeof navigator === 'undefined') {
  global.navigator = dom.window.navigator;
}

const mockProfile: UserProfile = {
  id: 'user-123',
  username: 'test_user',
  displayName: 'Test User',
  avatarUrl: null,
  settings: DEFAULT_OS_SETTINGS,
  createdAt: new Date().toISOString(),
};

async function runTests() {
  console.log('--- Starting Universal Member Portal Tests ---');
  let hasErrors = false;

  const testCases = [
    { id: 'abc_childcare', expectedText: 'Espace Parent' },
    { id: 'rilcot', expectedText: 'Espace Adhérent' },
    { id: 'marina_cleaning', expectedText: 'Espace Client' },
  ];

  for (const tc of testCases) {
    try {
      console.log(`\nTesting franchise: ${tc.id}`);
      const franchiseInstance = FranchiseFactory.createInstance(tc.id as any);

      const { getByText, getByTestId, unmount } = render(
        React.createElement(UniversalMemberPortal, { franchise: franchiseInstance, profile: mockProfile })
      );

      // Verify basic portal rendering and branding
      const portal = getByTestId(`portal-${tc.id}`);
      if (!portal) throw new Error('Portal wrapper not found');

      // Verify specific sub-component loaded
      const specificText = getByText(new RegExp(tc.expectedText, 'i'));
      if (!specificText) throw new Error(`Expected text "${tc.expectedText}" not found`);

      console.log(`✅ ${tc.id} rendered successfully with correct profile component.`);
      unmount();
    } catch (error) {
      console.error(`❌ Test failed for ${tc.id}:`, error);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\n❌ Some tests failed.');
    process.exit(1);
  } else {
    console.log('\n✅ All Member Portal tests passed successfully!');
    process.exit(0);
  }
}

runTests();
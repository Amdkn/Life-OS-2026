/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Desktop } from './components/Desktop';
import { useThemeApply } from './hooks/useThemeApply';
import { OmniCaptureModal } from './components/OmniCaptureModal';

export default function App() {
  useThemeApply();
  return (
    <>
      <Desktop />
      <OmniCaptureModal />
    </>
  );
}

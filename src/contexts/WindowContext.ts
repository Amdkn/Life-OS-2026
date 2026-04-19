/** WindowContext — allows child apps to set their active page in breadcrumbs */
import { createContext } from 'react';

export interface WindowContextValue {
  setActivePage: (page: string) => void;
}

export const WindowContext = createContext<WindowContextValue>({
  setActivePage: () => {},
});

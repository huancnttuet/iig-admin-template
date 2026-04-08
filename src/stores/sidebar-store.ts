import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SidebarState = {
  menuOpenState: Record<string, boolean>;
  setMenuOpen: (key: string, open: boolean) => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      menuOpenState: {},
      setMenuOpen: (key, open) =>
        set((state) => ({
          menuOpenState: {
            ...state.menuOpenState,
            [key]: open,
          },
        })),
    }),
    {
      name: 'sidebar-menu-state',
      partialize: (state) => ({
        menuOpenState: state.menuOpenState,
      }),
    },
  ),
);

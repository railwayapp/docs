import create from "zustand";

type IStore = {
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
};

export const useStore = create<IStore>(set => ({
  isSearchOpen: false,
  setIsSearchOpen: (value: boolean) =>
    set(state => ({ ...state, isSearchOpen: value })),
}));

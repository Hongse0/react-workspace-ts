import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
    isAuthed: boolean;
    accessToken: string | null;
    hasHydrated: boolean;
    setHasHydrated: (v: boolean) => void;
    login: (token: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthed: false,
            accessToken: null,

            hasHydrated: false,
            setHasHydrated: (v) => set({ hasHydrated: v }),

            login: (token) => set({ isAuthed: true, accessToken: token }),
            logout: () => set({ isAuthed: false, accessToken: null }),
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ isAuthed: s.isAuthed, accessToken: s.accessToken }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
    isAuthed: boolean;
    accessToken: string | null;
    nickname: string | null;
    hasHydrated: boolean;
    setHasHydrated: (v: boolean) => void;
    login: (token: string, nickname: string) => void;
    logout: () => void;
};

const isTokenExpired = (token: string | null) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthed: false,
            accessToken: null,
            nickname: null,
            hasHydrated: false,

            setHasHydrated: (v) => set({ hasHydrated: v }),

            login: (token, nickname) =>
                set({
                    isAuthed: true,
                    accessToken: token,
                    nickname,
                }),

            logout: () =>
                set({
                    isAuthed: false,
                    accessToken: null,
                    nickname: null,
                }),
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => localStorage),

            partialize: (s) => ({
                accessToken: s.accessToken,
                nickname: s.nickname,
            }),

            onRehydrateStorage: () => (state) => {
                if (!state) return;

                const expired = isTokenExpired(state.accessToken);

                if (expired) {
                    state.logout();
                } else {
                    state.login(state.accessToken!, state.nickname ?? '회원');
                }

                state.setHasHydrated(true);
            },
        }
    )
);
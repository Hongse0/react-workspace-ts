import { create } from 'zustand';

type AuthState = {
    isAuthed: boolean;
    accessToken: string | null;
    login: (token: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    isAuthed: false,
    accessToken: null,

    login: (token) =>
        set(() => ({
            isAuthed: true,
            accessToken: token,
        })),

    logout: () =>
        set(() => ({
            isAuthed: false,
            accessToken: null,
        })),
}));

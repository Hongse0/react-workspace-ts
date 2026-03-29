import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResult = {
    accessToken: string;
    expiresIn: number;
};

export interface AuthV1 {
    login(body: LoginRequest): Promise<ServerResponse<LoginResult, LoginRequest>>;
    logout(): Promise<ServerResponse<void, unknown>>;
}

export class AuthService extends BaseAPIService implements AuthV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "cms");
    }

    login(body: LoginRequest): Promise<ServerResponse<LoginResult, LoginRequest>> {
        return this.post<LoginResult, LoginRequest>("/auth/login", body);
    }

    logout(): Promise<ServerResponse<void, unknown>> {
        return this.post<void, undefined>("/auth/logout");
    }
}
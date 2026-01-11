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
}

export class AuthService extends BaseAPIService implements AuthV1 {
    constructor(baseUrl: string, token?: string) {
        // BaseAPIService(baseUrl, version, domain, token)
        // => /v1/cms/auth/xxx
        super(baseUrl, "v1", "cms", token);
    }

    login(body: LoginRequest): Promise<ServerResponse<LoginResult, LoginRequest>> {
        return this.post<LoginResult, LoginRequest>("/auth/login", body);
    }

    // signup(body: SignupRequest): Promise<ServerResponse<void>> {
    //   return this.post<void>("/auth/signup", body);
    // }

    // logout(): Promise<ServerResponse<void>> {
    //   return this.post<void>("/auth/logout");
    // }
}

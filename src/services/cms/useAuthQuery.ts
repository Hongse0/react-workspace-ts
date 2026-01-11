import { useMutation } from '@tanstack/react-query';
import { AuthService, type LoginRequest, type LoginResult } from '../../module/common/AuthService';
import { envConfig } from '../../module/constants/envConfig';

const authService = new AuthService(envConfig.API_URL);

/**
 * 로그인 mutation
 * - 성공: result(LoginResult) 반환
 * - 실패: throw Error(messages[0])
 */
export const useLoginMutation = () => {
    return useMutation({
        mutationKey: ['auth', 'login'],
        mutationFn: async (body: LoginRequest): Promise<LoginResult> => {
            const {
                data: { code, result, messages },
            } = await authService.login(body);

            if (code !== '000000') {
                const msg = messages?.[0] ?? '로그인에 실패했습니다.';
                console.error(`${code}: ${msg}`);
                throw new Error(msg);
            }

            return result;
        },
    });
};

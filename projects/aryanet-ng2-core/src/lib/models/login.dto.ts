export interface LoginDto {
    username: string;
    password: string;
    rememberMe: boolean;
 }

 
export interface VerifyDto {
    username: string;
    verifyCode: string;
 }

 
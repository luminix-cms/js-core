import { Model } from './Model';


export type AuthCredentials = {
    email: string;
    password: string;
};

export type AuthFacade = {
    attempt(credentials: AuthCredentials, remember: boolean, onSubmit?: (e: Event) => void): void;
    check(): boolean;
    logout(onSubmit?: (e: Event) => void): void;
    user(): Model | null;
    id(): number | string | null;
};

export abstract class AuthDriver {
    abstract attempt(credentials: AuthCredentials, remember: boolean): void;
    abstract logout(): void;
    abstract user(): Model | null;
}

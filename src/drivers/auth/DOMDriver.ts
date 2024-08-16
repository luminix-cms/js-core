// Auth driver using dom


import { AppFacade } from '../../types/App'; 
import { AuthCredentials, AuthDriver } from '../../types/Auth';
import { Model } from '../../types/Model';
import { JsonObject } from '../../types/Support';

export type DOMDriverOptions = {
    routes?: {
        login?: string;
        logout?: string;
    },
}

export default class DOMDriver extends AuthDriver {

    private _user: Model | undefined;

    constructor(
        private readonly app: AppFacade,
        private readonly options: DOMDriverOptions = {},
    ) {
        super();
    }

    attempt(
        credentials: AuthCredentials,
        remember: boolean = false,
    ) {
        const form = document.createElement('form');

        form.method = 'post';
        form.action = this.app.make('route').url(this.options.routes?.login ?? 'login');
        form.style.display = 'none';

        const csrfToken = this.app.make('config').get('auth.csrf');

        if (typeof csrfToken === 'string') {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;

            form.appendChild(csrfInput);
        }

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.value = credentials.email;
        form.appendChild(emailInput);

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.name = 'password';
        passwordInput.value = credentials.password;
        form.appendChild(passwordInput);

        if (remember) {
            const rememberInput = document.createElement('input');
            rememberInput.type = 'checkbox';
            rememberInput.name = 'remember';
            rememberInput.value = '1';
            rememberInput.checked = true;
            form.appendChild(rememberInput);
        }

        document.body.appendChild(form);

        form.dispatchEvent(new Event('submit', { 
            cancelable: true,
            bubbles: true
        }));
    }

    logout() {
        // Append a form to the document and submit it
        const form = document.createElement('form');

        form.method = 'post';
        form.action = this.app.make('route').url(this.options.routes?.logout ?? 'logout');
        form.style.display = 'none';

        const csrfToken = this.app.make('config').get('auth.csrf');

        if (typeof csrfToken === 'string') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = '_token';
            input.value = csrfToken;

            form.appendChild(input);
        }
        document.body.appendChild(form);

        form.dispatchEvent(new Event('submit', { 
            cancelable: true,
            bubbles: true
        }));
    }

    user(): Model | null {
        if (!this._user) {
            const { model, config } = this.app.make();

            const User = model.make('user');
            const userData = config.get('auth.user');

            if (!userData) {
                return null;
            }

            this._user = new User(userData as JsonObject); 
        }
        return this._user;
    }

}


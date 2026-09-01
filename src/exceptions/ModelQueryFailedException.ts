
import { Response } from '@luminix/support';

export default class ModelQueryFailedException extends Error {

    [Symbol.toStringTag] = 'ModelQueryFailedException';

    constructor(model: string, public readonly response: Response) {
        const message = response.json('message');

        super(`[Luminix] Query for model "${model}" failed with status ${response.status()}`
            + (typeof message === 'string' && message !== '' ? `: ${message}` : ''));
    }
}

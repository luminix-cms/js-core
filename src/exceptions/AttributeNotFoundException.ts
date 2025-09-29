

export default class AttributeNotFoundException extends Error {

    [Symbol.toStringTag] = 'AttributeNotFoundException';

    constructor(abstract: string, attribute: string) {
        super(`[Luminix] Attribute "${attribute}" not found in model "${abstract}". Check if your database is up to date.`);
    }
}


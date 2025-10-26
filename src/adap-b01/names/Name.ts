export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** 
     * @methodtype constructor
     * Expects that all Name components are properly masked 
     */
    constructor(other: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        // Store components as-is (they are unmasked)
        this.components = [...other];
    }

    /**
     * @methodtype conversion-method
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        // Simply join unmasked components with the delimiter
        return this.components.join(delimiter);
    }

    /** 
     * @methodtype conversion-method
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        // Mask each component for the default delimiter, then join
        return this.components.map(c => this.mask(c, DEFAULT_DELIMITER)).join(DEFAULT_DELIMITER);
    }

    /** 
     * @methodtype get-method
     * Returns properly masked component string 
     */
    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    /** 
     * @methodtype set-method
     * Expects that new Name component c is properly masked 
     */
    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.components[i] = c;
    }

    /**
     * @methodtype get-method
     * Returns number of components in Name instance 
     */
    public getNoComponents(): number {
        return this.components.length;
    }

    /** 
     * @methodtype command-method
     * Expects that new Name component c is properly masked 
     */
    public insert(i: number, c: string): void {
        this.assertIsValidInsertIndex(i);
        this.components.splice(i, 0, c);
    }

    /** 
     * @methodtype command-method
     * Expects that new Name component c is properly masked 
     */
    public append(c: string): void {
        this.components.push(c);
    }

    /**
     * @methodtype command-method
     */
    public remove(i: number): void {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }

    /**
     * @methodtype helper-method
     * Masks a string by escaping special characters (delimiter and escape character)
     */
    private mask(str: string, delimiter: string): string {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            // Escape the delimiter and the escape character itself
            if (char === delimiter || char === ESCAPE_CHARACTER) {
                result += ESCAPE_CHARACTER + char;
            } else {
                result += char;
            }
        }
        return result;
    }

    /**
     * @methodtype assertion-method
     */
    private assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error(`Invalid index: ${i}`);
        }
    }

    /**
     * @methodtype assertion-method
     */
    private assertIsValidInsertIndex(i: number): void {
        if (i < 0 || i > this.components.length) {
            throw new Error(`Invalid insert index: ${i}`);
        }
    }

}
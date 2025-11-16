import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    /** @methodtype initialization-method */
    constructor(source: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.components = [...source];
    }

    /** @methodtype conversion-method */
    public asString(delimiter: string = this.delimiter): string {
        const unmaskedComponents = this.components.map(comp => this.unmask(comp));
        return unmaskedComponents.join(delimiter);
    }

    /** @methodtype conversion-method */
    public asDataString(): string {
        // Unmask components first, then remask for default delimiter
        const remaskedComponents = this.components.map(comp => {
            const unmasked = this.unmask(comp);
            return this.mask(unmasked, DEFAULT_DELIMITER);
        });
        return remaskedComponents.join(DEFAULT_DELIMITER);
    }

    /** @methodtype get-method */
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /** @methodtype boolean-query-method */
    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    /** @methodtype get-method */
    public getNoComponents(): number {
        return this.components.length;
    }

    /** @methodtype get-method */
    public getComponent(i: number): string {
        return this.components[i];
    }

    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    /** @methodtype command-method */
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    /** @methodtype command-method */
    public append(c: string): void {
        this.components.push(c);
    }

    /** @methodtype command-method */
    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    /** @methodtype command-method */
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

    /** @methodtype helper-method */
    private unmask(component: string): string {
        let result = '';
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                // Skip escape character and take next character literally
                result += component[i + 1];
                i += 2;
            } else {
                result += component[i];
                i++;
            }
        }
        return result;
    }

    /** @methodtype helper-method */
    private mask(str: string, delimiter: string): string {
        let result = '';
        for (let char of str) {
            if (char === delimiter || char === ESCAPE_CHARACTER) {
                result += ESCAPE_CHARACTER;
            }
            result += char;
        }
        return result;
    }

}
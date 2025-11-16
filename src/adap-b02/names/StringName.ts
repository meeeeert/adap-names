import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    /** @methodtype initialization-method */
    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.name = source;
        this.noComponents = this.parseComponents().length;
    }

    /** @methodtype conversion-method */
    public asString(delimiter: string = this.delimiter): string {
        const components = this.parseComponents();
        const unmaskedComponents = components.map(comp => this.unmask(comp));
        return unmaskedComponents.join(delimiter);
    }

    /** @methodtype conversion-method */
    public asDataString(): string {
        const components = this.parseComponents();
        // Unmask components first, then remask for default delimiter
        const remaskedComponents = components.map(comp => {
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
        return this.noComponents === 0;
    }

    /** @methodtype get-method */
    public getNoComponents(): number {
        return this.noComponents;
    }

    /** @methodtype get-method */
    public getComponent(x: number): string {
        const components = this.parseComponents();
        return components[x];
    }

    /** @methodtype set-method */
    public setComponent(n: number, c: string): void {
        const components = this.parseComponents();
        components[n] = c;
        this.rebuildFromComponents(components);
    }

    /** @methodtype command-method */
    public insert(n: number, c: string): void {
        const components = this.parseComponents();
        components.splice(n, 0, c);
        this.rebuildFromComponents(components);
    }

    /** @methodtype command-method */
    public append(c: string): void {
        const components = this.parseComponents();
        components.push(c);
        this.rebuildFromComponents(components);
    }

    /** @methodtype command-method */
    public remove(n: number): void {
        const components = this.parseComponents();
        components.splice(n, 1);
        this.rebuildFromComponents(components);
    }

    /** @methodtype command-method */
    public concat(other: Name): void {
        const components = this.parseComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.rebuildFromComponents(components);
    }

    /** @methodtype helper-method */
    private parseComponents(): string[] {
        if (this.name === "") {
            return [];
        }

        const components: string[] = [];
        let currentComponent = '';
        let i = 0;

        while (i < this.name.length) {
            if (this.name[i] === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                // Escaped character - add both escape and next char to component
                currentComponent += this.name[i] + this.name[i + 1];
                i += 2;
            } else if (this.name[i] === this.delimiter) {
                // Delimiter found - save current component and start new one
                components.push(currentComponent);
                currentComponent = '';
                i++;
            } else {
                // Regular character
                currentComponent += this.name[i];
                i++;
            }
        }

        // Don't forget the last component
        components.push(currentComponent);

        return components;
    }

    /** @methodtype helper-method */
    private rebuildFromComponents(components: string[]): void {
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
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
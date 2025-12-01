import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Precondition delimiter valid
        this.assertIsValidDelimiter(delimiter);

        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        // Precondition delimiter valid
        this.assertIsValidDelimiter(delimiter);

        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.unmask(this.getComponent(i)));
        }
        return components.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const unmasked = this.unmask(this.getComponent(i));
            components.push(this.mask(unmasked, DEFAULT_DELIMITER));
        }
        return components.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        // Precondition other not null or undefined
        this.assertIsNotNullOrUndefined(other, "other");

        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // Precondition other not null or undefined
        this.assertIsNotNullOrUndefined(other, "other");

        const oldCount = this.getNoComponents();
        const otherCount = other.getNoComponents();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        // Postcondition component count equal sum of counts
        const newCount = this.getNoComponents();
        MethodFailedException.assert(
            newCount === oldCount + otherCount,
            "concat failed: component count mismatch"
        );

        this.assertClassInvariants();
    }

    protected unmask(component: string): string {
        let result = '';
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                result += component[i + 1];
                i += 2;
            } else {
                result += component[i];
                i++;
            }
        }
        return result;
    }

    protected mask(str: string, delimiter: string): string {
        let result = '';
        for (let char of str) {
            if (char === delimiter || char === ESCAPE_CHARACTER) {
                result += ESCAPE_CHARACTER;
            }
            result += char;
        }
        return result;
    }

    // precondition assrtion methods

    protected assertIsNotNullOrUndefined(obj: any, name: string = "object"): void {
        IllegalArgumentException.assert(
            obj !== null && obj !== undefined,
            `${name} is null or undefined`
        );
    }

    protected assertIsValidIndex(i: number): void {
        IllegalArgumentException.assert(
            typeof i === 'number',
            "index must be a number"
        );
        IllegalArgumentException.assert(
            i >= 0 && i < this.getNoComponents(),
            `index out of bounds: ${i} (valid range: 0 to ${this.getNoComponents() - 1})`
        );
    }

    protected assertIsValidInsertIndex(i: number): void {
        IllegalArgumentException.assert(
            typeof i === 'number',
            "index must be a number"
        );
        IllegalArgumentException.assert(
            i >= 0 && i <= this.getNoComponents(),
            `insert index out of bounds: ${i} (valid range: 0 to ${this.getNoComponents()})`
        );
    }

    protected assertIsValidDelimiter(delimiter: string): void {
        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined,
            "delimiter is null or undefined"
        );
        IllegalArgumentException.assert(
            typeof delimiter === 'string',
            "delimiter must be a string"
        );
        IllegalArgumentException.assert(
            delimiter.length === 1,
            `delimiter must be a single character, got: '${delimiter}' (length: ${delimiter.length})`
        );
    }

    // class invariant assertion method

    protected assertClassInvariants(): void {
        InvalidStateException.assert(
            this.getNoComponents() >= 0,
            "invalid state: number of components is negative"
        );

        InvalidStateException.assert(
            this.delimiter !== null && this.delimiter !== undefined && this.delimiter.length === 1,
            "invalid state: delimiter is not a single character"
        );
    }
}

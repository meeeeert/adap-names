import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        // precondition source is not null
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "source is null or undefined"
        );

        super(delimiter);

        this.components = [...source];

        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        // Precondition: valid index
        this.assertIsValidIndex(i);

        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        // Preconditions
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        this.components[i] = c;

        // Postcondition: verify component was set
        MethodFailedException.assert(
            this.components[i] === c,
            "setComponent failed: component not set correctly"
        );

        // Class invariant
        this.assertClassInvariants();
    }

    public insert(i: number, c: string): void {
        // Preconditions
        this.assertIsValidInsertIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        const oldCount = this.getNoComponents();

        this.components.splice(i, 0, c);

        // Postconditions
        MethodFailedException.assert(
            this.getNoComponents() === oldCount + 1,
            "insert failed: component count did not increase by 1"
        );
        MethodFailedException.assert(
            this.components[i] === c,
            "insert failed: component not inserted at correct position"
        );

        // Class invariant
        this.assertClassInvariants();
    }

    public append(c: string): void {
        // Precondition
        this.assertIsNotNullOrUndefined(c, "component");

        const oldCount = this.getNoComponents();

        this.components.push(c);

        // Postconditions
        MethodFailedException.assert(
            this.getNoComponents() === oldCount + 1,
            "append failed: component count did not increase by 1"
        );
        MethodFailedException.assert(
            this.components[this.components.length - 1] === c,
            "append failed: component not appended correctly"
        );

        // Class invariant
        this.assertClassInvariants();
    }

    public remove(i: number): void {
        // Precondition
        this.assertIsValidIndex(i);

        const oldCount = this.getNoComponents();

        this.components.splice(i, 1);

        // Postcondition
        MethodFailedException.assert(
            this.getNoComponents() === oldCount - 1,
            "remove failed: component count did not decrease by 1"
        );

        // Class invariant
        this.assertClassInvariants();
    }
}

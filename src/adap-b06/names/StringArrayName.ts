import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected readonly components: string[] = [];

    constructor(source: string[], delimiter?: string) {
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
        this.assertIsValidIndex(i);

        return this.components[i];
    }

    public setComponent(i: number, c: string): Name {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        const newComponents = [...this.components];
        newComponents[i] = c;
        const result = new StringArrayName(newComponents, this.delimiter);

        // Postcondition: verify component was set in result
        MethodFailedException.assert(
            result.getComponent(i) === c,
            "setComponent failed: component not set correctly"
        );

        return result;
    }

    public insert(i: number, c: string): Name {
        this.assertIsValidInsertIndex(i);
        this.assertIsValidComponent(c);

        const oldCount = this.getNoComponents();

        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);
        const result = new StringArrayName(newComponents, this.delimiter);

        // Postconditions on result
        MethodFailedException.assert(
            result.getNoComponents() === oldCount + 1,
            "insert failed: component count did not increase by 1"
        );
        MethodFailedException.assert(
            result.getComponent(i) === c,
            "insert failed: component not inserted at correct position"
        );

        return result;
    }

    public append(c: string): Name {
        this.assertIsValidComponent(c);

        const oldCount = this.getNoComponents();

        const newComponents = [...this.components, c];
        const result = new StringArrayName(newComponents, this.delimiter);

        // Postconditions on result
        MethodFailedException.assert(
            result.getNoComponents() === oldCount + 1,
            "append failed: component count did not increase by 1"
        );
        MethodFailedException.assert(
            result.getComponent(result.getNoComponents() - 1) === c,
            "append failed: component not appended correctly"
        );

        return result;
    }

    public remove(i: number): Name {
        this.assertIsValidIndex(i);

        const oldCount = this.getNoComponents();

        const newComponents = [...this.components];
        newComponents.splice(i, 1);
        const result = new StringArrayName(newComponents, this.delimiter);

        // Postcondition on result
        MethodFailedException.assert(
            result.getNoComponents() === oldCount - 1,
            "remove failed: component count did not decrease by 1"
        );

        return result;
    }
}

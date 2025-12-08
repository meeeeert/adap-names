import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        // Precondition: source is not null
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "source is null or undefined"
        );

        super(delimiter);

        this.name = source;
        this.noComponents = this.parseComponents().length;

        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        // Precondition: valid index
        this.assertIsValidIndex(i);

        const components = this.parseComponents();
        return components[i];
    }

    public setComponent(i: number, c: string): void {
        // Preconditions
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        const components = this.parseComponents();
        components[i] = c;
        this.rebuildFromComponents(components);

        // Postcondition: verify component was set
        MethodFailedException.assert(
            this.getComponent(i) === c,
            "setComponent failed: component not set correctly"
        );

        // Class invariant
        this.assertClassInvariants();
    }

    public insert(i: number, c: string): void {
        // Preconditions
        this.assertIsValidInsertIndex(i);
        this.assertIsValidComponent(c);

        const oldCount = this.getNoComponents();

        const components = this.parseComponents();
        components.splice(i, 0, c);
        this.rebuildFromComponents(components);

        // Postconditions
        MethodFailedException.assert(
            this.getNoComponents() === oldCount + 1,
            "insert failed: component count did not increase by 1"
        );
        MethodFailedException.assert(
            this.getComponent(i) === c,
            "insert failed: component not inserted at correct position"
        );

        // Class invariant
        this.assertClassInvariants();
    }

    public append(c: string): void {
        // Precondition
        this.assertIsValidComponent(c);

        const oldCount = this.getNoComponents();

        const components = this.parseComponents();
        components.push(c);
        this.rebuildFromComponents(components);

        // Postconditions
        MethodFailedException.assert(
            this.getNoComponents() === oldCount + 1,
            "append failed: component count did not increase by 1"
        );
        MethodFailedException.assert(
            this.getComponent(this.getNoComponents() - 1) === c,
            "append failed: component not appended correctly"
        );

        // Class invariant
        this.assertClassInvariants();
    }

    public remove(i: number): void {
        // Precondition
        this.assertIsValidIndex(i);

        const oldCount = this.getNoComponents();

        const components = this.parseComponents();
        components.splice(i, 1);
        this.rebuildFromComponents(components);

        // Postcondition
        MethodFailedException.assert(
            this.getNoComponents() === oldCount - 1,
            "remove failed: component count did not decrease by 1"
        );

        // Class invariant
        this.assertClassInvariants();
    }

    private parseComponents(): string[] {
        if (this.name === "") {
            return [];
        }

        const components: string[] = [];
        let currentComponent = '';
        let i = 0;

        while (i < this.name.length) {
            if (this.name[i] === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                currentComponent += this.name[i] + this.name[i + 1];
                i += 2;
            } else if (this.name[i] === this.delimiter) {
                components.push(currentComponent);
                currentComponent = '';
                i++;
            } else {
                currentComponent += this.name[i];
                i++;
            }
        }
        components.push(currentComponent);
        return components;
    }

    private rebuildFromComponents(components: string[]): void {
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }
}

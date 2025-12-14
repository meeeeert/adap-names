import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected readonly name: string = "";
    protected readonly noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
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
        this.assertIsValidIndex(i);

        const components = this.parseComponents();
        return components[i];
    }

    public setComponent(i: number, c: string): Name {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        const components = this.parseComponents();
        components[i] = c;
        const newName = components.join(this.delimiter);
        const result = new StringName(newName, this.delimiter);

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

        const components = this.parseComponents();
        components.splice(i, 0, c);
        const newName = components.join(this.delimiter);
        const result = new StringName(newName, this.delimiter);

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

        const components = this.parseComponents();
        components.push(c);
        const newName = components.join(this.delimiter);
        const result = new StringName(newName, this.delimiter);

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

        const components = this.parseComponents();
        components.splice(i, 1);
        const newName = components.length === 0 ? "" : components.join(this.delimiter);
        const result = new StringName(newName, this.delimiter);

        // Postcondition on result
        MethodFailedException.assert(
            result.getNoComponents() === oldCount - 1,
            "remove failed: component count did not decrease by 1"
        );

        return result;
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
}

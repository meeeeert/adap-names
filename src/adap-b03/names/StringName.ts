import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.parseComponents().length;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const components = this.parseComponents();
        return components[i];
    }

    public setComponent(i: number, c: string) {
        const components = this.parseComponents();
        components[i] = c;
        this.rebuildFromComponents(components);
    }

    public insert(i: number, c: string) {
        const components = this.parseComponents();
        components.splice(i, 0, c);
        this.rebuildFromComponents(components);
    }

    public append(c: string) {
        const components = this.parseComponents();
        components.push(c);
        this.rebuildFromComponents(components);
    }

    public remove(i: number) {
        const components = this.parseComponents();
        components.splice(i, 1);
        this.rebuildFromComponents(components);
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
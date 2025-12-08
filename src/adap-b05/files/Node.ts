import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        try {
            this.assertValidSearchName(bn);

            const matches: Set<Node> = new Set<Node>();
            this.collectNodes(bn.trim(), matches);

            return matches;
        } catch (error) {
            if (this.providesFileSystemService()) {
                if (error instanceof IllegalArgumentException) {
                    throw error;
                }
                if (error instanceof Exception) {
                    throw new ServiceFailureException("findNodes failed", error);
                }
                throw new ServiceFailureException("findNodes failed");
            }
            throw error;
        }
    }

    protected collectNodes(bn: string, matches: Set<Node>): void {
        const baseName = this.getValidatedBaseName();
        if (baseName === bn) {
            matches.add(this);
        }

        for (const child of this.getChildNodes()) {
            child.collectNodes(bn, matches);
        }
    }

    protected getChildNodes(): Iterable<Node> {
        return [] as Node[];
    }

    protected getValidatedBaseName(): string {
        const baseName = this.getBaseName();

        InvalidStateException.assert(
            baseName !== null && baseName !== undefined,
            "invalid state: basename is null or undefined"
        );
        InvalidStateException.assert(
            typeof baseName === "string",
            "invalid state: basename must be a string"
        );
        if (!this.allowsEmptyBaseName()) {
            InvalidStateException.assert(
                baseName.length > 0,
                "invalid state: basename must not be empty"
            );
        }

        return baseName;
    }

    protected allowsEmptyBaseName(): boolean {
        return this.isRootNode();
    }

    protected assertValidSearchName(bn: string): void {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "basename is null or undefined"
        );
        IllegalArgumentException.assert(
            typeof bn === "string",
            "basename must be a string"
        );
        IllegalArgumentException.assert(
            bn.trim().length > 0,
            "basename must not be empty"
        );
    }

    protected providesFileSystemService(): boolean {
        return this.isRootNode();
    }

    protected isRootNode(): boolean {
        return this.parentNode === (this as unknown as Directory);
    }

}

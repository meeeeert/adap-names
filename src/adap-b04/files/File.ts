import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        // Precondition: file must be closed
        this.assertIsClosedFile();

        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        // Preconditions: file must be open
        this.assertIsOpenFile();
        IllegalArgumentException.assert(
            noBytes >= 0,
            `noBytes must be non-negative, got: ${noBytes}`
        );

        // read something
        return new Int8Array();
    }

    public close(): void {
        // Precondition: file must be open
        this.assertIsOpenFile();

        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    // State query methods

    public isOpen(): boolean {
        return this.state === FileState.OPEN;
    }

    public isClosed(): boolean {
        return this.state === FileState.CLOSED;
    }

    public isDeleted(): boolean {
        return this.state === FileState.DELETED;
    }

    // Precondition assertion methods

    protected assertIsOpenFile(): void {
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be open"
        );
    }

    protected assertIsClosedFile(): void {
        IllegalArgumentException.assert(
            this.state === FileState.CLOSED,
            "file must be closed"
        );
    }

    protected assertIsNotDeleted(): void {
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED,
            "file is deleted"
        );
    }
}

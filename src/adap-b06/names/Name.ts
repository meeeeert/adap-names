import { Equality } from "../common/Equality";
import { Cloneable } from "../common/Cloneable";
import { Printable } from "../common/Printable";

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 *
 * Homogenous name examples
 *
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 *
 * Name is a value type implemented as an immutable object.
 * All "mutation" methods return a new Name instance with the modified value.
 */
export interface Name extends Cloneable, Printable, Equality {

    /**
     * Returns true, if number of components == 0; else false
     */
    isEmpty(): boolean;

    /**
     * Returns number of components in Name instance
     */
    getNoComponents(): number;

    /**
     * Returns component at index i
     * @throws IllegalArgumentException if i is out of bounds
     */
    getComponent(i: number): string;

    /**
     * Returns a new Name with component at index i set to c
     * Expects that new Name component c is properly masked
     * @throws IllegalArgumentException if i is out of bounds or c is invalid
     */
    setComponent(i: number, c: string): Name;

    /**
     * Returns a new Name with component c inserted at index i
     * Expects that new Name component c is properly masked
     * @throws IllegalArgumentException if i is out of bounds or c is invalid
     */
    insert(i: number, c: string): Name;

    /**
     * Returns a new Name with component c appended at the end
     * Expects that new Name component c is properly masked
     * @throws IllegalArgumentException if c is invalid
     */
    append(c: string): Name;

    /**
     * Returns a new Name with component at index i removed
     * @throws IllegalArgumentException if i is out of bounds
     */
    remove(i: number): Name;

    /**
     * Returns a new Name that is the concatenation of this and other
     * @throws IllegalArgumentException if other is null/undefined
     */
    concat(other: Name): Name;

}

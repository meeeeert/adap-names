import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";

describe("Testing contract violations for Name (preconditions)", () => {

  describe("When creating a Name", () => {
    it("throws error for invalid delimiter", () => {
      expect(() => new StringArrayName(["test"], null as any))
        .toThrow(IllegalArgumentException);
      expect(() => new StringArrayName(["test"], ""))
        .toThrow(IllegalArgumentException);
    });

    it("throws error for null/undefined source", () => {
      expect(() => new StringArrayName(null as any))
        .toThrow(IllegalArgumentException);
      expect(() => new StringName(undefined as any))
        .toThrow(IllegalArgumentException);
    });
  });

  describe("When calling getComponent", () => {
    it("throws error for invalid index", () => {
      const name = new StringArrayName(["oss", "cs", "fau", "de"]);
      expect(() => name.getComponent(-1))
        .toThrow(IllegalArgumentException);
      expect(() => name.getComponent(4))
        .toThrow(IllegalArgumentException);
    });
  });

  describe("When calling setComponent", () => {
    it("throws error for invalid index or component", () => {
      const name = new StringArrayName(["oss", "cs", "fau", "de"]);
      expect(() => name.setComponent(-1, "test"))
        .toThrow(IllegalArgumentException);
      expect(() => name.setComponent(0, null as any))
        .toThrow(IllegalArgumentException);
    });
  });

  describe("When calling insert", () => {
    it("throws error for invalid index or component", () => {
      const name = new StringArrayName(["oss", "cs", "fau", "de"]);
      expect(() => name.insert(-1, "test"))
        .toThrow(IllegalArgumentException);
      expect(() => name.insert(0, null as any))
        .toThrow(IllegalArgumentException);
    });
  });

  describe("When calling append/remove/concat", () => {
    it("throws error for null component or parameter", () => {
      const name = new StringArrayName(["oss", "cs"]);
      expect(() => name.append(null as any))
        .toThrow(IllegalArgumentException);
      expect(() => name.remove(-1))
        .toThrow(IllegalArgumentException);
      expect(() => name.concat(null as any))
        .toThrow(IllegalArgumentException);
    });
  });
});

describe("Testing Name postconditions", () => {

  it("setComponent updates the component correctly", () => {
    const name = new StringArrayName(["oss", "cs", "fau", "de"]);
    name.setComponent(1, "test");
    expect(name.getComponent(1)).toBe("test");
  });

  it("insert adds component and increases size", () => {
    const name = new StringArrayName(["oss", "cs", "fau", "de"]);
    const oldCount = name.getNoComponents();
    name.insert(1, "new");
    expect(name.getNoComponents()).toBe(oldCount + 1);
    expect(name.getComponent(1)).toBe("new");
  });

  it("append adds component at the end", () => {
    const name = new StringArrayName(["oss", "cs"]);
    const oldCount = name.getNoComponents();
    name.append("com");
    expect(name.getNoComponents()).toBe(oldCount + 1);
    expect(name.getComponent(name.getNoComponents() - 1)).toBe("com");
  });

  it("remove decreases size correctly", () => {
    const name = new StringArrayName(["oss", "cs", "fau", "de"]);
    const oldCount = name.getNoComponents();
    name.remove(1);
    expect(name.getNoComponents()).toBe(oldCount - 1);
  });
});

describe("Testing Name invariants", () => {

  it("maintains non-negative component count and valid delimiter", () => {
    const name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(name.getNoComponents()).toBeGreaterThanOrEqual(0);
    expect(name.getDelimiterCharacter().length).toBe(1);
    
    name.append("fau");
    name.remove(0);
    
    expect(name.getNoComponents()).toBeGreaterThanOrEqual(0);
    expect(name.getDelimiterCharacter().length).toBe(1);
  });
});

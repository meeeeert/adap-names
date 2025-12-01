import { describe, it, expect } from "vitest";

import { File } from "../../../src/adap-b04/files/File";
import { RootNode } from "../../../src/adap-b04/files/RootNode";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";

describe("Testing file contract violations (preconditions)", () => {

  describe("When calling open()", () => {
    it("throws error when trying to open an already open file", () => {
      const root = RootNode.getRootNode();
      const file = new File("test.txt", root);

      file.open();

      expect(() => file.open())
        .toThrow(IllegalArgumentException);
    });
  });

  describe("When calling close()", () => {
    it("throws error when trying to close an already closed file", () => {
      const root = RootNode.getRootNode();
      const file = new File("test.txt", root);

      expect(() => file.close())
        .toThrow(IllegalArgumentException);
    });
  });

  describe("When calling read()", () => {
    it("throws error when trying to read from a closed file", () => {
      const root = RootNode.getRootNode();
      const file = new File("test.txt", root);

      expect(() => file.read(100))
        .toThrow(IllegalArgumentException);
    });

    it("throws error when trying to read negative bytes", () => {
      const root = RootNode.getRootNode();
      const file = new File("test.txt", root);

      file.open();
      expect(() => file.read(-1))
        .toThrow(IllegalArgumentException);
    });
  });
});

import { describe, test, expect } from "vitest";
import path from "path";
import { readJsDoc, formatJsDocSchema } from "../src/jsdoc";

describe("jsdoc", () => {
  test("", () => {
    const jsdoc = readJsDoc(path.resolve(__dirname, "./demo.ts"));
    expect(jsdoc.length).toBe(1);

    const schema = formatJsDocSchema(jsdoc[0]);

    expect(schema.name).toBe("formatDate");
    expect(schema.description).toBe("Get the formatted date according to the string of tokens passed in");
    expect(schema.params.length).toBe(1);
    expect(schema.params[0].name).toBe("date");
    expect(schema.params[0].type).toBe("Date");
    expect(schema.params[0].description).toBe("Date");
    expect(schema.returns.type).toBe("string");
    expect(schema.returns.description).toBe("Formatted date");
  });
});

import { describe, expect, it } from "vitest";

import {
  branchIds,
  buildNodes,
  compareValues,
  filterNodes,
  flattenNodes,
  normalizeText,
  sortNodes,
  type ModelColumn,
} from "./table-model";

type Person = { id: string; name: string; age: number | null; children?: Person[] };

const people: Person[] = [
  { id: "a", name: "Zoë", age: 30 },
  { id: "b", name: "João", age: 25 },
  { id: "c", name: "Ana", age: null },
];

const columns: ModelColumn<Person>[] = [
  { id: "name", accessor: "name" },
  { id: "age", accessor: "age" },
];

const nodesOf = (data: Person[]) =>
  buildNodes(data, {
    getRowId: (row) => row.id,
    getSubRows: (row) => row.children,
  });

const ids = (nodes: { id: string }[]) => nodes.map((node) => node.id);

describe("normalizeText", () => {
  it("lowers the case and drops the accents", () => {
    expect(normalizeText("João")).toBe("joao");
    expect(normalizeText("ÀÉÎ")).toBe("aei");
  });

  it("turns other values into a text", () => {
    expect(normalizeText(42)).toBe("42");
    expect(normalizeText(null)).toBe("");
    expect(normalizeText(undefined)).toBe("");
    expect(normalizeText(["Ab", "Cd"])).toBe("ab cd");
    expect(normalizeText(new Date(Date.UTC(2026, 0, 15)))).toContain("2026-01-15");
    expect(normalizeText({ a: 1 })).toBe("");
  });
});

describe("compareValues", () => {
  it("orders numbers, dates, booleans and texts", () => {
    expect(compareValues(2, 10)).toBeLessThan(0);
    expect(compareValues(new Date(2026, 0, 1), new Date(2026, 0, 2))).toBeLessThan(0);
    expect(compareValues(false, true)).toBeLessThan(0);
    expect(compareValues("b", "a")).toBeGreaterThan(0);
  });

  it("orders numbers inside a text by their value and ignores the case", () => {
    expect(compareValues("item 2", "item 10")).toBeLessThan(0);
    expect(compareValues("a", "B")).toBeLessThan(0);
  });
});

describe("buildNodes", () => {
  it("gives every row an id and a depth", () => {
    const tree = nodesOf([{ id: "p", name: "Parent", age: 1, children: [people[0]!] }]);
    expect(tree[0]).toMatchObject({ id: "p", depth: 0, parentId: null });
    expect(tree[0]?.children[0]).toMatchObject({ id: "a", depth: 1, parentId: "p" });
  });
});

describe("filterNodes", () => {
  it("keeps the rows with a match in any searchable column", () => {
    expect(ids(filterNodes(nodesOf(people), "ana", columns))).toEqual(["c"]);
    expect(ids(filterNodes(nodesOf(people), "30", columns))).toEqual(["a"]);
  });

  it("ignores the case and the accents", () => {
    expect(ids(filterNodes(nodesOf(people), "JOAO", columns))).toEqual(["b"]);
  });

  it("returns every row for an empty search", () => {
    expect(filterNodes(nodesOf(people), "  ", columns)).toHaveLength(3);
  });

  it("skips columns that are not searchable or have no accessor", () => {
    const some: ModelColumn<Person>[] = [
      { id: "name", accessor: "name", searchable: false },
      { id: "age", accessor: "age" },
      { id: "actions" },
    ];
    expect(filterNodes(nodesOf(people), "ana", some)).toHaveLength(0);
    expect(ids(filterNodes(nodesOf(people), "25", some))).toEqual(["b"]);
  });

  it("keeps a parent for a match below it, with only the matching children", () => {
    const tree = nodesOf([
      {
        id: "p",
        name: "Team",
        age: 0,
        children: [
          { id: "x", name: "Xena", age: 1 },
          { id: "y", name: "Yuri", age: 2 },
        ],
      },
    ]);
    const found = filterNodes(tree, "yuri", columns);
    expect(ids(found)).toEqual(["p"]);
    expect(ids(found[0]!.children)).toEqual(["y"]);
  });
});

describe("sortNodes", () => {
  const column = columns[0]!;

  it("sorts ascending and descending", () => {
    expect(ids(sortNodes(nodesOf(people), column, "asc"))).toEqual(["c", "b", "a"]);
    expect(ids(sortNodes(nodesOf(people), column, "desc"))).toEqual(["a", "b", "c"]);
  });

  it("puts an empty value last in both directions", () => {
    const age = columns[1]!;
    expect(ids(sortNodes(nodesOf(people), age, "asc"))).toEqual(["b", "a", "c"]);
    expect(ids(sortNodes(nodesOf(people), age, "desc"))).toEqual(["a", "b", "c"]);
  });

  it("uses the compare function of the column", () => {
    const byLength: ModelColumn<Person> = {
      id: "length",
      compare: (a, b) => a.name.length - b.name.length,
    };
    expect(ids(sortNodes(nodesOf(people), byLength, "asc"))).toEqual(["c", "b", "a"]);
  });

  it("keeps the order of the data without a column and does not change the input", () => {
    const nodes = nodesOf(people);
    expect(sortNodes(nodes, undefined, "asc")).toBe(nodes);
    sortNodes(nodes, column, "asc");
    expect(ids(nodes)).toEqual(["a", "b", "c"]);
  });

  it("sorts the children of every row", () => {
    const tree = nodesOf([
      {
        id: "p",
        name: "Team",
        age: 0,
        children: [
          { id: "z", name: "Zed", age: 1 },
          { id: "m", name: "Max", age: 2 },
        ],
      },
    ]);
    expect(ids(sortNodes(tree, column, "asc")[0]!.children)).toEqual(["m", "z"]);
  });
});

describe("flattenNodes", () => {
  const tree = nodesOf([
    {
      id: "p",
      name: "Team",
      age: 0,
      children: [{ id: "c1", name: "One", age: 1, children: [{ id: "g", name: "Deep", age: 2 }] }],
    },
    { id: "q", name: "Solo", age: 3 },
  ]);

  it("shows only the top rows while everything is closed", () => {
    expect(ids(flattenNodes(tree, new Set()))).toEqual(["p", "q"]);
  });

  it("shows the children of an open row", () => {
    expect(ids(flattenNodes(tree, new Set(["p"])))).toEqual(["p", "c1", "q"]);
    expect(ids(flattenNodes(tree, new Set(["p", "c1"])))).toEqual(["p", "c1", "g", "q"]);
  });

  it("can open everything", () => {
    expect(ids(flattenNodes(tree, new Set(), true))).toEqual(["p", "c1", "g", "q"]);
  });
});

describe("branchIds", () => {
  it("lists the rows that can be opened", () => {
    const tree = nodesOf([
      { id: "p", name: "Team", age: 0, children: [{ id: "c", name: "One", age: 1 }] },
      { id: "q", name: "Solo", age: 3 },
    ]);
    expect(branchIds(tree)).toEqual(["p"]);
  });
});

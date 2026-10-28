import { Badge } from "../../ui/badge";
import type { DataTableColumn } from "./data-table";

export type Person = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "active" | "invited" | "blocked";
  age: number;
  joined: Date;
  reports?: Person[];
};

const roles = ["Admin", "Editor", "Viewer"] as const;
const statuses = ["active", "invited", "blocked"] as const;
const names = [
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Joan Clarke",
  "Linus Torvalds",
  "Margaret Hamilton",
  "Dennis Ritchie",
  "Barbara Liskov",
  "Ken Thompson",
  "Radia Perlman",
  "João Silva",
  "Ana Souza",
];

export const people: Person[] = names.map((name, index) => ({
  id: String(index + 1),
  name,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
  role: roles[index % roles.length]!,
  status: statuses[index % statuses.length]!,
  age: 24 + ((index * 7) % 30),
  joined: new Date(2024, index % 12, 1 + index),
}));

const statusTone = {
  active: "default",
  invited: "secondary",
  blocked: "destructive",
} as const;

export const columns: DataTableColumn<Person>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "email", header: "Email", accessor: "email", sortable: true },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    sortable: true,
    cell: (row) => <Badge variant={statusTone[row.status]}>{row.status}</Badge>,
  },
  { id: "age", header: "Age", accessor: "age", sortable: true, align: "right" },
  {
    id: "joined",
    header: "Joined",
    accessor: "joined",
    sortable: true,
    defaultHidden: true,
    cell: (row) => row.joined.toLocaleDateString("en-US"),
  },
];

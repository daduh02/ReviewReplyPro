import { readFile } from "fs/promises";
import path from "path";

export const adminDocs = [
  {
    slug: "readme",
    title: "README",
    filename: "README.md",
    root: true,
  },
  {
    slug: "project-status",
    title: "Project Status",
    filename: "PROJECT_STATUS.md",
  },
  {
    slug: "product-overview",
    title: "Product Overview",
    filename: "PRODUCT_OVERVIEW.md",
  },
  {
    slug: "admin-guide",
    title: "Admin Guide",
    filename: "ADMIN_GUIDE.md",
  },
  {
    slug: "pilot-customers",
    title: "Pilot Customers",
    filename: "PILOT_CUSTOMERS.md",
  },
  {
    slug: "technical-notes",
    title: "Technical Notes",
    filename: "TECHNICAL_NOTES.md",
  },
  {
    slug: "changelog",
    title: "Changelog",
    filename: "CHANGELOG.md",
  },
] as const;

export type AdminDoc = (typeof adminDocs)[number];

const adminDocPaths = {
  readme: path.join(/*turbopackIgnore: true*/ process.cwd(), "README.md"),
  "project-status": path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "docs",
    "PROJECT_STATUS.md",
  ),
  "product-overview": path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "docs",
    "PRODUCT_OVERVIEW.md",
  ),
  "admin-guide": path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "docs",
    "ADMIN_GUIDE.md",
  ),
  "pilot-customers": path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "docs",
    "PILOT_CUSTOMERS.md",
  ),
  "technical-notes": path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "docs",
    "TECHNICAL_NOTES.md",
  ),
  changelog: path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "docs",
    "CHANGELOG.md",
  ),
} satisfies Record<AdminDoc["slug"], string>;

export function getAdminDoc(slug?: string) {
  return adminDocs.find((doc) => doc.slug === slug) ?? adminDocs[1];
}

export async function readAdminDoc(doc: AdminDoc) {
  return readFile(adminDocPaths[doc.slug], "utf8");
}

"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { type UserSubmission } from "@/server/data/submissions-dto";

const columnHelper = createColumnHelper<UserSubmission>();

export const submissionColumns = [
  columnHelper.accessor("status", {
    header: "Estado",
  }),
  columnHelper.accessor("updatedAt", {
    header: "Fecha",
  }),
  columnHelper.accessor("languageName", {
    header: "Lenguaje",
  }),
  columnHelper.accessor("executionTime", {
    header: "Tiempo de ejecución",
  }),
  columnHelper.accessor("memoryUsage", {
    header: "Uso de memoria",
  }),
];

export type SubmissionColumns = typeof submissionColumns;

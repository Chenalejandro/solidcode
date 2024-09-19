"use client";

import { type Problem } from "@/server/data/problems-dto";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Problem>();

export const problemColumns = [
  columnHelper.accessor("title", {
    header: "Nombre del problema",
    cell: (props) => <h2 className="hover:underline">{props.getValue()}</h2>,
  }),
];

export type ProblemColumns = typeof problemColumns;

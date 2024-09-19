import { z } from "zod";

const codeMinLength = 20;
const codeMaxLength = 10000;

export const codeSchema = z
  .string()
  .refine(
    (value) => value.length <= codeMaxLength && value.length >= codeMinLength,
    {
      message: `El código debe tener entre ${codeMinLength} y ${codeMaxLength} caracteres`,
    },
  );

export const codeSubmissionSchema = z.object({
  code: codeSchema,
  languageId: z.number().positive(),
  problemId: z.number().positive(),
});

export type CodeSubmissionType = z.infer<typeof codeSubmissionSchema>;

import type { z } from 'zod'

/**
 * A reusable utility function that acts as a type guard for any Zod schema.
 * @param value The unknown input to check.
 * @param schema The Zod schema to validate against.
 * @returns {boolean} True if the value matches the schema, otherwise false.
 */
export const is = <T extends z.ZodTypeAny>(
  value: unknown,
  schema: T
): value is z.infer<T> => {
  return schema.safeParse(value).success
}

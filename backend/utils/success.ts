import type { Ctx } from '../main.ts'

export function success<T extends Ctx>(ctx: T, message: string) {
  return ctx.json({ message } satisfies BackendSuccess)
}

export type BackendSuccess = {
  message: string
}

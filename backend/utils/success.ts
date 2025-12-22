import type { Ctx } from '../main.ts'

export function success<T extends Ctx>(ctx: T, message: string) {
  return ctx.json({ success: true, message } satisfies BackendSuccess)
}

export type BackendSuccess = {
  success: true
  message: string
}

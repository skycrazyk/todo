import { z } from 'zod'

export const zError = z.object({
  // Если 'TypeError' или 'AppError', то message - простая строка
  // Если 'ZodError', то message - JSON строка с деталями ошибки
  name: z.enum(['TypeError', 'AppError', 'ZodError']),
  message: z.string()
})

export type ZError = z.infer<typeof zError>

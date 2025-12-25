import { z } from 'zod'

export const zError = z.object({
  // Если 'TypeError' или 'AppError', то message - простая строка
  // Если 'ZotError', то message - JSON строка с деталями ошибки
  name: z.enum(['TypeError', 'AppError', 'ZotError']),
  message: z.string()
})

export type ZError = z.infer<typeof zError>

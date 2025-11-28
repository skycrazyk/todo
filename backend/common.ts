export type CudRes = {
  msg: string
} & ({ success: boolean; error?: never } | { success?: never; error: boolean })

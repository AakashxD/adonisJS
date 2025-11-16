import vine from '@vinejs/vine'

export const adminLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string(),
  })
)



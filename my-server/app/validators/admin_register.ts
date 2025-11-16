import vine from '@vinejs/vine'

export const adminRegisterValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(50),
    email: vine.string().email().trim(),
    password: vine.string().minLength(6),
    role: vine.string().trim(),
  })
)



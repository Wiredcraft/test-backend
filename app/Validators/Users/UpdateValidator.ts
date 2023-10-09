import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional(),
    date_of_birth: schema.date.optional(),
    address: schema.string.optional(),
    description: schema.string.optional(),
  })

  public messages: CustomMessages = {}
}

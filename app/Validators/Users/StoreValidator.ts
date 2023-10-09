import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
    date_of_birth: schema.date(),
    address: schema.string(),
    description: schema.string(),
  })

  public messages: CustomMessages = {}
}

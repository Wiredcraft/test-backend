import { INestApplicationContext } from "@nestjs/common"
import { ModuleRef } from "@nestjs/core"
import { useLogger } from "./logger"

interface Type<T> extends Function {
  new (...args: any[]): T;
}
type MaybePromise<T> = T | Promise<T> 

let app: INestApplicationContext | undefined
const buffering: Array<(ctx: INestApplicationContext) =>MaybePromise<unknown>> = []

export function setGlobalApplicationContext(context: INestApplicationContext) {
  if (app) {
    throw new Error('ApplicationContext can not be set twice.')
  }
  app = context

  while (buffering.length) {
    const fn = buffering.shift()
    if (fn) fn(context)
  }
}

export function runWithDeps<RESULT>(
  deps: Array<Type<unknown> | string | symbol>,
  func: (...args: Array<string | symbol | any>) => MaybePromise<RESULT>,
) {
  const logger = useLogger('System')
  const exec = (ctx: INestApplicationContext) => {
    const moduleRef = ctx.get(ModuleRef)
    return func(...deps.map((dep) => moduleRef.get(dep, { strict: false })))
  }

  if (app) return exec(app)

  const timeout = setTimeout(() => {
    logger.warn('[!]', `runWithDeps() may hangup`, deps)
  }, 1.5 * 60 * 1000)

  let resolve: (x: MaybePromise<RESULT>) => void
  const promise = new Promise<RESULT>((_resolve) => {
    resolve = (x: MaybePromise<RESULT>) => {
      clearTimeout(timeout)
      _resolve(x)
    }
  })
  buffering.push((ctx) => {
    resolve(exec(ctx))
  })
  return promise
}

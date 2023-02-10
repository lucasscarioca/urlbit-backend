import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['error', 'info', 'query', 'warn']
})

// Soft delete
prisma.$use(async (params, next) => {
  if (params.action == 'delete') {
    params.action = 'update'
    params.args['data'] = { deletedAt: new Date() }
  }
  if (params.action == 'deleteMany') {
    params.action = 'updateMany'
    if (params.args.data != undefined) {
      params.args.data['deletedAt'] = new Date()
    } else {
      params.args['data'] = { deletedAt: new Date() }
    }
  }
  return next(params)
})

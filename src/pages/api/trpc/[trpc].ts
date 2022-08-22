import { createContext } from '@frontend/server/createContext'
import { appRouter } from '@frontend/server/route/app.router'
import * as trpcNext from '@trpc/server/adapters/next'

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('Something went wrong', error)
    } else {
      console.error(error)
    }
  },
})

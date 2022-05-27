import express from 'express'
import type { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { DbGet, DbRemove, DbSave } from './libs/fakeDb'
import { GetCache, SetExCache } from './libs/cache'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000


app.get('/', async (req: Request, res: Response) => {
  try {
    const cached = await GetCache('names')

    if (cached) {
      return res.status(200).json(cached)
    }
    else {
      const names = await DbGet()
      await SetExCache('names', names, 30)
      return res.status(200).json(names)
    }
  } catch (err) {
    return res.status(500).send('Internal Error')
  }
})

app.get('/add', async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string

    if (!name) {
      return res.status(400).send('Bad request, missing name param');
    }

    const result = await DbSave(name)
    return res.status(201).json(result)

  } catch (err) {
    return res.status(500).send('Internal Error')
  }
})


app.get('/del', async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string
    if (!name) {
      return res.status(400).send('Bad request, missing name param');
    }

    const result = await DbRemove(name)
    return res.status(200).json(result)

  } catch (err) {
    return res.status(404).send('Name not found')
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
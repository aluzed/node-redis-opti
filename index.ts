import express from 'express'
import type { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { DbGetUsers, DbRemoveUser, DbSaveUser, DbGetUserPets, DbRemovePet, DbSavePet, DbGetUser } from './libs/fakeDb'
import { CleanPattern, GetCache, SetCache } from './libs/cache'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000


app.get('/', async (req: Request, res: Response) => {
  try {
    const cached = await GetCache('users')

    if (cached) {
      return res.status(200).json(cached)
    }
    else {
      const users = await DbGetUsers()
      await SetCache('users', users)
      return res.status(200).json(users)
    }

  } catch (err) {
    console.error(err)
    return res.status(500).send('Internal Error')
  }
})

app.get('/user', async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string
    if (!name) {
      return res.status(400).send('Bad request, missing name param');
    }

    const cached = await GetCache(`users:${name}`)
    if (cached) {
      return res.status(200).json(cached)
    }
    else {
      const user = await DbGetUser(name)
      await SetCache(`users:${name}`, user)
      return res.status(200).json(user)
    }

  } catch (err) {
    console.error(err)
    return res.status(500).send('Internal Error')
  }
})

app.get('/pets', async (req: Request, res: Response) => {
  try {
    const userName = req.query.username as string
    if (!userName) {
      return res.status(400).send('Bad request, missing username param');
    }

    const cached = await GetCache(`users:${userName}:pets`)
    if (cached) {
      return res.status(200).json(cached)
    }
    else {
      const pets = await DbGetUserPets(userName)
      await SetCache(`users:${userName}:pets`, pets)
      return res.status(200).json(pets)
    }

  } catch (err) {
    console.error(err)
    return res.status(500).send('Internal Error')
  }
})


app.get('/add', async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string

    if (!name) {
      return res.status(400).send('Bad request, missing name param');
    }

    const result = await DbSaveUser(name)
    await CleanPattern('users')
    await CleanPattern(`users:${name}*`)
    return res.status(201).json(result)

  } catch (err) {
    console.error(err)
    return res.status(500).send('Internal Error')
  }
})

app.get('/del', async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string
    if (!name) {
      return res.status(400).send('Bad request, missing name param');
    }

    const result = await DbRemoveUser(name)
    await CleanPattern('users')
    await CleanPattern(`users:${name}*`)
    return res.status(200).json(result)

  } catch (err) {
    console.error(err)
    return res.status(404).send('Name not found')
  }
})

app.get('/add_pet/:user', async (req: Request, res: Response) => {
  try {
    const userName = req.params.user
    const petName = req.query.name as string

    if (!petName) {
      return res.status(400).send('Bad request, missing name param');
    }

    const result = await DbSavePet(userName, petName)
    await CleanPattern('users')
    await CleanPattern(`users:${userName}*`)
    return res.status(201).json(result)

  } catch (err) {
    console.error(err)
    return res.status(500).send('Internal Error')
  }
})

app.get('/del_pet/:user', async (req: Request, res: Response) => {
  try {
    const userName = req.params.user
    const petName = req.query.name as string

    if (!petName) {
      return res.status(400).send('Bad request, missing name param');
    }

    const result = await DbRemovePet(userName, petName)
    await CleanPattern('users')
    await CleanPattern(`users:${userName}*`)
    return res.status(201).json(result)

  } catch (err) {
    console.error(err)
    return res.status(500).send('Internal Error')
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
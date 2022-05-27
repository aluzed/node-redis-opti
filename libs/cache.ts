import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL,
});

// Run on startup
(async () => {
  await client.connect()
  // On initialization, flush cache
  await client.flushDb()
  console.log("Cache have been cleaned...");
})()

export const GetCache = async (key: string) => {
  try {
    const result = await client.get(`${process.env.REDIS_PREFIX}${key}`)
    if (result) return JSON.parse(result)
  } catch (err) {
    return Promise.reject(err)
  }
};

export const DelCache = async (key: string) => {
  try {
    const result = await client.del(`${process.env.REDIS_PREFIX}${key}`)
    return result
  } catch (err) {
    return Promise.reject(err)
  }
};

export const SetCache = async (key: string, value: any) => {
  try {
    const result = await client.set(`${process.env.REDIS_PREFIX}${key}`, JSON.stringify(value))
    return result
  } catch (err) {
    return Promise.reject(err)
  }
};

export const SetExCache = async (key: string, value: any, expInSec: number) => {
  try {
    const result = await client.set(`${process.env.REDIS_PREFIX}${key}`, JSON.stringify(value), {
      EX: expInSec
    })
    return result
  } catch (err) {
    return Promise.reject(err)
  }
};

export const CleanPattern = async (key: string) => {
  try {
    const matches = await client.keys(`${process.env.REDIS_PREFIX}${key}`)
    for (let key of matches) {
      await client.del(key)
    }
    return matches.length
  } catch (err) {
    return Promise.reject(err)
  }
};


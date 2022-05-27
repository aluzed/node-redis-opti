export type User = {
  name: string
  petsCount: number
}

export type Pet = {
  name: string
  owner: string
}

let USERS: User[] = []
let PETS: Pet[] = []

export const DbGetUsers = async () => {
  return Promise.resolve(USERS)
}

export const DbGetUser = async (userName: string) => {
  const nameIndex = USERS.findIndex((n) => n.name === userName)
  if (nameIndex === -1) return Promise.reject('Not found')
  return Promise.resolve(USERS[nameIndex])
}

export const DbSaveUser = async (userName: string) => {
  const nameIndex = USERS.findIndex((n) => n.name === userName)
  if (nameIndex > -1) return Promise.resolve(USERS)
  USERS.push({ name: userName, petsCount: 0 })
  return Promise.resolve(USERS)
}

export const DbRemoveUser = async (userName: string) => {
  const nameIndex = USERS.findIndex((n) => n.name === userName)
  if (nameIndex === -1) return Promise.reject('Not found')
  USERS.splice(nameIndex, 1)
  PETS = PETS.filter(p => p.owner !== userName)
  return Promise.resolve(USERS)
}

export const DbGetPets = async () => {
  return Promise.resolve(PETS)
}

export const DbGetUserPets = async (userName: string) => {
  const nameIndex = USERS.findIndex((n) => n.name === userName)
  if (nameIndex === -1) return Promise.reject('Not found')
  return Promise.resolve(PETS.filter(p => p.owner === userName))
}

export const DbSavePet = async (userName: string, petName: string) => {
  const nameIndex = USERS.findIndex((n) => n.name === userName)
  if (nameIndex === -1) return Promise.reject('Not found')
  USERS[nameIndex].petsCount++;
  PETS.push({
    name: petName,
    owner: userName
  })
  return DbGetUserPets(userName)
}

export const DbRemovePet = async (userName: string, petName: string) => {
  const nameIndex = USERS.findIndex((n) => n.name === userName)
  const petNameIndex = PETS.findIndex((p) => p.name === petName)
  if (nameIndex === -1 || petNameIndex === -1) return Promise.reject('Not found')
  USERS[nameIndex].petsCount--;
  PETS.splice(petNameIndex, 1)
  return DbGetUserPets(userName)
}

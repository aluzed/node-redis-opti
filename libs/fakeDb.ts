let DATA: string[] = []

export const DbGet = async () => {
  return Promise.resolve(DATA)
}

export const DbSave = async (name: string) => {
  const nameIndex = DATA.findIndex((n) => n === name)
  if (nameIndex > -1) return Promise.resolve(DATA)
  DATA.push(name)
  return Promise.resolve(DATA)
}

export const DbRemove = async (name: string) => {
  const nameIndex = DATA.findIndex((n) => n === name)
  if (nameIndex === -1) return Promise.reject('Not found')
  DATA.splice(nameIndex, 1)
  return Promise.resolve(DATA)
}
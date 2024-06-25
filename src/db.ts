import Dexie, { type EntityTable } from 'dexie'

interface Recipe {
  id: number
  title: string
  items: RecipeItem[]
}

interface RecipeItem {
  name: string
  quantity: number
}

type Database = Dexie & {
  recipes: EntityTable<
    Recipe,
    'id' // primary key "id" (for the typings only)
  >
}
const db = new Dexie('RecipeDatabase') as Database

// Schema declaration:
db.version(1).stores({
  recipes: '++id, title', // primary key "id" (for the runtime!)
})

export type { Recipe, RecipeItem }
export { db }

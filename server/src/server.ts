import express, { Request, Response, NextFunction, Application } from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Item {
  id: number;
  title?: string;
  description?: string;
  [key: string]: any;
}

interface Database {
  items: Item[];
}

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '4000', 10);
const DB_PATH: string = path.join(__dirname, '..', 'db.json');

app.use(express.json());

// helper: read DB
async function readDB(): Promise<Database> {
  try {
    const txt: string = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(txt);
  } catch (err: any) {
    if (err.code === 'ENOENT') return { items: [] };
    throw err;
  }
}

// helper: write DB
async function writeDB(data: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// list items
app.get('/api/items', async (req: Request, res: Response) => {
  const db = await readDB();
  res.json(db.items); // DEVUELVE UN ARRAY
});

// get item by id
app.get('/api/items/:id', async (req: Request, res: Response) => {
  const db = await readDB();
  const item = db.items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

// create item
app.post('/api/items', async (req: Request, res: Response) => {
  const db = await readDB();
  const { title, description } = req.body;
  const id = db.items.length ? db.items[db.items.length - 1].id + 1 : 1;
  const newItem: Item = { id, title, description };
  db.items.push(newItem);
  await writeDB(db);
  res.status(201).json(newItem);
});

// update item
app.put('/api/items/:id', async (req: Request, res: Response) => {
  const db = await readDB();
  const itemIndex = db.items.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });

  db.items[itemIndex] = { ...db.items[itemIndex], ...req.body };
  await writeDB(db);
  res.json(db.items[itemIndex]);
});

// delete item
app.delete('/api/items/:id', async (req: Request, res: Response) => {
  const db = await readDB();
  const filtered = db.items.filter(i => i.id !== parseInt(req.params.id));
  db.items = filtered;
  await writeDB(db);
  res.status(204).send();
});

app.listen(PORT, (): void => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

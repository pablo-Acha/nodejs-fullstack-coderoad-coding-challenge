import { useEffect, useState, FormEvent, ChangeEvent } from 'react'

const API = 'http://localhost:4000/api'

interface Item {
  id: number
  title: string
  description: string
}

// interface ItemPayload {
//   title: string
//   description: string
// }

export default function App(): JSX.Element {
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems(): Promise<void> {
    setLoading(true)
    try {
      const res = await fetch(`${API}/items`)
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function addItem(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    // PUT YOUR CODE HERE
  }

  async function removeItem(id: number): Promise<void> {
    if (!confirm('Delete this item?')) return
    // PUT YOUR CODE HERE
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value)
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDescription(e.target.value)
  }

  return (
    <div className="container">
      <h1>CodeRoad Marketplace</h1>

      <form onSubmit={addItem} className="form">
        <input
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <button type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className="list">
          {items.map(item => (
            <li key={item.id} className="item">
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <div>
                <button onClick={() => removeItem(item.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

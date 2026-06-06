const express = require('express')
const { Pool } = require('pg')

const app = express()
app.use(express.json())
app.use(express.static('public'))

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:MHD@localhost:5432/test_projet',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

pool.query(`
  CREATE TABLE IF NOT EXISTS taches (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255),
    statut VARCHAR(255)
  )
`);

// Récupérer toutes les tâches
app.get('/taches', async (req, res) => {
  const result = await pool.query('SELECT * FROM taches')
  res.json(result.rows)
})

// Créer une tâche
app.post('/taches', async (req, res) => {
  const { titre, statut } = req.body
  const result = await pool.query(
    'INSERT INTO taches (titre, statut) VALUES ($1, $2) RETURNING *',
    [titre, statut]
  )
  res.json(result.rows[0])
})

// Modifier une tâche (titre et statut)
app.put('/taches/:id', async (req, res) => {
  const { id } = req.params
  const { titre, statut } = req.body
  const result = await pool.query(
    'UPDATE taches SET titre = $1, statut = $2 WHERE id = $3 RETURNING *',
    [titre, statut, id]
  )
  res.json(result.rows[0])
})

// Supprimer une tâche
app.delete('/taches/:id', async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM taches WHERE id = $1', [id])
  res.json({ message: 'Tâche supprimée' })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`)
})

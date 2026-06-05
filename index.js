const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test_projet',
  password: 'MHD',
  port: 5432,
})

// CREATE - Ajouter une tâche
async function creerTache(titre, statut) {
  const result = await pool.query(
    'INSERT INTO taches (titre, statut) VALUES ($1, $2) RETURNING *',
    [titre, statut]
  )
  console.log('Tâche créée :', result.rows[0])
}

// READ - Lire toutes les tâches
async function lireTaches() {
  const result = await pool.query('SELECT * FROM taches')
  console.log('Toutes les tâches :', result.rows)
}

// UPDATE - Modifier une tâche
async function modifierTache(id, nouveauStatut) {
  const result = await pool.query(
    'UPDATE taches SET statut = $1 WHERE id = $2 RETURNING *',
    [nouveauStatut, id]
  )
  console.log('Tâche modifiée :', result.rows[0])
}

// DELETE - Supprimer une tâche
async function supprimerTache(id) {
  await pool.query('DELETE FROM taches WHERE id = $1', [id])
  console.log('Tâche supprimée, id :', id)
}

// On teste tout
async function main() {
  await creerTache('Ma première tâche depuis Node', 'à faire')
  await lireTaches()
  await modifierTache(1, 'en cours')
  await supprimerTache(2)
  await lireTaches()
  pool.end()
}

main()
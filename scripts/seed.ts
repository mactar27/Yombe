/**
 * Script de migration & seed pour la base Yombe
 * Exécuter : pnpm tsx scripts/seed.ts
 */
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'M@tzo2705',
  database: 'Yombe',
  multipleStatements: true,
})

async function migrate() {
  const conn = await pool.getConnection()
  console.log('📦 Création des tables...')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      old_price INT,
      description TEXT,
      category VARCHAR(100),
      audience JSON,
      sizes JSON,
      colors JSON,
      image VARCHAR(500),
      is_new TINYINT(1) DEFAULT 0,
      is_promo TINYINT(1) DEFAULT 0,
      in_stock TINYINT(1) DEFAULT 1,
      rating TINYINT DEFAULT 5
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  await conn.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      role VARCHAR(150),
      quote TEXT,
      avatar VARCHAR(500),
      rating TINYINT DEFAULT 5
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  await conn.query(`
    CREATE TABLE IF NOT EXISTS jersey_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      model VARCHAR(100),
      color VARCHAR(50),
      player_name VARCHAR(50),
      number VARCHAR(5),
      with_logo TINYINT(1) DEFAULT 0,
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  await conn.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(200),
      phone VARCHAR(30),
      subject VARCHAR(200),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  console.log('✅ Tables créées.')
  conn.release()
}

async function seed() {
  const conn = await pool.getConnection()

  // Vérifier si déjà seedé
  const [rows] = await conn.query('SELECT COUNT(*) as count FROM products')
  const count = (rows as { count: number }[])[0].count
  if (count > 0) {
    console.log(`ℹ️  Base déjà seedée (${count} produits). Ignoré.`)
    conn.release()
    return
  }

  console.log('🌱 Insertion des produits...')

  const products = [
    {
      id: 'maillot-club-domicile',
      name: 'Maillot Club Domicile 2026',
      price: 18000,
      old_price: 22000,
      description: 'Maillot officiel respirant, coupe athlétique pour le terrain comme la ville.',
      category: 'Maillots de clubs',
      audience: JSON.stringify(['football', 'homme']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Or', 'Noir', 'Blanc']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 0, is_promo: 1, in_stock: 1, rating: 5,
    },
    {
      id: 'maillot-perso-equipe',
      name: 'Maillot Personnalisé Équipe',
      price: 15000,
      old_price: null,
      description: 'Maillot sublimé avec nom, numéro et logo de votre choix. Idéal pour les clubs.',
      category: 'Maillots personnalisés',
      audience: JSON.stringify(['football']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Or', 'Noir', 'Rouge', 'Bleu']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 1, is_promo: 0, in_stock: 1, rating: 5,
    },
    {
      id: 'chaussures-football-pro',
      name: 'Chaussures de Football Pro',
      price: 25000,
      old_price: null,
      description: 'Crampons légers et stables pour une accroche optimale sur gazon.',
      category: 'Chaussures de football',
      audience: JSON.stringify(['football', 'homme']),
      sizes: JSON.stringify(['40', '41', '42', '43', '44']),
      colors: JSON.stringify(['Noir', 'Or']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 0, is_promo: 0, in_stock: 1, rating: 4,
    },
    {
      id: 'ballon-match-officiel',
      name: 'Ballon de Match Officiel',
      price: 12000,
      old_price: null,
      description: 'Ballon taille 5 cousu main, parfait pour les matchs et entraînements.',
      category: 'Ballons',
      audience: JSON.stringify(['football', 'accessoires']),
      sizes: JSON.stringify(['Taille 5']),
      colors: JSON.stringify(['Blanc', 'Or']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 0, is_promo: 0, in_stock: 1, rating: 5,
    },
    {
      id: 'chemise-lin-premium',
      name: 'Chemise Lin Premium',
      price: 14000,
      old_price: null,
      description: 'Chemise en lin élégante et respirante pour un style raffiné au quotidien.',
      category: 'Chemises',
      audience: JSON.stringify(['homme']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Blanc', 'Beige', 'Noir']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 1, is_promo: 0, in_stock: 1, rating: 4,
    },
    {
      id: 'ensemble-survetement',
      name: 'Ensemble Survêtement Lifestyle',
      price: 21000,
      old_price: 26000,
      description: 'Ensemble confortable et tendance, parfait pour le sport et la détente.',
      category: 'Ensembles',
      audience: JSON.stringify(['homme', 'femme']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Noir', 'Or', 'Gris']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 0, is_promo: 1, in_stock: 1, rating: 5,
    },
    {
      id: 'jean-slim-premium',
      name: 'Jean Slim Premium',
      price: 16000,
      old_price: null,
      description: 'Jean coupe slim en denim stretch, confort et durabilité garantis.',
      category: 'Jeans',
      audience: JSON.stringify(['homme', 'femme']),
      sizes: JSON.stringify(['28', '30', '32', '34', '36']),
      colors: JSON.stringify(['Bleu', 'Noir']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 0, is_promo: 0, in_stock: 1, rating: 4,
    },
    {
      id: 'casquette-brodee',
      name: 'Casquette Brodée Signature',
      price: 6000,
      old_price: null,
      description: 'Casquette ajustable avec broderie dorée, finition haut de gamme.',
      category: 'Casquettes',
      audience: JSON.stringify(['homme', 'femme', 'accessoires']),
      sizes: JSON.stringify(['Unique']),
      colors: JSON.stringify(['Noir', 'Or', 'Blanc']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 1, is_promo: 0, in_stock: 1, rating: 5,
    },
    {
      id: 'kit-arbitre',
      name: "Kit d'Arbitrage Complet",
      price: 9000,
      old_price: null,
      description: "Sifflet, cartons jaune et rouge, chronomètre et carnet pour l'arbitre moderne.",
      category: 'Cartons jaunes et rouges',
      audience: JSON.stringify(['football', 'accessoires']),
      sizes: JSON.stringify(['Unique']),
      colors: JSON.stringify(['Jaune', 'Rouge']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 0, is_promo: 0, in_stock: 1, rating: 4,
    },
    {
      id: 'gants-gardien',
      name: 'Gants de Gardien Pro',
      price: 11000,
      old_price: null,
      description: 'Gants haute adhérence avec protection des doigts pour les gardiens exigeants.',
      category: 'Équipements de gardien',
      audience: JSON.stringify(['football']),
      sizes: JSON.stringify(['8', '9', '10', '11']),
      colors: JSON.stringify(['Noir', 'Or']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 0, is_promo: 0, in_stock: 0, rating: 5,
    },
    {
      id: 'veste-bomber',
      name: 'Veste Bomber Élégante',
      price: 23000,
      old_price: null,
      description: 'Veste bomber structurée, doublure premium et finitions dorées discrètes.',
      category: 'Vestes',
      audience: JSON.stringify(['homme', 'femme']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Noir', 'Vert', 'Or']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 0, is_promo: 0, in_stock: 1, rating: 5,
    },
    {
      id: 'lot-cones-entrainement',
      name: "Lot de Cônes d'Entraînement",
      price: 7000,
      old_price: 9000,
      description: "Set de 20 cônes et coupelles pour vos exercices d'agilité et de vitesse.",
      category: "Cônes d'entraînement",
      audience: JSON.stringify(['football', 'accessoires']),
      sizes: JSON.stringify(['Lot de 20']),
      colors: JSON.stringify(['Multicolore']),
      image: '/placeholder.svg?height=600&width=480',
      is_new: 0, is_promo: 1, in_stock: 1, rating: 4,
    },
  ]

  for (const p of products) {
    await conn.query(
      `INSERT INTO products (id, name, price, old_price, description, category, audience, sizes, colors, image, is_new, is_promo, in_stock, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.name, p.price, p.old_price, p.description, p.category, p.audience, p.sizes, p.colors, p.image, p.is_new, p.is_promo, p.in_stock, p.rating]
    )
  }
  console.log(`✅ ${products.length} produits insérés.`)

  console.log('🌱 Insertion des témoignages...')
  const testimonials = [
    {
      name: 'Awa Diédhiou',
      role: 'Cliente fidèle, Ziguinchor',
      quote: 'Des vêtements de qualité et un service impeccable. Je trouve toujours mon bonheur chez Yombe Ctyi 313 !',
      avatar: '/placeholder.svg?height=120&width=120',
      rating: 5,
    },
    {
      name: 'Modou Sané',
      role: 'Coach, Académie Casa Foot',
      quote: 'Nous avons commandé les maillots personnalisés de toute l\'académie. Rendu magnifique et livraison rapide.',
      avatar: '/placeholder.svg?height=120&width=120',
      rating: 5,
    },
    {
      name: 'Fatou Mendy',
      role: 'Étudiante',
      quote: 'Les prix sont compétitifs et le style est vraiment premium. Mon ensemble survêtement est parfait.',
      avatar: '/placeholder.svg?height=120&width=120',
      rating: 5,
    },
  ]

  for (const t of testimonials) {
    await conn.query(
      'INSERT INTO testimonials (name, role, quote, avatar, rating) VALUES (?, ?, ?, ?, ?)',
      [t.name, t.role, t.quote, t.avatar, t.rating]
    )
  }
  console.log(`✅ ${testimonials.length} témoignages insérés.`)
  conn.release()
}

async function main() {
  try {
    await migrate()
    await seed()
    console.log('\n🚀 Base de données prête !')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erreur :', err)
    process.exit(1)
  }
}

main()

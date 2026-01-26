-- Tabela de perfis das modelos
CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  height TEXT,
  weight TEXT,
  city TEXT NOT NULL,
  neighborhood TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  bio TEXT,
  price_per_hour DECIMAL(10,2),
  hair_color TEXT,
  eye_color TEXT,
  body_type TEXT,
  breast_type TEXT,
  tattoo BOOLEAN DEFAULT false,
  piercing BOOLEAN DEFAULT false,
  zodiac_sign TEXT,
  services TEXT[],
  languages TEXT[],
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de fotos adicionais
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhorar performance de busca
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name);
CREATE INDEX IF NOT EXISTS idx_photos_profile_id ON photos(profile_id);

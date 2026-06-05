-- ============================================================
-- Schema for Pieces Auto — Spare Parts Management
-- Run this in Supabase SQL Editor to create all tables
-- ============================================================

-- Clients table with unique speed_code
CREATE TABLE clients (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  speed_code  INTEGER UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  phone       TEXT,
  car_model   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_clients_speed_code ON clients(speed_code);

-- Parts linked to each client (frequently bought items)
CREATE TABLE client_parts (
  id           BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  client_id    BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  part_name    TEXT NOT NULL,
  reference    TEXT,
  category     TEXT,
  notes        TEXT
);

CREATE INDEX idx_client_parts_client_id ON client_parts(client_id);

-- Catalog of parts
CREATE TABLE catalog_parts (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name       TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'Divers',
  price      DECIMAL(10,2) NOT NULL DEFAULT 0,
  reference  TEXT
);

-- Sales
CREATE TABLE sales (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  client_id   BIGINT NOT NULL REFERENCES clients(id),
  total       DECIMAL(10,2) NOT NULL,
  date        DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sales_client_id ON sales(client_id);
CREATE INDEX idx_sales_date ON sales(date);

-- Sale items
CREATE TABLE sale_items (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sale_id    BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  part_name  TEXT NOT NULL,
  quantity   INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);

-- Seed default catalog parts
INSERT INTO catalog_parts (name, category, price) VALUES
  ('Plaquettes de frein', 'Freinage', 250),
  ('Disques de frein', 'Freinage', 450),
  ('Liquide de frein', 'Freinage', 60),
  ('Filtre à huile', 'Filtres', 50),
  ('Filtre à air', 'Filtres', 80),
  ('Filtre d''habitacle', 'Filtres', 70),
  ('Filtre à carburant', 'Filtres', 120),
  ('Courroie de distribution', 'Moteur / Distribution', 400),
  ('Courroie d''accessoire', 'Moteur / Distribution', 150),
  ('Pompe à eau', 'Moteur / Distribution', 350),
  ('Huile moteur (bidon)', 'Moteur / Distribution', 200),
  ('Bougies d''allumage', 'Allumage', 90),
  ('Bobine d''allumage', 'Allumage', 300),
  ('Amortisseur', 'Suspension / Direction', 500),
  ('Rotule de direction', 'Suspension / Direction', 180),
  ('Roulement de roue', 'Suspension / Direction', 220),
  ('Batterie', 'Électrique', 800),
  ('Alternateur', 'Électrique', 1200),
  ('Démarreur', 'Électrique', 900),
  ('Ampoule de phare', 'Électrique', 40),
  ('Pneu', 'Pneumatiques', 600),
  ('Balais d''essuie-glace', 'Visibilité', 50),
  ('Radiateur', 'Refroidissement', 700),
  ('Thermostat', 'Refroidissement', 130),
  ('Liquide de refroidissement', 'Refroidissement', 55),
  ('Kit d''embrayage', 'Transmission', 1300);

-- Enable Row Level Security (optional — open for now)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (simplified for now)
CREATE POLICY "Allow all" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON client_parts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON catalog_parts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON sale_items FOR ALL USING (true) WITH CHECK (true);

-- Contador de consultas para ordenar las propiedades destacadas.
ALTER TABLE inmuebles
  ADD COLUMN IF NOT EXISTS vistas INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS inmuebles_publicado_vistas_idx
  ON inmuebles (vistas DESC, creado_en DESC)
  WHERE estado = 'PUBLICADO';

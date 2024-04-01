SELECT 'CREATE DATABASE mydb' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mydb')\gexec

CREATE EXTENSION IF NOT EXISTS vector;

drop table if exists embeddings cascade;

CREATE TABLE IF NOT EXISTS embeddings (
    id bigserial PRIMARY KEY, 
    embedding vector(3)
);

INSERT INTO embeddings (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');

SELECT * FROM embeddings ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
 
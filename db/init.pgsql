select 'create database qm' where not exists (select from pg_database where datname = 'qm')\gexec
\connect qm

create extension if not exists vector;
create extension if not exists citext;

drop table if exists pages cascade;

create table if not exists pages (
    id bigserial primary key, 
    name citext unique not null,
    embedding vector(1536)
);


-- vectors with up to 2,000 dimensions can be indexed.
-- https://cloud.google.com/blog/products/databases/faster-similarity-search-performance-with-pgvector-indexes/
create index on pages
    using hnsw(embedding vector_cosine_ops)
    with (m = 24, ef_construction = 100);
b

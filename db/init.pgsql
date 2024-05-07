select 'create database qm' where not exists (select from pg_database where datname = 'qm')\gexec
\connect qm

-- https://js.langchain.com/docs/integrations/vectorstores/supabase
-- https://supabase.com/blog/openai-embeddings-postgres-vector
create extension if not exists vector;
drop table if exists documents cascade;
drop function if exists match_documents;

-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(1536) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for documents
create function match_documents (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  embedding jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    (embedding::text)::jsonb as embedding,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- calling a function
-- https://www.postgresql.org/docs/current/sql-syntax-calling-funcs.html#SQL-SYNTAX-CALLING-FUNCS


-- vectors with up to 2,000 dimensions can be indexed.
-- https://cloud.google.com/blog/products/databases/faster-similarity-search-performance-with-pgvector-indexes/
create index on documents
    using hnsw(embedding vector_cosine_ops)
    with (m = 24, ef_construction = 100);

FROM pgvector/pgvector:pg16
LABEL name="Quiet Memory Database, using PostgreSQL."
WORKDIR /quiet-memory
VOLUME [ "/db-scripts" ]

FROM pgvector/pgvector:pg16
LABEL name="Auction House Database, using PostgreSQL."
WORKDIR /auction-house
VOLUME [ "/db-scripts" ]

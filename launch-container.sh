#!/bin/bash

docker run -itd -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -p 5432:5432 \
  -v /data:/var/lib/postgresql/data \
  -v $(pwd)/db:/db-scripts \
  --name qm-db \
  qm-db:1.0

# docker exec -it ah-db /db-scripts/bounce-db.sh

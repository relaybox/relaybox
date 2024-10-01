#!/bin/bash

echo "Starting services..."

docker-compose up -d

DB_CONTAINER_NAME=$(docker-compose ps -q db)

echo "Waiting for Postgres..."

while ! docker exec $DB_CONTAINER_NAME pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}; do
  sleep 2
done

sleep 2

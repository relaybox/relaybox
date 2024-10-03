#!/bin/bash

cleanup() {
  echo "Platform setup complete..."
  rm -rf .env
}

ENV_PATH="$(pwd)/.env"

trap cleanup EXIT

echo "Starting services..."

docker-compose up -d

DB_CONTAINER_NAME=$(docker-compose ps -q db)

if [ -z "$DB_CONTAINER_NAME" ]; then
  echo "Error: DB container not found. Exiting."
  exit 1
fi

echo "Waiting for Postgres..."

while ! docker exec $DB_CONTAINER_NAME pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}; do
  sleep 2
done

sleep 2

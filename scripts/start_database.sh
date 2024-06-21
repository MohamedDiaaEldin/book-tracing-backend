#!/usr/bin/bash
docker run -d  -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=mdiaa -e POSTGRES_DB=books --net="host" -v $(pwd)/../database:/var/lib/postgresql/data postgres:alpine

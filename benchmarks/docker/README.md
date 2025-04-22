# Docker Setup

First, make sure you kill all existing images:
```bash
    docker stop $(docker ps -a -q)
``` 

Then, run the following command to start the containers:
```bash
    docker-compose up
```
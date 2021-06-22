```
docker exec -it mariadb_db_1 bash

create database velopolio;
grant all privileges on velopolio.* TO 'velopolio'@'%' identified by 'velopolio';
flush privileges;

```


trabalho p entregar quarta feira dia 10/12
--> setup
CREATE DATABASE candidatos;
CREATE TABLE candidatos VALUES (nome VARCHAR(40), votos INT, codigo INT)
CREATE TABLE sessoes VALUES (token VARCHAR(100) PRIMARY KEY, email VARCHAR(100));
CREATE TABLE usuarios VALUES (email VARCHAR(100) PRIMARY KEY, nome VARCHAR(30) NOT NULL, hash VARCHAR(100) UNIQUE, votou BOOLEAN, codigo INT); 
"voto_branco" => INSERT INTO candidatos VALUES ("voto_branco", 0, 0)
"sem_voto" => INSERT INTO candidatos VALUES ("sem_voto", 0, -1)
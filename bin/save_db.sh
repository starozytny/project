#!/bin/sh

# configuration de l'utilisateur MySQL et de son mot de passe
DB_USER=$1
DB_PASS=$2
# configuration de la machine hébergeant le serveur MySQL
DB_HOST=$3

declare -a databases=("app")

# sous-chemin de destination
OUTDIR=`date +%y_%m_%d`

# boucle sur les bases pour les dumper
for database in ${databases[@]}; do
    MYSQL_PWD=$DB_PASS mysqldump -u $DB_USER --single-transaction --skip-lock-tables $database -h $DB_HOST > backup/$database/$OUTDIR.sql
done

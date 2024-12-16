#!/bin/bash

# Variables
DB_HOST="localhost"      # Database host
DB_USER="root"      # MySQL username
DB_PASS="zaq1@WSX"  # MySQL password
DB_NAME="student_system"    # Database name

# Token to insert
AUTH_TOKEN=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 8) # Replace this or pass as an argument
DATE_NOW=$(date '+%Y-%m-%d %H:%M:%S') # Current date and time

cd /ftp

# Fetch previous token from file

PREV_TOKEN=$(cat "prev_token.txt")

TEMP_VAR='students'

PREV_TABLE_NAME="$TEMP_VAR"_"$PREV_TOKEN"

TABLE_NAME="$TEMP_VAR"_"$AUTH_TOKEN"

# MySQL Drop previous table

SQL_DROP_PREV="DROP TABLE "$PREV_TABLE_NAME""

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "$SQL_DROP_PREV"

# MySQL Command
SQL_TABLE="CREATE TABLE ${TABLE_NAME} (
  name TEXT (32),
  surname TEXT (32),
  class TEXT (2),
  number INT(2),
  date_added DATETIME,
  client TEXT
);"

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "$SQL_TABLE"

SQL_COMMAND="INSERT INTO tokens (token, date) VALUES ('$AUTH_TOKEN', '$DATE_NOW');"

# Run MySQL Command
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "$SQL_COMMAND"

echo "$AUTH_TOKEN">prev_token.txt
# Success Message
if [ $? -eq 0 ]; then

cd /ftp/log

YAPP="Token - "$AUTH_TOKEN" was succesfully created on "$DATE_NOW""

echo "$YAPP">>"log_$DATE_NOW.txt"
  echo "Token inserted successfully into ${TABLE_NAME}: $AUTH_TOKEN"
else
  echo "Failed to insert token. Check your database connection and table structure."
fi

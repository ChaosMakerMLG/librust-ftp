#!/bin/bash

# Variables
DB_HOST="localhost"      # Database host
DB_USER="admin1"      # MySQL username
DB_PASS="zaq1@WSX"  # MySQL password
DB_NAME="student_system"    # Database name

# Token to insert
AUTH_TOKEN=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 8) # Replace this or pass as an argument
DATE_NOW=$(date '+%Y-%m-%d %H:%M:%S')
DATE_NOW_SAFE=$(echo $DATE_NOW | sed 's/:/_/g') # Current date and time

#!/bin/bash

# Start WebSocket server in the background and capture its PID
nohup node /var/www/makeauser/websocket/server.js > /var/www/makeauser/websocket/websocket-server.log 2>&1 &
PID=$!

echo "WebSocket server started with PID: $PID"

# Save the PID to a file so you can later use it to stop the server
echo $PID > websocket_server.pid

TEMP_VAR='students'

TABLE_NAME="$TEMP_VAR"_"$AUTH_TOKEN"

# MySQL Command
SQL_TABLE="CREATE TABLE ${TABLE_NAME} (
  name CHAR (64),
  surname CHAR (64),
  class CHAR (2),
  number CHAR (2),
  mail CHAR (128),
  host CHAR (24),
  date DATETIME
);"

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "$SQL_TABLE"

TEMP_VAR='credentials'

TABLE_NAME="$TEMP_VAR"_"$AUTH_TOKEN"

# MySQL Command
SQL_TABLE="CREATE TABLE ${TABLE_NAME} (
  login CHAR (32),
  passwd CHAR (32),
  host CHAR (24)
);"

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "$SQL_TABLE"

SQL_COMMAND="INSERT INTO tokens (token, date) VALUES ('$AUTH_TOKEN', '$DATE_NOW');"

# Run MySQL Command
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "$SQL_COMMAND"

# Success Message
if [ $? -eq 0 ]; then

cd /var/www/makeauser/sh/log/token

YAPP="Token - "$AUTH_TOKEN" was succesfully created on "$DATE_NOW""

echo "$YAPP">>"log_${DATE_NOW_SAFE}.txt"
  echo "Successfully created a new token - $AUTH_TOKEN"
else
  echo "Failed to insert token. Check your database connection and table structure."
fi

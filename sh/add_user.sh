#!/bin/bash

# Variables
DB_HOST="localhost"      # Database host
DB_USER="admin1"      # MySQL username
DB_PASS="zaq1@WSX"  # MySQL password
DB_NAME="student_system"    # Database name

LOG_DIR="./log/add_user" # Directory for logs
TEST_MODE=false       # Enable this to skip system user creation and group addition

# Generate filenames
MAIN_LOG_FILE="${LOG_DIR}/$(date '+%Y-%m-%d_%H-%M-%S').log"
DUMP_LOG="${LOG_DIR}/dump.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Redirect all output to dump.log
exec > >(tee -a "$DUMP_LOG") 2>&1

echo "Starting script execution..."

# Fetch the token
TOKEN=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -se "SELECT token FROM tokens ORDER BY date DESC LIMIT 1;")
if [[ -z "$TOKEN" ]]; then
    echo "Error: Failed to fetch token from the database." | tee -a "$MAIN_LOG_FILE"
    exit 1
fi
TABLE_NAME="students_${TOKEN}"

# Database connection test
if ! mysqladmin ping -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" >/dev/null 2>&1; then
    echo "Error: Database connection failed." | tee -a "$MAIN_LOG_FILE"
    exit 1
fi

# Function to process students
process_students() {
    local query_result

    # Fetch all students
    query_result=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -se "SELECT * FROM ${TABLE_NAME} ORDER BY host")
    if [[ $? -ne 0 ]]; then
        echo "Error: Failed to fetch students from ${TABLE_NAME}." | tee -a "$MAIN_LOG_FILE"
        return 1
    fi

    # Loop through all students
    while IFS=$'\t' read -r name surname class number mail host date; do
        # Generate username and password
        local random_str
        local random_int
        random_str=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 5)
        random_int=$(head /dev/urandom | tr -dc 0-9 | head -c 3)

        #if grep -q ${random_int} /var/www/makeauser/sh/ids.info; then
        #random_int=$(head /dev/urandom | tr -dc 0-9 | head -c 3)
        #fi
        #echo ${random_int}>/var/www/makeauser/sh/ids.info

        local username="${name}-${surname}${random_int}"
        local password="ftp${name:0:1}${surname:0:1}#${random_str}"

        # Check if username already exists in `user_list`
        user_exists=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -se \
            "SELECT COUNT(*) FROM user_list WHERE login='${username}'")
        if [[ "$user_exists" -ne 0 ]]; then
            echo "# ${name} ${surname} - Failure (user already exists) from host ${host}" | tee -a "$MAIN_LOG_FILE"
            continue
        fi

        mail_exists=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -se \
            "SELECT COUNT(*) FROM user_list WHERE mail='${mail}'")
        if [[ "$mail_exists" -ne 0 ]]; then
            echo "# ${name} ${surname} - Failure (mail already in use) from host ${host}" | tee -a "$MAIN_LOG_FILE"
            continue
        fi

        # Insert into credentials table
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e \
            "INSERT INTO credentials_${TOKEN} (login, passwd, host) VALUES ('$username', '$password', '$host')"
        if [[ $? -ne 0 ]]; then
            echo "# ${name} ${surname} - Failure (database error) from host ${host}" | tee -a "$MAIN_LOG_FILE"
            continue
        fi

        # Insert into user_list
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e \
            "INSERT INTO user_list (login, passwd, mail) VALUES ('$username', '$password', '$mail')"
        if [[ $? -ne 0 ]]; then
            echo "# ${name} ${surname} - Failure (user_list insert error) from host ${host}" | tee -a "$MAIN_LOG_FILE"
            continue
        fi

        # System user creation (only if not in TEST_MODE)
        if [[ "$TEST_MODE" == false ]]; then
            if id "$username" &>/dev/null; then
                echo "# ${name} ${surname} - Failure (Linux user already exists) from host ${host}" | tee -a "$MAIN_LOG_FILE"
                continue
            fi

            # Define home directory and create user
            local home_dir="/sftp/${class}/${name}_${surname}"
            sudo useradd -m -s /bin/bash -d "$home_dir" "$username"
            echo "$username:$password" | sudo chpasswd
            if [[ $? -ne 0 ]]; then
                echo "# ${name} ${surname} - Failure (Linux user creation error) from host ${host}" | tee -a "$MAIN_LOG_FILE"
                continue
            fi

            # Add user to group
            sudo usermod -aG "$class" "$username"
            # Uncomment for debugging to treat group failure as success
            # if [[ $? -ne 0 ]]; then
            #     echo "# ${name} ${surname} - Failure (group addition error) from host ${host}" | tee -a "$MAIN_LOG_FILE"
            #     continue
            # fi
        fi

        echo "# ${name} ${surname} - Success from host ${host}" | tee -a "$MAIN_LOG_FILE"
    done <<< "$query_result"
}

# Call the processing function
process_students

curl -X POST http://localhost:8081/notifyClient \
  -H "Content-Type: application/json" \
  -d '{"message": "Valid"}'

echo "Data processed. Waiting 1 minute before deleting the tables..."
sleep 60

# Drop tables and log
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e \
    "DROP TABLE IF EXISTS students_${TOKEN}, credentials_${TOKEN};"
if [[ $? -eq 0 ]]; then
    echo "Tables students_${TOKEN} and credentials_${TOKEN} deleted successfully." | tee -a "$MAIN_LOG_FILE"
else
    echo "Error: Failed to delete tables." | tee -a "$MAIN_LOG_FILE"
fi

# Log WebSocket server stop
PID=$(cat "websocket_server.pid")
kill "$PID"
echo "WebSocket server stopped." | tee -a "$MAIN_LOG_FILE"
rm websocket_server.pid

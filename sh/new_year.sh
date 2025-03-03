#!/bin/bash

# Initialize variables
root_folder="/sftp" # Define the root folder for class/student structure
classes=()
temp_folder="$root_folder/temp" # Temporary folder for intermediate promotion

# Variables
DB_HOST="localhost"      # Database host
DB_USER="admin1"      # MySQL username
DB_PASS="zaq1@WSX"  # MySQL password
DB_NAME="student_system"    # Database name

# Function to get classes from the teacher
get_classes() {
    echo "Enter the class names (separated by spaces):"
    read -a classes
    echo "Classes registered: ${classes[@]}"
}

# Function to delete Linux users based on the class name containing '5'
delete_linux_users() {
    echo "Deleting Linux users for class 5 students."

    # Query the user_list database for users whose class contains a '5'
    query="SELECT login FROM user_list WHERE class LIKE '%5%'"
    
    # Get the list of logins from the database
    logins=$(mysql -u "$db_user" -p"$db_password" -D "$db_name" -e "$query" -s -N)
    
    if [ -z "$logins" ]; then
        echo "No users found for class 5 students."
        return
    fi

    # Loop through the logins and delete each user
    for login in $logins; do
        echo "Deleting Linux user: $login"
        userdel -r "$login"  # -r to remove the user's home directory as well
    done

    # Delete records from the database that have class '5'
    echo "Deleting records from the user_list table for class 5 students."
    delete_query="DELETE FROM user_list WHERE class LIKE '%5%'"
    mysql -u "$db_user" -p"$db_password" -D "$db_name" -e "$delete_query"
    echo "Database records for class 5 students deleted."
}

# Function to promote classes and manage student files
promote_classes() {
    echo "Scanning root folder: $root_folder"

    # Clean up class 5 at the start
    for letter in {a..g}; do
        class_name="5${letter}"
        class_path="$root_folder/$class_name"

        if [[ -d "$class_path" ]]; then
            echo "Deleting class $class_name as it cannot be promoted."
            rm -rf "$class_path"
        fi
    done

    # Create a temporary folder for intermediate promotions
    mkdir -p "$temp_folder"

    # Perform promotions from highest to lowest to avoid overwrites
    for number in {4..1}; do
        for letter in {a..g}; do
            class_name="${number}${letter}"
            class_path="$root_folder/$class_name"

            if [[ -d "$class_path" ]]; then
                echo "Processing class: $class_name"

                # Determine the next class name
                next_number=$((number + 1))
                next_class_name="${next_number}${letter}"
                temp_class_path="$temp_folder/$next_class_name"

                # Promote the current class to the temp folder
                echo "Promoting $class_name to temporary $next_class_name."
                mkdir -p "$temp_class_path"

                for student_path in "$class_path"/*; do
                    if [[ -d "$student_path" ]]; then
                        student_name=$(basename "$student_path")
                        echo "Moving student: $student_name"
                        mv "$student_path" "$temp_class_path/$student_name"
                    fi
                done

                echo "Class $class_name moved to temporary $next_class_name."

                # Remove the old class folder
                rm -rf "$class_path"
                echo "Deleted old class folder: $class_name."
            fi
        done
    done

    # Move promoted classes from temp folder to final destinations
    for number in {2..5}; do
        for letter in {a..d}; do
            temp_class_name="${number}${letter}"
            temp_class_path="$temp_folder/$temp_class_name"
            final_class_path="$root_folder/$temp_class_name"

            if [[ -d "$temp_class_path" ]]; then
                echo "Finalizing promotion for $temp_class_name."
                mkdir -p "$final_class_path"

                for student_path in "$temp_class_path"/*; do
                    student_name=$(basename "$student_path")
                    echo "Moving student: $student_name to final $temp_class_name."
                    mv "$student_path" "$final_class_path/$student_name"
                done

                rm -rf "$temp_class_path" # Clean up temp folder
                echo "Promotion for $temp_class_name finalized."
            fi
        done
    done

    # Clean up temporary folder
    rm -rf "$temp_folder"

    # Check for students left behind
    manage_leftover_students
}

# Function to handle students left behind
manage_leftover_students() {
    echo "Checking for students left behind."

    for number in {2..5}; do
        for letter in {a..d}; do
            class_name="${number}${letter}"
            class_path="$root_folder/$class_name"

            if [[ -d "$class_path" ]]; then
                echo "Students in class $class_name:"
                ls "$class_path"
                
                while true; do
                    echo "Enter the name of a student to mark as not promoted, or press Enter to skip:"
                    read student_name

                    if [[ -z "$student_name" ]]; then
                        break
                    fi

                    if [[ -d "$class_path/$student_name" ]]; then
                        echo "Enter the class to move $student_name to (e.g., 3b):"
                        read new_class

                        if [[ " ${classes[@]} " =~ " ${new_class} " ]]; then
                            new_class_path="$root_folder/$new_class"
                            mkdir -p "$new_class_path"

                            echo "Moving $student_name to $new_class."
                            mv "$class_path/$student_name" "$new_class_path/$student_name"
                        else
                            echo "Class $new_class is not a class you teach. Fuck this $student_name guy >:O"
                        fi
                    else
                        echo "$student_name does not exist in class $class_name."
                    fi
                done
            fi
        done
    done
}

# Function to handle exiting the script
exit_script() {
    echo -e "\nExiting. Final promoted classes: ${classes[@]}"
    exit 0
}

# Function to confirm exit
confirm_exit() {
    while true; do
        echo -e "\nDo you want to exit the program? (y/n)"
        read -p "Your choice: " choice

        case "$choice" in
            y|Y)
                exit_script
                ;;
            n|N)
                echo "Returning to main menu."
                break
                ;;
            *)
                echo "Invalid choice. Please enter 'y' or 'n'."
                ;;
        esac
    done
}

# Main script execution
trap "confirm_exit" SIGINT

echo "Welcome to the Student Account Management System."
get_classes
delete_linux_users
promote_classes

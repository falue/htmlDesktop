#!/bin/bash

# Array of folders to include in the search
# include_folders=( "./workstations" "./programs/bash" )
include_folders=( "../os" "../workstations" "../programs" "../tools" )

# Array of folders to exclude from the search
exclude_folders=( "_archive" "threejs" "collectedPaths.txt" )

# Array of file endings to search for
file_endings=( ".css" ".js" ".txt" ".json" ".fakeBash" ".splash" )

# Output file
output_file="collectedPaths.txt"

# Empty the output file
> "$output_file"

# Get current date and time in "MM.DD.YYYY hh:mm" format
current_datetime=$(date +"%m.%d.%Y %H:%M")

# Write the current date and time to the output file
echo "$current_datetime" > "$output_file"

echo "Looking for these files:"
echo "  .css, .js, .txt, .json, .fakeBash, .splash"
echo ""

# Loop over the include folders
for folder in "${include_folders[@]}"; do
  # Check if the folder exists
  if [ -d "$folder" ]; then
    echo ""
    echo "Searching in '$folder' for files with specified endings..."
    # Initialize file count
    file_count=0
    # Loop over file endings
    for ending in "${file_endings[@]}"; do
      # Use find to list files that end with the current ending, count them and write the output to the output file
      while IFS= read -r file; do
        # Check if the file path contains any of the exclude folder keywords
        skip_file=false
        for exclude_folder in "${exclude_folders[@]}"; do
          if [[ "$file" == *"$exclude_folder"* ]]; then
            skip_file=true
            break
          fi
        done

        # If the file is not excluded, count it and write to the output file
        if [ "$skip_file" = false ]; then
          # echo "$file" >> "$output_file"
          echo "${file#../}" >> "$output_file"  # Remove ../ from file paths

          ((file_count++))
        fi
      done < <(find "$folder" -type f -name "*$ending")
    done
    echo "  [Found $file_count files in '$folder']"
  else
    echo "Directory '$folder' does not exist."
    echo "please cd to the folder 'tools/' or make sure the folder does indeededly exist."
    exit
  fi
done

echo ""

# Completion diagnostic message
echo "File search complete. Paths have been written to $output_file."
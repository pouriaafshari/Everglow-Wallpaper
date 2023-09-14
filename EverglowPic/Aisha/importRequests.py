import os

# Get the current directory
current_directory = os.getcwd()

# List all files in the current directory
files = os.listdir(current_directory)

# Filter only image files (you can customize the list of image extensions)
image_extensions = ['.jpg', '.jpeg', '.png', '.gif']
image_files = [file for file in files if any(file.lower().endswith(ext) for ext in image_extensions)]

# Sort the image files
image_files.sort()

# Rename the image files to numeric values
for i, image_file in enumerate(image_files, start=1):
    # Get the file extension
    _, file_extension = os.path.splitext(image_file)
    
    # Construct the new filename
    new_filename = f"{i}{file_extension}"
    
    # Rename the file
    os.rename(image_file, new_filename)
    print(f"Renamed '{image_file}' to '{new_filename}'")

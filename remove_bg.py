import os
from rembg import remove
from PIL import Image

def remove_backgrounds(directory):
    images = ["slide1.png", "slide2.png", "slide3.png", "slide4.png"]
    
    for filename in images:
        input_path = os.path.join(directory, filename)
        output_path = os.path.join(directory, "new_" + filename)
        
        if os.path.exists(input_path):
            print(f"Processing {filename}...")
            try:
                input_image = Image.open(input_path)
                output_image = remove(input_image)
                output_image.save(output_path)
                
                # Replace original with new
                os.remove(input_path)
                os.rename(output_path, input_path)
                print(f"Successfully removed background for {filename}")
            except Exception as e:
                print(f"Failed processing {filename}: {str(e)}")

if __name__ == "__main__":
    target_dir = r"c:\Users\HP\OneDrive\Desktop\team-task-manager\frontend\public\images"
    remove_backgrounds(target_dir)

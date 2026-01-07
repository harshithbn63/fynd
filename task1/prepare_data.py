import kagglehub
import pandas as pd
import os
import shutil

# Download latest version
path = kagglehub.dataset_download("omkarsabnis/yelp-reviews-dataset")
print("Path to dataset files:", path)

# List files in the path
files = os.listdir(path)
print("Files in dataset:", files)

# Find the csv file (usually it's yelp_academic_dataset_review.csv or similar)
csv_file = [f for f in files if f.endswith('.csv')][0]
full_path = os.path.join(path, csv_file)

# Load and sample
df = pd.read_csv(full_path)
print("Dataset shape:", df.shape)

sample_df = df.sample(n=200, random_state=42)
sample_df.to_csv('yelp_sample_200.csv', index=False)
print("Sampled 200 rows to yelp_sample_200.csv")

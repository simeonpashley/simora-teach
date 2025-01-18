
import pandas as pd

# Load the Excel file
file_path = '~/Downloads/teach.xlsx'  # Replace with your file's path
excel_data = pd.ExcelFile(file_path)

# Parse all sheets
sheet_data = {sheet: excel_data.parse(sheet) for sheet in excel_data.sheet_names}

# Display sheet names and columns
for sheet, data in sheet_data.items():
    print(f"Sheet: {sheet}")
    print(data.head())

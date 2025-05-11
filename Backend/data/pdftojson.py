import fitz
import json
pdf_path='data.pdf'

# with pdfplumber.open(pdf_path) as pdf:
#     print(pdf)
#     for page in pdf:
#         text = page.extract_text()
#         print(text)
        
doc = fitz.open(pdf_path)
for page in doc:
    text = page.get_text()
    print(text)       
import os
import re
from typing import List, Dict, Any, Optional
from datetime import datetime
from pypdf import PdfReader
from docx import Document as DocxReader
from PIL import Image

def extract_text_from_pdf(file_path: str) -> List[Dict[str, Any]]:
    """
    Extracts text page-by-page from a PDF file.
    Returns list of dicts: [{"page": 1, "text": "..."}]
    """
    pages_data = []
    try:
        reader = PdfReader(file_path)
        for idx, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            pages_data.append({
                "page": idx + 1,
                "text": text.strip()
            })
    except Exception as e:
        print(f"Error extracting PDF text from {file_path}: {e}")
    return pages_data

def extract_text_from_docx(file_path: str) -> List[Dict[str, Any]]:
    """
    Extract text from DOCX file.
    """
    try:
        doc = DocxReader(file_path)
        full_text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        return [{"page": 1, "text": full_text}]
    except Exception as e:
        print(f"Error extracting DOCX text: {e}")
        return []

def extract_text_from_image(file_path: str) -> List[Dict[str, Any]]:
    """
    Extract text/content from image.
    Uses OCR if available, or descriptive placeholder for scanned certificates/notices.
    """
    try:
        img = Image.open(file_path)
        # Check basic image metadata
        info = f"Uploaded image document: {os.path.basename(file_path)}, size={img.size}, mode={img.mode}."
        return [{"page": 1, "text": info}]
    except Exception as e:
        return [{"page": 1, "text": f"Image file: {os.path.basename(file_path)}"}]

def extract_text_from_file(file_path: str) -> List[Dict[str, Any]]:
    """
    Universal extractor dispatch based on file extension.
    """
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return extract_text_from_docx(file_path)
    elif ext in [".png", ".jpg", ".jpeg", ".webp"]:
        return extract_text_from_image(file_path)
    else: # .txt, .md, .csv
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            return [{"page": 1, "text": content}]
        except Exception as e:
            print(f"Error reading file {file_path}: {e}")
            return []

def split_text_into_chunks(
    text: str,
    chunk_size: int = 600,
    chunk_overlap: int = 100
) -> List[Dict[str, Any]]:
    """
    Recursive character text splitter that respects sections, paragraphs, and headings.
    """
    if not text:
        return []

    # Clean redundant whitespaces
    cleaned = re.sub(r'\r\n', '\n', text)
    
    # Split by markdown headers or double newlines
    paragraphs = re.split(r'(\n#{1,4}\s+[^\n]+|\n\n+)', cleaned)
    
    chunks = []
    current_chunk = ""
    current_section = "General"
    
    for part in paragraphs:
        if not part:
            continue
        # Check if part is a section header
        header_match = re.match(r'^\n?(#{1,4}\s+)(.+)$', part)
        if header_match:
            current_section = header_match.group(2).strip()
            if len(current_chunk) > 100:
                chunks.append({
                    "content": current_chunk.strip(),
                    "section": current_section
                })
                current_chunk = part
                continue

        if len(current_chunk) + len(part) <= chunk_size:
            current_chunk += part
        else:
            if current_chunk.strip():
                chunks.append({
                    "content": current_chunk.strip(),
                    "section": current_section
                })
            # Start new chunk with overlap if possible
            overlap_prefix = current_chunk[-chunk_overlap:] if len(current_chunk) >= chunk_overlap else ""
            current_chunk = overlap_prefix + part

    if current_chunk.strip():
        chunks.append({
            "content": current_chunk.strip(),
            "section": current_section
        })

    return chunks

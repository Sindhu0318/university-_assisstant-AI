import re
from typing import Tuple

TELUGU_RANGE = re.compile(r'[\u0C00-\u0C7F]')
HINDI_RANGE = re.compile(r'[\u0900-\u097F]')

TELUGU_KEYWORDS = {
    "entha", "undali", "emiti", "epudu", "eppudu", "chadavali", "parikshalu", 
    "fees", "scholarship", "ela", "yela", "haajaru", "hajari", "telugu", "chesukovali"
}

HINDI_KEYWORDS = {
    "kitna", "hona", "chahiye", "kab", "kaise", "pariksha", "niyam", 
    "chhatravritti", "shulk", "kya", "hai", "batao", "hindi", "karna"
}

def detect_language(text: str, fallback: str = "en") -> str:
    """
    Detects language from text script or transliterated tokens.
    Returns: 'en', 'te', or 'hi'
    """
    if not text:
        return fallback

    # Check native unicode scripts
    if TELUGU_RANGE.search(text):
        return "te"
    if HINDI_RANGE.search(text):
        return "hi"

    # Check transliterated words
    tokens = set(re.findall(r'\b\w+\b', text.lower()))
    if tokens & TELUGU_KEYWORDS:
        return "te"
    if tokens & HINDI_KEYWORDS:
        return "hi"

    return fallback

def get_multilingual_system_prompt_instruction(language: str) -> str:
    """
    Returns specific system instructions for language output.
    """
    if language == "te":
        return (
            "\nIMPORTANT: Respond in natural, polite Telugu (తెలుగు) script. "
            "Translate the retrieved university policies and facts accurately into Telugu while keeping official course codes (e.g. AAA, B.Tech) and numbers in standard format."
        )
    elif language == "hi":
        return (
            "\nIMPORTANT: Respond in natural, polite Hindi (हिंदी) script (Devanagari). "
            "Translate the retrieved university policies and facts accurately into Hindi while keeping official course codes and numbers in standard format."
        )
    else:
        return "\nRespond in clear, professional, student-friendly English."

from backend.app.models.user import User
from backend.app.models.chat import Conversation, Message, Feedback
from backend.app.models.assessment import Assessment
from backend.app.models.notice import Notice
from backend.app.models.scholarship import Scholarship
from backend.app.models.calendar import AcademicCalendar
from backend.app.models.fee import FeeStructure
from backend.app.models.placement import PlacementDrive
from backend.app.models.document import Document, DocumentChunk

__all__ = [
    "User",
    "Conversation",
    "Message",
    "Feedback",
    "Assessment",
    "Notice",
    "Scholarship",
    "AcademicCalendar",
    "FeeStructure",
    "PlacementDrive",
    "Document",
    "DocumentChunk",
]

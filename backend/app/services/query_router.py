import re
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models.assessment import Assessment
from backend.app.models.notice import Notice
from backend.app.models.scholarship import Scholarship
from backend.app.models.calendar import AcademicCalendar
from backend.app.models.fee import FeeStructure
from backend.app.models.placement import PlacementDrive

def classify_query(query: str) -> Dict[str, Any]:
    """
    Classifies user query intent and extracts structured parameters if present.
    Supports English, Telugu, and Hindi keywords.
    """
    q_lower = query.lower()
    
    # 1. Assessment module queries (e.g., AAA, BBB, TMA, CMA, assessment weightage)
    module_match = re.search(r'\b(module\s+)?([A-G]{3})\b', query, re.IGNORECASE)
    presentation_match = re.search(r'\b(2013[BJ]|2014[BJ])\b', query, re.IGNORECASE)
    
    is_assessment_keyword = any(k in q_lower for k in [
        "assessment", "tma", "cma", "weightage", "weight", "module aaa", "module bbb", 
        "module ccc", "module ddd", "module eee", "module fff", "module ggg", "id_assessment",
        "ఎసెస్మెంట్", "వెయిటేజ్", "मूल्यांकन"
    ])
    
    if is_assessment_keyword or (module_match and any(w in q_lower for w in ["exam", "test", "assignment", "due", "date", "weight"])):
        module_code = module_match.group(2).upper() if module_match else None
        presentation_code = presentation_match.group(1).upper() if presentation_match else None
        return {
            "intent": "assessments_structured",
            "module_code": module_code,
            "presentation_code": presentation_code,
            "hybrid": "tma" in q_lower or "cma" in q_lower or "explain" in q_lower or "mean" in q_lower
        }

    # 2. Notices query
    if any(k in q_lower for k in ["notice", "announcement", "circular", "notification", "updates", "latest news", "నోటీసులు", "సర్క్యులర్", "सूचना"]):
        return {"intent": "notices_structured"}

    # 3. Calendar query
    if any(k in q_lower for k in ["calendar", "semester start", "holiday", "commence", "schedule", "reopening", "when is the next exam", "క్యాలెండర్", "సెలవులు", "कैलेंडर"]):
        return {"intent": "calendar_structured"}

    # 4. Scholarship query
    if any(k in q_lower for k in ["scholarship", "financial aid", "fee waiver", "vidya jyothi", "chancellor's merit", "chhatravritti", "స్కాలర్‌షిప్", "విద్యార్థి వేతనం", "छात्रवृत्ति"]):
        return {"intent": "scholarships_structured"}

    # 5. Fee structure query
    if any(k in q_lower for k in ["fee structure", "tuition fee", "hostel fee", "bus fee", "transport fee", "refund policy", "shulk", "ఫీజు", "హాస్టల్ ఫీజు", "शुल्क"]):
        return {"intent": "fees_structured"}

    # 6. Placement query
    if any(k in q_lower for k in ["placement", "highest package", "average ctc", "super dream", "recruiter", "job offer", "t&p", "ప్లేస్‌మెంట్", "ఉద్యోగాలు", "प्लेसमेंट"]):
        return {"intent": "placements_structured"}

    # 7. Attendance query (English, Telugu, Hindi)
    if any(k in q_lower for k in ["attendance", "75%", "condonation", "medical exemption", "shortage", "detention", "haajaru", "hajari", "హాజరు", "హాజరీ", "उपस्थिति"]):
        return {"intent": "attendance_policy", "category": "Attendance Policies"}

    # 8. Examination / Malpractice / Revaluation query
    if any(k in q_lower for k in ["examination", "exam rules", "malpractice", "revaluation", "hall ticket", "supplementary", "backlog", "పరీక్ష", "పరీక్షలు", "రీవాల్యుయేషన్", "परीक्षा"]):
        return {"intent": "examination_rules", "category": "Examination Rules"}

    # 9. Academic regulations query
    if any(k in q_lower for k in ["regulation", "credit", "cgpa", "sgpa", "grading", "promotion rule", "graduation requirement", "నిబంధనలు", "క్రెడిట్స్", "గ్రేడింగ్"]):
        return {"intent": "academic_regulations", "category": "Academic Regulations"}

    return {"intent": "general_knowledge"}

def execute_structured_query(db: Session, intent_data: Dict[str, Any]) -> Optional[str]:
    intent = intent_data.get("intent")
    
    if intent == "assessments_structured":
        q = db.query(Assessment)
        module_code = intent_data.get("module_code")
        presentation = intent_data.get("presentation_code")
        
        if module_code:
            q = q.filter(Assessment.code_module == module_code)
        if presentation:
            q = q.filter(Assessment.code_presentation == presentation)
            
        assessments = q.order_by(Assessment.code_module, Assessment.code_presentation, Assessment.date).limit(20).all()
        if not assessments:
            return None
        
        lines = [f"### Official Assessment Schedule & Weightages ({module_code or 'All Modules'})\n"]
        lines.append("| Module | Presentation | Assessment ID | Type | Due Day / Date | Weightage (%) |")
        lines.append("| :--- | :--- | :--- | :--- | :--- | :--- |")
        for a in assessments:
            due_str = f"Day {a.date}" if a.date is not None else "Final Exam Window"
            lines.append(f"| **{a.code_module}** | {a.code_presentation} | {a.id_assessment} | `{a.assessment_type}` | {due_str} | **{a.weight}%** |")
        
        lines.append("\n*Note: TMA = Tutor Marked Assessment, CMA = Computer Marked Assessment.*")
        return "\n".join(lines)

    elif intent == "notices_structured":
        notices = db.query(Notice).filter(Notice.is_active == True).order_by(Notice.date.desc()).limit(5).all()
        if not notices:
            return None
        lines = ["### Official University Notices & Circulars\n"]
        for n in notices:
            lines.append(f"- **[{n.priority.upper()}] {n.title}** ({n.category}) - *{n.department}*")
            lines.append(f"  {n.description}")
            lines.append(f"  *Published: {n.date.strftime('%d %b %Y')}*")
        return "\n".join(lines)

    elif intent == "calendar_structured":
        events = db.query(AcademicCalendar).order_by(AcademicCalendar.start_date).limit(6).all()
        if not events:
            return None
        lines = ["### Academic Calendar & Important Dates\n"]
        for ev in events:
            date_str = ev.start_date.strftime("%d %b %Y")
            if ev.end_date:
                date_str += f" to {ev.end_date.strftime('%d %b %Y')}"
            holiday_badge = " *(University Holiday)*" if ev.is_holiday else ""
            lines.append(f"- **{ev.title}** (`{ev.event_type}`){holiday_badge}: **{date_str}**")
            if ev.description:
                lines.append(f"  {ev.description}")
        return "\n".join(lines)

    elif intent == "scholarships_structured":
        scholarships = db.query(Scholarship).filter(Scholarship.is_active == True).all()
        if not scholarships:
            return None
        lines = ["### University Scholarships & Financial Aid Opportunities\n"]
        for s in scholarships:
            lines.append(f"#### 🏆 {s.name} ({s.category})")
            lines.append(f"- **Award:** **{s.award_amount}**")
            lines.append(f"- **Eligibility:** {s.eligibility}")
            if s.min_cgpa:
                lines.append(f"- **Minimum CGPA:** {s.min_cgpa}")
            if s.income_limit:
                lines.append(f"- **Annual Income Limit:** Rs. {s.income_limit:,.0f}")
            lines.append(f"- **Application Deadline:** **{s.deadline}**")
            if s.required_documents:
                lines.append(f"- **Required Documents:** {s.required_documents}")
            lines.append("")
        return "\n".join(lines)

    elif intent == "fees_structured":
        fees = db.query(FeeStructure).all()
        if not fees:
            return None
        lines = ["### Official University Fee Structure & Schedules\n"]
        lines.append("| Program / Category | Type | Amount (INR) | Payment Due Date |")
        lines.append("| :--- | :--- | :--- | :--- |")
        for f in fees:
            lines.append(f"| **{f.program}** | {f.category} | **Rs. {f.amount:,.0f}** ({f.frequency}) | {f.due_date} |")
        return "\n".join(lines)

    elif intent == "placements_structured":
        drives = db.query(PlacementDrive).all()
        if not drives:
            return None
        lines = ["### Campus Placements & Recruitment Highlights\n"]
        for d in drives:
            lines.append(f"- **{d.company_name}** (`{d.tier}`): **Rs. {d.ctc_lpa} LPA** | Min CGPA: {d.min_cgpa} | Max Backlogs: {d.max_backlogs}")
            lines.append(f"  *Roles:* {d.roles} | *Eligible:* {d.eligible_branches}")
        return "\n".join(lines)

    return None

import os
import csv
import datetime
from sqlalchemy.orm import Session
from backend.app.database import engine, SessionLocal, Base
from backend.app.models.user import User
from backend.app.models.assessment import Assessment
from backend.app.models.notice import Notice
from backend.app.models.scholarship import Scholarship
from backend.app.models.calendar import AcademicCalendar
from backend.app.models.fee import FeeStructure
from backend.app.models.placement import PlacementDrive
from backend.app.models.document import Document, DocumentChunk
from backend.app.services.auth_service import hash_password
from backend.app.services.ingestion_service import extract_text_from_file, split_text_into_chunks
from backend.app.services.embedding_service import get_embedding

def seed_database(db: Session = None):
    # Ensure all tables exist
    Base.metadata.create_all(bind=engine)
    
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        print("[INFO] Seeding Users...")
        users_to_create = [
            {
                "email": "student@university.edu",
                "password": "Student@123",
                "full_name": "Aarav Sharma",
                "role": "student",
                "department": "Computer Science & Engineering",
                "student_id": "21BCE1042"
            },
            {
                "email": "faculty@university.edu",
                "password": "Faculty@123",
                "full_name": "Dr. Priya Sundaram",
                "role": "faculty",
                "department": "Computer Science & Engineering"
            },
            {
                "email": "admin@university.edu",
                "password": "Admin@123",
                "full_name": "Dean of Academic Systems",
                "role": "admin",
                "department": "Central Administration"
            }
        ]
        
        for u in users_to_create:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                db.add(User(
                    email=u["email"],
                    hashed_password=hash_password(u["password"]),
                    full_name=u["full_name"],
                    role=u["role"],
                    department=u.get("department"),
                    student_id=u.get("student_id")
                ))
        db.commit()

        print("[INFO] Ingesting assessments.csv into SQL table...")
        assessments_path = os.path.join(os.path.dirname(__file__), "../../../data/assessments.csv")
        if os.path.exists(assessments_path):
            existing_count = db.query(Assessment).count()
            if existing_count == 0:
                with open(assessments_path, mode="r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    assessments_batch = []
                    for row in reader:
                        date_val = int(row["date"]) if row["date"] and row["date"].strip() else None
                        weight_val = float(row["weight"]) if row["weight"] and row["weight"].strip() else 0.0
                        assessments_batch.append(Assessment(
                            code_module=row["code_module"].strip(),
                            code_presentation=row["code_presentation"].strip(),
                            id_assessment=int(row["id_assessment"]),
                            assessment_type=row["assessment_type"].strip(),
                            date=date_val,
                            weight=weight_val,
                            title=f"Module {row['code_module']} ({row['assessment_type']})",
                            description=f"Assessment ID {row['id_assessment']} for {row['code_module']} in presentation {row['code_presentation']}"
                        ))
                    db.bulk_save_objects(assessments_batch)
                    db.commit()
                    print(f"[OK] Ingested {len(assessments_batch)} assessments from CSV.")

        print("[INFO] Ingesting Knowledge Base Documents & Vectors...")
        seed_docs_dir = os.path.join(os.path.dirname(__file__), "../../../data/seed_documents")
        if os.path.exists(seed_docs_dir):
            for fname in os.listdir(seed_docs_dir):
                file_path = os.path.join(seed_docs_dir, fname)
                if not os.path.isfile(file_path):
                    continue
                
                doc_id = f"DOC-{fname.upper().replace('.MD', '').replace('_', '-')}"
                existing_doc = db.query(Document).filter(Document.document_id == doc_id).first()
                if not existing_doc:
                    title = fname.replace("_", " ").replace(".md", "").title()
                    category = "Academic Regulations"
                    if "attendance" in fname.lower():
                        category = "Attendance Policies"
                    elif "exam" in fname.lower():
                        category = "Examination Rules"
                    elif "fee" in fname.lower():
                        category = "Fee Structure"
                    elif "scholar" in fname.lower():
                        category = "Scholarships"
                    elif "place" in fname.lower():
                        category = "Placements"
                    elif "handbook" in fname.lower():
                        category = "Student Handbook"

                    doc = Document(
                        document_id=doc_id,
                        title=title,
                        category=category,
                        department="Academic Affairs",
                        document_type="MD",
                        file_path=file_path,
                        file_size_bytes=os.path.getsize(file_path),
                        version="2026.1",
                        status="indexed"
                    )
                    db.add(doc)
                    db.commit()

                    # Extract and chunk
                    pages = extract_text_from_file(file_path)
                    all_chunks = []
                    chunk_idx = 0
                    for p in pages:
                        split_chunks = split_text_into_chunks(p["text"], chunk_size=500, chunk_overlap=80)
                        for sc in split_chunks:
                            emb = get_embedding(sc["content"])
                            chunk_obj = DocumentChunk(
                                document_id=doc_id,
                                chunk_index=chunk_idx,
                                content=sc["content"],
                                section_title=sc.get("section", "General"),
                                page_number=p.get("page", 1),
                                token_count=len(sc["content"].split()),
                                embedding=emb
                            )
                            all_chunks.append(chunk_obj)
                            chunk_idx += 1
                    
                    db.bulk_save_objects(all_chunks)
                    doc.chunk_count = len(all_chunks)
                    db.commit()
                    print(f"[OK] Indexed Document '{title}' with {len(all_chunks)} vector chunks.")

        print("[INFO] Seeding Notices...")
        if db.query(Notice).count() == 0:
            notices_data = [
                Notice(
                    title="End Semester Examination Schedule Released (Autumn 2026)",
                    description="The Controller of Examinations has published the final timetable for theory and laboratory end-semester exams. Hall tickets available for download from Nov 20.",
                    category="Examinations",
                    department="Controller of Examinations",
                    priority="Urgent",
                    date=datetime.datetime.utcnow() - datetime.timedelta(days=2)
                ),
                Notice(
                    title="Chancellor's Merit & Vidya Jyothi Scholarship Applications Open",
                    description="Eligible students can submit scholarship applications through the student portal before September 15. Ensure income certificate is valid within 6 months.",
                    category="Scholarships",
                    department="Student Welfare Cell",
                    priority="High",
                    date=datetime.datetime.utcnow() - datetime.timedelta(days=5)
                ),
                Notice(
                    title="Super Dream Placement Drive - Microsoft & Google Campus Recruitment",
                    description="Registration open for final year B.Tech/M.Tech students with CGPA >= 8.0 and zero backlogs. PPT on Friday at University Auditorium.",
                    category="Placements",
                    department="Training & Placement Cell",
                    priority="High",
                    date=datetime.datetime.utcnow() - datetime.timedelta(days=7)
                ),
                Notice(
                    title="Strict Attendance Condonation Submission Deadline",
                    description="Students in the 65%-74.9% attendance band must submit medical/event proof by 5:00 PM next Friday to be considered for exam eligibility.",
                    category="Attendance",
                    department="Dean of Student Affairs",
                    priority="High",
                    date=datetime.datetime.utcnow() - datetime.timedelta(days=10)
                )
            ]
            db.bulk_save_objects(notices_data)
            db.commit()

        print("[INFO] Seeding Scholarships...")
        if db.query(Scholarship).count() == 0:
            schol_data = [
                Scholarship(
                    name="Chancellor's Merit Scholarship",
                    category="Merit",
                    eligibility="Top 5% rank holders in previous semester with CGPA >= 9.0 and zero backlogs.",
                    min_cgpa=9.0,
                    award_amount="50% Tuition Fee Waiver",
                    deadline="September 15, 2026",
                    application_url="https://portal.university.edu/scholarships/merit",
                    required_documents="Semester Grade Card, Rank Certificate, Bank Passbook"
                ),
                Scholarship(
                    name="Vidya Jyothi EWS Financial Aid",
                    category="Need-Based",
                    eligibility="Annual family income < Rs. 3,00,000 with minimum CGPA 7.0.",
                    income_limit=300000.0,
                    min_cgpa=7.0,
                    award_amount="75% Tuition Fee Waiver + Subsidized Hostel",
                    deadline="August 31, 2026",
                    application_url="https://portal.university.edu/scholarships/vidya-jyothi",
                    required_documents="Income Certificate from Tahsildar, BPL/Ration Card, Parents' ITR/Salary Slip"
                ),
                Scholarship(
                    name="Sports & Cultural Excellence Award",
                    category="Sports",
                    eligibility="State/National level medal winners in AIU / Khelo India competitions.",
                    award_amount="100% Tuition Waiver + Free Sports Kit",
                    deadline="Rolling (Throughout the Year)",
                    application_url="https://portal.university.edu/scholarships/sports",
                    required_documents="Sports Certificate, Federation Verification, Coach Recommendation"
                )
            ]
            db.bulk_save_objects(schol_data)
            db.commit()

        print("[INFO] Seeding Academic Calendar Events...")
        if db.query(AcademicCalendar).count() == 0:
            now = datetime.datetime.utcnow()
            cal_data = [
                AcademicCalendar(
                    title="Commencement of Autumn Semester Classes",
                    event_type="Classes",
                    start_date=now - datetime.timedelta(days=20),
                    semester="Odd Semester",
                    description="Official class start for all 2nd, 3rd, and 4th year undergraduate programs."
                ),
                AcademicCalendar(
                    title="Mid-Term Assessment 1 (Mid-Sem 1)",
                    event_type="Examination",
                    start_date=now + datetime.timedelta(days=15),
                    end_date=now + datetime.timedelta(days=20),
                    semester="Odd Semester",
                    description="Continuous assessment for theory courses (Weightage: 15%)."
                ),
                AcademicCalendar(
                    title="Mid-Term Assessment 2 (Mid-Sem 2)",
                    event_type="Examination",
                    start_date=now + datetime.timedelta(days=60),
                    end_date=now + datetime.timedelta(days=65),
                    semester="Odd Semester",
                    description="Continuous assessment for theory courses (Weightage: 15%)."
                ),
                AcademicCalendar(
                    title="End-Semester Theory & Practical Examinations",
                    event_type="Examination",
                    start_date=now + datetime.timedelta(days=95),
                    end_date=now + datetime.timedelta(days=115),
                    semester="Odd Semester",
                    description="Final University Examinations (Weightage: 60%)."
                ),
                AcademicCalendar(
                    title="National Gandhi Jayanti & University Holiday",
                    event_type="Holiday",
                    start_date=now + datetime.timedelta(days=40),
                    is_holiday=True,
                    description="Campus closed for public holiday."
                )
            ]
            db.bulk_save_objects(cal_data)
            db.commit()

        print("[INFO] Seeding Fee Structures...")
        if db.query(FeeStructure).count() == 0:
            fee_data = [
                FeeStructure(program="B.Tech Computer Science & Engineering", category="Tuition", amount=145000.0, frequency="Annual", due_date="July 15 (Autumn) / Dec 15 (Spring)"),
                FeeStructure(program="B.Tech ECE / EEE / Mechanical", category="Tuition", amount=120000.0, frequency="Annual", due_date="July 15 (Autumn) / Dec 15 (Spring)"),
                FeeStructure(program="M.Tech (All Specializations)", category="Tuition", amount=85000.0, frequency="Annual", due_date="July 15 (Autumn)"),
                FeeStructure(program="Hostel AC Double Sharing", category="Hostel", amount=85000.0, frequency="Annual", due_date="July 10"),
                FeeStructure(program="Hostel Non-AC Triple Sharing", category="Hostel", amount=55000.0, frequency="Annual", due_date="July 10"),
                FeeStructure(program="Campus Mess & Dining", category="Mess", amount=42000.0, frequency="Annual", due_date="July 10"),
                FeeStructure(program="End Semester Examination Fee", category="Exam", amount=2000.0, frequency="Per Semester", due_date="Nov 10 / April 10")
            ]
            db.bulk_save_objects(fee_data)
            db.commit()

        print("[INFO] Seeding Placement Drives...")
        if db.query(PlacementDrive).count() == 0:
            now = datetime.datetime.utcnow()
            placement_data = [
                PlacementDrive(company_name="Microsoft", tier="Tier 1 (Super Dream)", roles="Software Development Engineer (SDE-1)", ctc_lpa=45.0, min_cgpa=8.5, max_backlogs=0, eligible_branches="CSE, IT, ECE", drive_date=now + datetime.timedelta(days=10), status="Upcoming"),
                PlacementDrive(company_name="Google", tier="Tier 1 (Super Dream)", roles="Application Engineer & SWE", ctc_lpa=48.5, min_cgpa=8.5, max_backlogs=0, eligible_branches="CSE, IT", drive_date=now + datetime.timedelta(days=18), status="Upcoming"),
                PlacementDrive(company_name="Qualcomm", tier="Tier 2 (Dream)", roles="Hardware & Firmware Engineer", ctc_lpa=18.5, min_cgpa=7.5, max_backlogs=0, eligible_branches="ECE, EEE, CSE", drive_date=now + datetime.timedelta(days=25), status="Upcoming"),
                PlacementDrive(company_name="Deloitte", tier="Tier 2 (Dream)", roles="Tech Consultant / Analyst", ctc_lpa=10.5, min_cgpa=7.0, max_backlogs=1, eligible_branches="All Engineering Branches", drive_date=now + datetime.timedelta(days=30), status="Upcoming"),
                PlacementDrive(company_name="Tata Consultancy Services (TCS Digital)", tier="Tier 3 (Core/IT)", roles="Digital Software Engineer", ctc_lpa=7.5, min_cgpa=6.5, max_backlogs=1, eligible_branches="All Branches", drive_date=now + datetime.timedelta(days=45), status="Upcoming")
            ]
            db.bulk_save_objects(placement_data)
            db.commit()

        print("[SUCCESS] Database seeding completed successfully!")
    finally:
        if close_db:
            db.close()

if __name__ == "__main__":
    seed_database()

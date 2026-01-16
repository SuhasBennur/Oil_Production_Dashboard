from fastapi import FastAPI, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import pandas as pd
import os
from fastapi.responses import FileResponse
import random

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Excel file path
USERS_EXCEL_FILE = "./DB/users.xlsx"
FORMS_EXCEL_FILE = "./DB/forms.xlsx"

# Extended User model
class User(BaseModel):
    firstName: str | None = None
    lastName: str | None = None
    email: str | None = None
    contactNo: str | None = None
    permanentAddress: str | None = None
    temporaryAddress: str | None = None
    gender: str | None = None
    qualification: str | None = None
    company: str | None = None
    role: str | None = None
    username: str
    password: str
    confirmPassword: str | None = None

@app.post("/forms")
async def submit_form(
    userId: int = Form(...),
    firstName: str = Form(...),
    lastName: str = Form(...),
    site: str = Form(""),
    focalPoint: str = Form(""),
    location: str = Form(""),
    qualifications: str = Form(""),
    roles: str = Form(""),
    workExperience: str = Form(""),
    startDate: str = Form(""),
    endDate: str = Form(""),
    additionalInfo: str = Form(""),
    attachments: UploadFile | None = None,
):
    # Determine next unique ID
    if os.path.exists(FORMS_EXCEL_FILE):
        df = pd.read_excel(FORMS_EXCEL_FILE)
        if "FormID" in df.columns and not df.empty:
            next_form_id = int(df["FormID"].max()) + 1
        else:
            next_form_id = 1
    else:
        next_form_id = 1

    form_data = {
        "FormID": next_form_id,
        "UserID": userId,
        "First Name": firstName,
        "Last Name": lastName,
        "Site": site,
        "Focal Point": focalPoint,
        "Location": location,
        "Qualifications": qualifications,
        "Roles": roles,
        "Work Experience": workExperience,
        "Start Date": startDate,
        "End Date": endDate,
        "Additional Info": additionalInfo,
        "Attachment": attachments.filename if attachments else "",
    }

    # Append or create new DataFrame
    if os.path.exists(FORMS_EXCEL_FILE):
        df = pd.read_excel(FORMS_EXCEL_FILE)
        df = pd.concat([df, pd.DataFrame([form_data])], ignore_index=True)
    else:
        df = pd.DataFrame([form_data])

    df.to_excel(FORMS_EXCEL_FILE, index=False)
    return {"message": f"Form submitted successfully with ID {next_form_id}"}

# Existing /forms endpoint above...

@app.get("/download/forms")
def download_forms():
    if not os.path.exists(FORMS_EXCEL_FILE):
        raise HTTPException(status_code=404, detail="No forms submitted yet")
    return FileResponse(
        path=FORMS_EXCEL_FILE,
        filename="./DB/forms.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


@app.post("/register")
def register(user: User):
    # Validation: password match
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Convert to dict and drop confirmPassword
    user_data = user.dict()
    del user_data["confirmPassword"]

    # If Excel exists, append; else create new
    if os.path.exists(USERS_EXCEL_FILE):
        df = pd.read_excel(USERS_EXCEL_FILE)
        # Check if username already exists
        if user.username in df["username"].values:
            # Generate suggestions
            base1 = f"{user.firstName}{user.lastName}"
            base2 = f"{user.firstName}{user.lastName[:1]}"
            suggestions = [
                base1,
                f"{base1}{random.randint(1,99)}",
                f"{user.firstName}{random.randint(1,99)}{user.lastName}",
                base2,
                f"{base2}{random.randint(1,99)}",
            ]
            raise HTTPException(
                status_code=400,
                detail={"error": "User already exists", "suggestions": suggestions}
            )
        next_user_id = int(df["UserID"].max()) + 1 if "UserID" in df.columns else 1
        user_data["UserID"] = next_user_id
        df = pd.concat([df, pd.DataFrame([user_data])], ignore_index=True)
    else:
        user_data["UserID"] = 1
        df = pd.DataFrame([user_data])

    df.to_excel(USERS_EXCEL_FILE, index=False)
    return {"message": f"Registered successfully with UserID {user_data['UserID']}"}

@app.post("/login")
def login(user: User):
    if not os.path.exists(USERS_EXCEL_FILE):
        raise HTTPException(status_code=404, detail="No users registered yet")

    df = pd.read_excel(USERS_EXCEL_FILE)

    # Normalize column names
    df.columns = df.columns.str.strip().str.lower()

    # Normalize values
    df["username"] = df["username"].astype(str).str.strip().str.lower()
    df["password"] = df["password"].astype(str).str.strip()

    input_username = user.username.strip().lower()
    input_password = user.password.strip()

    match = df[(df["username"] == input_username) & (df["password"] == input_password)]
    if not match.empty:
        user_id = int(match["userid"].values[0]) if "userid" in df.columns else None
        return {"message": "Login successful", "userId": user_id}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/forms/{user_id}")
def get_user_forms(user_id: int):
    if not os.path.exists(FORMS_EXCEL_FILE):
        return []
    df = pd.read_excel(FORMS_EXCEL_FILE)
    if "UserID" not in df.columns:
        return []
    df["UserID"] = df["UserID"].astype(int) # ensure int type
    df = df.where(pd.notnull(df), None) 
    user_forms = df[df["UserID"] == int(user_id)]
    return user_forms.to_dict(orient="records")


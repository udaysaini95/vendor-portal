import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum
import uuid
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(title="Vendor Onboarding Portal API")

# Enable CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files in production
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    @app.get("/")
    async def serve_index():
        return FileResponse("static/index.html")

class VendorCategory(str, Enum):
    STAFFING_AGENCY = "Staffing Agency"
    FREELANCE_PLATFORM = "Freelance Platform"
    CONSULTANT = "Consultant"

class VendorStatus(str, Enum):
    PENDING = "Pending Approval"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class VendorBase(BaseModel):
    name: str
    category: VendorCategory
    contact_email: EmailStr

class VendorCreate(VendorBase):
    pass

class Vendor(VendorBase):
    id: str
    status: VendorStatus = VendorStatus.PENDING

# In-memory storage
vendors_db: List[Vendor] = []

@app.post("/vendors", response_model=Vendor)
async def create_vendor(vendor_data: VendorCreate):
    new_vendor = Vendor(
        id=str(uuid.uuid4()),
        name=vendor_data.name,
        category=vendor_data.category,
        contact_email=vendor_data.contact_email,
        status=VendorStatus.PENDING
    )
    vendors_db.append(new_vendor)
    return new_vendor

@app.get("/vendors", response_model=List[Vendor])
async def get_vendors(category: Optional[VendorCategory] = None):
    if category:
        return [v for v in vendors_db if v.category == category]
    return vendors_db

@app.patch("/vendors/{vendor_id}/approve", response_model=Vendor)
async def approve_vendor(vendor_id: str):
    for vendor in vendors_db:
        if vendor.id == vendor_id:
            vendor.status = VendorStatus.APPROVED
            return vendor
    raise HTTPException(status_code=404, detail="Vendor not found")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

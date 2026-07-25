from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class DominantColor(BaseModel):
    hex: str
    hsl: str
    name: str
    weight: float

class StoryboardScene(BaseModel):
    timestamp: str
    phase: str # e.g. "Hook (0-3s)", "Gameplay (3-12s)", "CTA (12-15s)"
    description: str
    colors: List[str]
    pacing_note: str

class TranscriptSegment(BaseModel):
    start: float
    end: float
    text: str

class OCRText(BaseModel):
    timestamp: float
    text: str

class AdAnalysisBase(BaseModel):
    hook_type: Optional[str] = None
    hook_score: float = 8.5
    dominant_colors: Optional[List[DominantColor]] = None
    storyboard_breakdown: Optional[List[StoryboardScene]] = None
    transcript: Optional[List[TranscriptSegment]] = None
    ocr_texts: Optional[List[OCRText]] = None
    strategic_summary: Optional[str] = None
    cta_text: Optional[str] = None

class AdAnalysisResponse(AdAnalysisBase):
    id: str
    ad_id: str
    analyzed_at: datetime

    class Config:
        from_attributes = True

class BrandResponse(BaseModel):
    id: str
    name: str
    genre: str
    logo_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AdResponse(BaseModel):
    id: str
    brand: BrandResponse
    platform: str
    external_ad_id: Optional[str] = None
    video_url: str
    thumbnail_url: Optional[str] = None
    duration_seconds: float
    first_seen: datetime
    last_seen: datetime
    estimated_impressions: int
    status: str
    created_at: datetime
    analysis: Optional[AdAnalysisResponse] = None

    class Config:
        from_attributes = True

class SemanticSearchQuery(BaseModel):
    query: str
    brand_filter: Optional[str] = None
    platform_filter: Optional[str] = None
    hook_type_filter: Optional[str] = None
    top_k: int = 10

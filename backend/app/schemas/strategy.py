from typing import List, Optional
from pydantic import BaseModel

class CreativeConcept(BaseModel):
    title: str
    target_hook: str
    color_palette: List[str]
    scene_script: str
    why_it_works: str

class StrategyCopilotRequest(BaseModel):
    prompt: str
    target_brand: Optional[str] = "Royal Match"
    genre: Optional[str] = "Casual Puzzle"

class StrategyCopilotResponse(BaseModel):
    query: str
    strategic_report: str
    recommended_concepts: List[CreativeConcept]
    retrieved_ad_ids: List[str]

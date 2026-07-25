import uuid
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.db.models.models import Brand, Ad, AdAnalysis
from app.agents.graph import ad_pipeline_graph

router = APIRouter(prefix="/collection", tags=["Data Collection"])

class CollectionTriggerRequest(BaseModel):
    brand_name: str = Field(..., json_schema_extra={"example": "Royal Match"})
    video_url: str = Field(..., json_schema_extra={"example": "https://assets.mixkit.co/videos/preview/mixkit-game-animation-of-a-character-running-42991-large.mp4"})
    platform: str = Field("Meta", json_schema_extra={"example": "Meta"})
    duration_seconds: float = Field(15.0, json_schema_extra={"example": 15.0})

async def run_agent_pipeline_background(ad_id: str, brand_name: str, video_url: str, platform: str, duration_seconds: float):
    initial_state = {
        "ad_id": ad_id,
        "video_url": video_url,
        "brand_name": brand_name,
        "platform": platform,
        "duration_seconds": duration_seconds,
        "transcript": None,
        "ocr_texts": None,
        "hook_type": None,
        "hook_score": None,
        "dominant_colors": None,
        "storyboard_breakdown": None,
        "strategic_summary": None,
        "cta_text": None,
        "vector_embedding": None,
        "status": "STARTED",
        "errors": []
    }
    await ad_pipeline_graph.ainvoke(initial_state)

@router.post("/trigger")
async def trigger_collection(
    payload: CollectionTriggerRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Trigger Meta / TikTok Scraper and initiate async Multi-Agent LangGraph processing pipeline.
    """
    # 1. Get or create Brand
    stmt = select(Brand).filter(Brand.name == payload.brand_name)
    result = await db.execute(stmt)
    brand = result.scalar_one_or_none()
    
    if not brand:
        brand = Brand(name=payload.brand_name, genre="Casual Puzzle")
        db.add(brand)
        await db.commit()
        await db.refresh(brand)

    # 2. Create Ad record
    ad_id = str(uuid.uuid4())
    new_ad = Ad(
        id=ad_id,
        brand_id=brand.id,
        platform=payload.platform,
        video_url=payload.video_url,
        duration_seconds=payload.duration_seconds,
        status="PROCESSING"
    )
    db.add(new_ad)
    await db.commit()

    # 3. Launch async LangGraph execution in background
    background_tasks.add_task(
        run_agent_pipeline_background,
        ad_id=ad_id,
        brand_name=payload.brand_name,
        video_url=payload.video_url,
        platform=payload.platform,
        duration_seconds=payload.duration_seconds
    )

    return {
        "message": "Ad collection & multi-agent pipeline initiated successfully",
        "ad_id": ad_id,
        "status": "PROCESSING"
    }

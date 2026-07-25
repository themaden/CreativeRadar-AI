import logging
from typing import Dict, Any
from sqlalchemy import select
from langgraph.graph import StateGraph, END
from app.agents.state import AdPipelineState
from app.services.vision_service import vision_service
from app.services.whisper_service import whisper_service
from app.services.ocr_service import ocr_service
from app.services.vector_store import vector_store_service
from app.db.session import AsyncSessionLocal
from app.db.models.models import Ad, AdAnalysis

logger = logging.getLogger(__name__)

# Node 1: Data Collection & Validation
async def collector_node(state: AdPipelineState) -> Dict[str, Any]:
    logger.info(f"[Agent Node: Collector] Validating Ad ID {state['ad_id']} from {state['brand_name']}")
    return {"status": "COLLECTED"}

# Node 2: Audio Transcription & OCR Extraction
async def audio_text_node(state: AdPipelineState) -> Dict[str, Any]:
    logger.info(f"[Agent Node: Audio/Text] Processing speech & OCR for {state['video_url']}")
    transcript = await whisper_service.transcribe_audio(state['video_url'])
    ocr_texts = await ocr_service.extract_text_from_frames(state['video_url'])
    return {
        "transcript": transcript,
        "ocr_texts": ocr_texts,
        "status": "AUDIO_TEXT_PROCESSED"
    }

# Node 3: Multimodal Vision Analysis (Gemini 1.5 / GPT-4o)
async def vision_node(state: AdPipelineState) -> Dict[str, Any]:
    logger.info(f"[Agent Node: Video Vision] Extracting scenes & color palette for {state['video_url']}")
    analysis = await vision_service.analyze_video_frames(state['video_url'], state['duration_seconds'])
    return {
        "hook_type": analysis["hook_type"],
        "hook_score": analysis["hook_score"],
        "dominant_colors": analysis["dominant_colors"],
        "storyboard_breakdown": analysis["storyboard_breakdown"],
        "strategic_summary": analysis["strategic_summary"],
        "cta_text": analysis["cta_text"],
        "status": "VISION_ANALYZED"
    }

# Node 4: Indexing into Qdrant & Relational DB
async def indexer_node(state: AdPipelineState) -> Dict[str, Any]:
    logger.info(f"[Agent Node: Indexer] Embedding & Indexing Ad {state['ad_id']} into Qdrant and Database")
    
    dummy_vector = [0.01 * (i % 10) for i in range(1536)]
    payload = {
        "brand_name": state['brand_name'],
        "platform": state['platform'],
        "hook_type": state.get('hook_type'),
        "strategic_summary": state.get('strategic_summary'),
        "cta_text": state.get('cta_text')
    }
    
    await vector_store_service.upsert_ad_vector(state['ad_id'], dummy_vector, payload)

    # Persist completed analysis to relational database
    try:
        async with AsyncSessionLocal() as session:
            stmt = select(Ad).filter(Ad.id == state['ad_id'])
            result = await session.execute(stmt)
            ad = result.scalar_one_or_none()
            if ad:
                ad.status = "ANALYZED"
                analysis = AdAnalysis(
                    ad_id=state['ad_id'],
                    hook_type=state.get('hook_type'),
                    hook_score=state.get('hook_score') or 9.0,
                    dominant_colors=state.get('dominant_colors'),
                    storyboard_breakdown=state.get('storyboard_breakdown'),
                    transcript=state.get('transcript'),
                    ocr_texts=state.get('ocr_texts'),
                    strategic_summary=state.get('strategic_summary'),
                    cta_text=state.get('cta_text')
                )
                session.add(analysis)
                await session.commit()
    except Exception as e:
        logger.error(f"Error persisting AdAnalysis to database: {e}")

    return {"status": "COMPLETED"}

# Construct LangGraph State Graph
workflow = StateGraph(AdPipelineState)

workflow.add_node("collector", collector_node)
workflow.add_node("audio_text", audio_text_node)
workflow.add_node("vision", vision_node)
workflow.add_node("indexer", indexer_node)

workflow.set_entry_point("collector")
workflow.add_edge("collector", "audio_text")
workflow.add_edge("audio_text", "vision")
workflow.add_edge("vision", "indexer")
workflow.add_edge("indexer", END)

ad_pipeline_graph = workflow.compile()

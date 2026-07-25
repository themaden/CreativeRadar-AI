from typing import TypedDict, List, Dict, Any, Optional

class AdPipelineState(TypedDict):
    """
    Shared State across LangGraph Agents for Multimodal Ad Analysis.
    """
    ad_id: str
    video_url: str
    brand_name: str
    platform: str
    duration_seconds: float
    
    # Raw extracted features
    transcript: Optional[List[Dict[str, Any]]]
    ocr_texts: Optional[List[Dict[str, Any]]]
    
    # Multimodal Vision Analysis
    hook_type: Optional[str]
    hook_score: Optional[float]
    dominant_colors: Optional[List[Dict[str, Any]]]
    storyboard_breakdown: Optional[List[Dict[str, Any]]]
    strategic_summary: Optional[str]
    cta_text: Optional[str]
    
    # Vector store embeddings
    vector_embedding: Optional[List[float]]
    
    # Agent Status flags
    status: str
    errors: List[str]

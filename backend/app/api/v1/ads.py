from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.db.models.models import Ad, Brand, AdAnalysis
from app.schemas.ad import AdResponse, SemanticSearchQuery
from app.services.vector_store import vector_store_service

router = APIRouter(prefix="/ads", tags=["Ads"])

@router.get("", response_model=List[AdResponse])
async def list_ads(
    brand_name: Optional[str] = None,
    platform: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """
    List all collected competitor ads with brand details and AI analysis.
    """
    stmt = select(Ad).options(selectinload(Ad.brand), selectinload(Ad.analysis))
    
    if brand_name:
        stmt = stmt.join(Brand).filter(Brand.name.ilike(f"%{brand_name}%"))
    if platform:
        stmt = stmt.filter(Ad.platform == platform)
    if status:
        stmt = stmt.filter(Ad.status == status)

    stmt = stmt.order_by(Ad.created_at.desc()).offset(offset).limit(limit)
    result = await db.execute(stmt)
    ads = result.scalars().all()
    return ads

@router.get("/{ad_id}", response_model=AdResponse)
async def get_ad_detail(ad_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get detailed AI analysis, synchronized storyboard breakdown, transcript, and color palette for a specific ad.
    """
    stmt = select(Ad).options(selectinload(Ad.brand), selectinload(Ad.analysis)).filter(Ad.id == ad_id)
    result = await db.execute(stmt)
    ad = result.scalar_one_or_none()
    
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    return ad

@router.post("/semantic-search")
async def semantic_search_ads(payload: SemanticSearchQuery, db: AsyncSession = Depends(get_db)):
    """
    Perform hybrid vector search over competitor ads using natural language queries.
    """
    vector_results = await vector_store_service.hybrid_search(
        query=payload.query,
        brand_filter=payload.brand_filter,
        top_k=payload.top_k
    )
    
    # Return matched DB ad records
    ad_ids = [res["id"] for res in vector_results]
    if not ad_ids:
        # Fallback to returning recent ads for demonstration if empty vector DB
        stmt = select(Ad).options(selectinload(Ad.brand), selectinload(Ad.analysis)).limit(payload.top_k)
    else:
        stmt = select(Ad).options(selectinload(Ad.brand), selectinload(Ad.analysis)).filter(Ad.id.in_(ad_ids))
        
    result = await db.execute(stmt)
    ads = result.scalars().all()
    return {"query": payload.query, "results_count": len(ads), "ads": ads}

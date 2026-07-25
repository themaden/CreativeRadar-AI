from typing import List, Dict, Any
from pydantic import BaseModel

class HookTypeTrend(BaseModel):
    hook_type: str
    count: int
    share_percentage: float

class ColorPaletteTrend(BaseModel):
    hex: str
    name: str
    frequency: int

class BrandSpendShare(BaseModel):
    brand_name: str
    estimated_total_impressions: int
    market_share: float

class AnalyticsTrendsResponse(BaseModel):
    total_ads_analyzed: int
    top_hook_types: List[HookTypeTrend]
    dominant_color_palettes: List[ColorPaletteTrend]
    brand_market_share: List[BrandSpendShare]

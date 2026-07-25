import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Text, Float, BigInteger, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Brand(Base):
    __tablename__ = "brands"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    genre: Mapped[str] = mapped_column(String(50), nullable=False, default="Casual Puzzle")
    logo_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    ads: Mapped[List["Ad"]] = relationship("Ad", back_populates="brand", cascade="all, delete-orphan")

class Ad(Base):
    __tablename__ = "ads"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_id: Mapped[str] = mapped_column(String(36), ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    platform: Mapped[str] = mapped_column(String(50), nullable=False, default="Meta") # 'Meta', 'TikTok', 'YouTube'
    external_ad_id: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    video_url: Mapped[str] = mapped_column(Text, nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    duration_seconds: Mapped[float] = mapped_column(Float, default=15.0)
    first_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    estimated_impressions: Mapped[int] = mapped_column(BigInteger, default=0)
    status: Mapped[str] = mapped_column(String(30), default="ANALYZED") # PENDING, PROCESSING, ANALYZED, FAILED
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    brand: Mapped["Brand"] = relationship("Brand", back_populates="ads")
    analysis: Mapped[Optional["AdAnalysis"]] = relationship("AdAnalysis", back_populates="ad", uselist=False, cascade="all, delete-orphan")

class AdAnalysis(Base):
    __tablename__ = "ad_analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ad_id: Mapped[str] = mapped_column(String(36), ForeignKey("ads.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    hook_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    hook_score: Mapped[float] = mapped_column(Float, default=8.5)
    dominant_colors: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)
    storyboard_breakdown: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)
    transcript: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)
    ocr_texts: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)
    strategic_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cta_text: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    analyzed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    ad: Mapped["Ad"] = relationship("Ad", back_populates="analysis")

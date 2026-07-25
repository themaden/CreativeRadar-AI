import uuid
import logging
from datetime import datetime, timedelta
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.db.models.models import Brand, Ad, AdAnalysis

logger = logging.getLogger(__name__)

async def seed_initial_data():
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        existing_brands = await session.execute(select(Brand))
        if existing_brands.scalars().first():
            logger.info("Database already seeded with demo competitor ads.")
            return

        logger.info("Seeding initial competitor ad library database...")

        # 1. Brands
        dream_games = Brand(id=str(uuid.uuid4()), name="Royal Match", genre="Casual Puzzle", logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100")
        playrix = Brand(id=str(uuid.uuid4()), name="Gardenscapes", genre="Casual Puzzle", logo_url="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100")
        peak_games = Brand(id=str(uuid.uuid4()), name="Toon Blast", genre="Casual Puzzle", logo_url="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100")
        peak_factory = Brand(id=str(uuid.uuid4()), name="Match Factory", genre="Casual 3D Match", logo_url="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100")

        session.add_all([dream_games, playrix, peak_games, peak_factory])
        await session.commit()

        # Sample Ads
        sample_ads_data = [
            {
                "brand": dream_games,
                "platform": "Meta",
                "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "thumbnail": "https://images.unsplash.com/photo-1563089145-599997674d42?w=600",
                "duration": 15.0,
                "impressions": 14200000,
                "hook_type": "Failed Gameplay (Peril Rescue)",
                "hook_score": 9.6,
                "summary": "King Robert trapped over rising lava. Player pulls wrong pin first, causing humorous fail and urgency CTA.",
                "cta": "Download & Save King Robert FREE!",
                "colors": [
                    {"hex": "#FF9900", "hsl": "hsl(36, 100%, 50%)", "name": "Vibrant Amber", "weight": 0.45},
                    {"hex": "#1E3A8A", "hsl": "hsl(224, 64%, 33%)", "name": "Royal Navy Blue", "weight": 0.35},
                    {"hex": "#EF4444", "hsl": "hsl(0, 84%, 60%)", "name": "Lava Red", "weight": 0.20}
                ],
                "storyboard": [
                    {"timestamp": "00:00 - 00:03", "phase": "Hook (0-3s)", "description": "King Robert is trapped over bubbling lava with pin mechanism.", "colors": ["#FF9900", "#1E3A8A"], "pacing_note": "Immediate high visual threat visual."},
                    {"timestamp": "00:03 - 00:11", "phase": "Gameplay (3-11s)", "description": "Hand cursor selects pin #2 instead of #1, lava floods bottom tier.", "colors": ["#EF4444"], "pacing_note": "Intentionally flawed puzzle solve."},
                    {"timestamp": "00:11 - 00:15", "phase": "CTA (11-15s)", "description": "Pulsing gold Play Store & App Store download badges.", "colors": ["#FF9900"], "pacing_note": "Instant conversion prompt."}
                ],
                "transcript": [
                    {"start": 0.0, "end": 2.5, "text": "Save King Robert from the fiery pit!"},
                    {"start": 3.0, "end": 8.0, "text": "Can you solve this puzzle faster than 99% of players?"},
                    {"start": 11.5, "end": 15.0, "text": "Play Royal Match for free right now!"}
                ],
                "ocr": [
                    {"timestamp": 0.5, "text": "SAVE THE KING!"},
                    {"timestamp": 3.0, "text": "ONLY 1% CAN SOLVE THIS"},
                    {"timestamp": 7.0, "text": "FAILED!"}
                ]
            },
            {
                "brand": playrix,
                "platform": "TikTok",
                "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "thumbnail": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
                "duration": 18.0,
                "impressions": 9800000,
                "hook_type": "Emotional Makeover / Dilemma",
                "hook_score": 8.9,
                "summary": "Austin the Butler arrives at a freezing ruined mansion. Player tries to fix fireplace with cheap wood.",
                "cta": "Fix Austin's Garden Today!",
                "colors": [
                    {"hex": "#3B82F6", "hsl": "hsl(217, 91%, 60%)", "name": "Freezing Cyan Blue", "weight": 0.40},
                    {"hex": "#F59E0B", "hsl": "hsl(38, 92%, 50%)", "name": "Fire Gold", "weight": 0.35},
                    {"hex": "#10B981", "hsl": "hsl(160, 84%, 39%)", "name": "Garden Leaf Emerald", "weight": 0.25}
                ],
                "storyboard": [
                    {"timestamp": "00:00 - 00:04", "phase": "Hook (0-4s)", "description": "Snowstorm outside broken window, shivering butler character.", "colors": ["#3B82F6"], "pacing_note": "Emotional sympathy trigger."},
                    {"timestamp": "00:04 - 00:13", "phase": "Gameplay (4-13s)", "description": "Hammer tool breaks wall further, freezing wind blows inside.", "colors": ["#F59E0B"], "pacing_note": "Comedy of errors mechanic."},
                    {"timestamp": "00:13 - 00:18", "phase": "CTA (13-18s)", "description": "Mansion instantly transformed to golden palace with download button.", "colors": ["#10B981"], "pacing_note": "Satisfying contrast resolution."}
                ],
                "transcript": [
                    {"start": 0.0, "end": 3.5, "text": "Brrr! Help Austin repair the estate before nightfall!"},
                    {"start": 4.0, "end": 10.0, "text": "Choose the right tools to restore the grand fireplace!"}
                ],
                "ocr": [
                    {"timestamp": 1.0, "text": "FREEZING COLD!"},
                    {"timestamp": 5.0, "text": "CHOOSE TOOL"}
                ]
            },
            {
                "brand": peak_games,
                "platform": "Meta",
                "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                "thumbnail": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600",
                "duration": 12.0,
                "impressions": 11500000,
                "hook_type": "Fake AD vs Real Gameplay",
                "hook_score": 9.1,
                "summary": "Fast-paced cube blasting combos creating huge disco ball explosions with vibrant primary color palette.",
                "cta": "Blast Cubes Now!",
                "colors": [
                    {"hex": "#EC4899", "hsl": "hsl(330, 81%, 60%)", "name": "Magenta Spark", "weight": 0.40},
                    {"hex": "#8B5CF6", "hsl": "hsl(262, 83%, 58%)", "name": "Neon Violet", "weight": 0.35},
                    {"hex": "#F59E0B", "hsl": "hsl(38, 92%, 50%)", "name": "Explosive Yellow", "weight": 0.25}
                ],
                "storyboard": [
                    {"timestamp": "00:00 - 00:03", "phase": "Hook (0-3s)", "description": "Giant 10x10 cube board matching 7 pink cubes at once.", "colors": ["#EC4899"], "pacing_note": "Instant dopamine blast sound."},
                    {"timestamp": "00:03 - 00:09", "phase": "Gameplay (3-9s)", "description": "Rocket combo clears 3 rows simultaneously.", "colors": ["#8B5CF6"], "pacing_note": "Cascading particle animation."},
                    {"timestamp": "00:09 - 00:12", "phase": "CTA (9-12s)", "description": "Toon Blast logo popping up with ⭐⭐⭐⭐⭐ rating badge.", "colors": ["#F59E0B"], "pacing_note": "Social proof endorsement."}
                ],
                "transcript": [
                    {"start": 0.0, "end": 2.5, "text": "Match pink blocks to trigger ultimate rocket combo!"},
                    {"start": 3.0, "end": 7.0, "text": "Can you beat level 5000 in Toon Blast?"}
                ],
                "ocr": [
                    {"timestamp": 0.5, "text": "DISCO COMBO!"},
                    {"timestamp": 4.0, "text": "STAGE CLEARED"}
                ]
            }
        ]

        for ad_info in sample_ads_data:
            ad_id = str(uuid.uuid4())
            new_ad = Ad(
                id=ad_id,
                brand_id=ad_info["brand"].id,
                platform=ad_info["platform"],
                video_url=ad_info["video_url"],
                thumbnail_url=ad_info["thumbnail"],
                duration_seconds=ad_info["duration"],
                estimated_impressions=ad_info["impressions"],
                first_seen=datetime.utcnow() - timedelta(days=5),
                last_seen=datetime.utcnow(),
                status="ANALYZED"
            )
            session.add(new_ad)
            await session.commit()

            new_analysis = AdAnalysis(
                id=str(uuid.uuid4()),
                ad_id=ad_id,
                hook_type=ad_info["hook_type"],
                hook_score=ad_info["hook_score"],
                dominant_colors=ad_info["colors"],
                storyboard_breakdown=ad_info["storyboard"],
                transcript=ad_info["transcript"],
                ocr_texts=ad_info["ocr"],
                strategic_summary=ad_info["summary"],
                cta_text=ad_info["cta"]
            )
            session.add(new_analysis)

        await session.commit()
        logger.info("Successfully seeded competitor ad database!")

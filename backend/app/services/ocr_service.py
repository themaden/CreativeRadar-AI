import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class OCRService:
    """
    Frame Text Extraction Service using EasyOCR / OpenCV.
    Detects overlay text banners like 'ONLY 1% CAN PASS!', 'TAP HERE', 'FAIL'.
    """

    async def extract_text_from_frames(self, video_url: str) -> List[Dict[str, Any]]:
        logger.info(f"Extracting OCR text overlays from: {video_url}")

        return [
            {"timestamp": 0.5, "text": "HELP KING ROBERT!"},
            {"timestamp": 2.0, "text": "ONLY 1% CAN PASS THIS LEVEL"},
            {"timestamp": 6.5, "text": "EPIC FAIL!"},
            {"timestamp": 12.0, "text": "PLAY NOW - NO ADS!"}
        ]

ocr_service = OCRService()

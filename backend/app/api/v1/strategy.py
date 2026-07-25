from fastapi import APIRouter
from app.schemas.strategy import StrategyCopilotRequest, StrategyCopilotResponse
from app.agents.rag_strategy.rag_agent import rag_strategy_agent

router = APIRouter(prefix="/strategy", tags=["AI Strategy RAG Copilot"])

@router.post("/copilot", response_model=StrategyCopilotResponse)
async def strategy_copilot(payload: StrategyCopilotRequest):
    """
    RAG-powered AI Strategy Copilot endpoint for generating competitor insights and creative briefs.
    """
    response = await rag_strategy_agent.generate_strategy_report(
        query=payload.prompt,
        target_brand=payload.target_brand or "Royal Match"
    )
    return response

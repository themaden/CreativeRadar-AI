from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Async Engine (SQLite fallback if postgresql unavailable during standalone local dev/test)
db_url = settings.async_database_url
if "sqlite" in db_url:
    engine = create_async_engine(db_url, echo=settings.DEBUG)
else:
    engine = create_async_engine(db_url, echo=settings.DEBUG, pool_pre_ping=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

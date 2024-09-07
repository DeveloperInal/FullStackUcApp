from sqlalchemy import Integer, BigInteger, Float, String, TIMESTAMP, Column
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from core.config import settings

engine = create_async_engine(url=settings.url_database, echo=False)
async_session = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)

class User(Base):
    __tablename__ = "users"

    username = Column(String(100), unique=True, nullable=False)
    tg_id = Column(BigInteger, unique=True, nullable=False)
    balance = Column(Float, default=0.0)
    count_boxes = Column(Integer, default=1)

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
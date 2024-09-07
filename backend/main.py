from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.database.model import create_tables
from user.user import router as user_auth
import uvicorn
from loguru import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Server")
    await create_tables()
    yield
    logger.info("Ending Server and Ngrok tunnel")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_auth)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
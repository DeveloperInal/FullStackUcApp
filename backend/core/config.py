from os import getenv
from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    url_database: str = Field(getenv('URL_DATABASE'))

    class Config:
        extra = 'forbid'
        env_file = '.env'

settings = Settings()

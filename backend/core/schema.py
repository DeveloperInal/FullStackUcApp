from pydantic import BaseModel

class UserData(BaseModel):
    id: int
    username: str
    tg_id: int
    balance: float
    count_boxes: int = 1


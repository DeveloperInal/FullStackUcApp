from fastapi import APIRouter
from core.schema import UserData
from core.database.requests import UserRep

router = APIRouter(tags=["Users"])


@router.post("/set_user")
async def set_user(user_data: UserData):
    existing_user = await UserRep.get_user_by_id(user_data.id)
    if existing_user:
        return {"message": "Пользователь уже существует"}
    await UserRep.set_user(user_data)
    return {"message": "Пользователь успешно добавлен"}

@router.get("/get_user/{id}")
async def get_user(id: int):
    user = await UserRep.get_user_by_id(id)
    if user:
        return user
    else:
        return {"message": "Пользователь не найден"}

@router.get("/get_user_tg/{tg_id}")
async def get_user_tg(tg_id: int):
    user_tg = await UserRep.get_user_by_tg_id(tg_id)
    if user_tg:
        return user_tg
    else:
        return {"message": "Пользователь не найден"}

@router.put("/update_user/{id}/")
async def update_user(user_data: UserData):
    user = await UserRep.update_user(id=user_data.id, balance=user_data.balance, count_boxes=user_data.count_boxes)
    return user
    return {"message": "Пользователь успешно изменен"}
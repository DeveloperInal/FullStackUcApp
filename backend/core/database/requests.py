from sqlalchemy import select, update
from core.database.model import User, async_session
from core.schema import UserData


class UserRep:
    @classmethod
    async def set_user(cls, user: UserData):
        async with async_session() as session:
            async with session.begin():
                new_user = User(
                    username=user.username,
                    tg_id=user.tg_id,
                    balance=user.balance,
                    count_boxes=user.count_boxes,
                )
                session.add(new_user)
            await session.commit()
        return new_user

    @classmethod
    async def get_user_by_id(cls, id: int):
        async with async_session() as session:
            stmt = select(User).where(User.id == id)
            result = await session.execute(stmt)
            user = result.scalar_one_or_none()
            return user

    @classmethod
    async def get_user_by_tg_id(cls, tg_id: int):
        async with async_session() as session:
            stmt = select(User).where(User.tg_id == tg_id)
            result = await session.execute(stmt)
            user = result.scalar_one_or_none()
            return user

    @classmethod
    async def update_user(cls, id: int, balance: float, count_boxes: int):
        async with async_session() as session:
            async with session.begin():
                stmt = (
                    update(User)
                    .where(User.id == id)
                    .values(balance=balance, count_boxes=count_boxes)
                )
                await session.execute(stmt)
            await session.commit()



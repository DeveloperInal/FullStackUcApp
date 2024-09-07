// StartMenu.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getUserData, updateBalanceData } from "../store/MenuSlice";
import { useParams } from "react-router-dom";
import boxImage from "../assets/box.svg";
import ucImage from "../assets/uc.svg";
import axios from "axios";

export default function StartMenu() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.menu.list[0]);
    const [activeBoxIndex, setActiveBoxIndex] = useState<number | null>(null);
    const [randomNumber, setRandomNumber] = useState<number | null>(null);
    const [nextBoxTime, setNextBoxTime] = useState<number>(60000);
    const [intervalId, setIntervalId] = useState<number | null>(null);

    const { tg_id } = useParams<{ tg_id: string }>();

    useEffect(() => {
        if (tg_id) {
            dispatch(getUserData({ id: tg_id }));
        } else {
            console.error("Invalid tg_id", tg_id);
        }
    }, [dispatch, tg_id]);

    useEffect(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }

        if (user?.count_boxes <= 0) {
            const id = window.setInterval(() => {
                setNextBoxTime(prevTime => {
                    if (prevTime <= 0) {
                        updateBoxCount();
                        return 60000;
                    }
                    return prevTime - 1000;
                });
            }, 1000);
            setIntervalId(id);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [user?.count_boxes]);

    const updateBoxCount = async () => {
        if (user) {
            try {
                const newCountBoxes = user.count_boxes + 1;

                const requestData = {
                    id: user.id,
                    username: user.username,
                    tg_id: user.tg_id,
                    balance: user.balance,
                    count_boxes: newCountBoxes
                };

                if (user.id) {
                    const response = await axios.put(
                        `http://localhost:8000/update_user/${user.id}`,
                        requestData,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    if (response.status === 200) {
                        dispatch(getUserData({ id: `${tg_id}` }));
                    } else {
                        console.error("Failed to update user data", response.statusText);
                    }
                } else {
                    console.error("User ID is missing");
                }
            } catch (error: any) {
                console.error("Ошибка обновления количества ящиков", error.response?.data || error.message);
            }
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const handleBoxClick = async (index: number) => {
        if (user && user.count_boxes > 0) {
            setActiveBoxIndex(index);

            const rewardOptions = [10, 30, 50, 70, 100];
            const randomAmount = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];

            setRandomNumber(randomAmount);

            if (user.id) {
                try {
                    const response = await dispatch(updateBalanceData({ id: user.id, randomAmount })).unwrap();
                    console.log("Balance updated successfully", response);
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Ошибка обновления баланса", error.message);
                    } else {
                        console.error("Ошибка обновления баланса", error);
                    }
                }
            } else {
                console.error("User ID is missing");
            }
        }
    };

    return (
        <div className="bg-black h-screen flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-4 left-4 text-white">
                {user && (
                    <div className="text-left">
                        <p className="font-bold">Баланс: {user.balance}</p>
                        <p>Username: {user.username}</p>
                    </div>
                )}
            </div>

            <div
                className={`text-white mb-4 transition-opacity duration-500 ${
                    activeBoxIndex !== null ? "opacity-0" : "opacity-100"
                }`}
            >
                <h2 className='font-bold text-white text-2xl'>
                    {user && user.count_boxes > 0 ? 'Выберите один из ящиков' : 'Нету ящиков'}
                </h2>
            </div>
            {user?.count_boxes > 0 ? (
                    <div
                        className={`grid grid-cols-3 gap-4 transition-opacity duration-500 ${
                            activeBoxIndex !== null ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        {[0, 1, 2].map((index) => (
                            <div key={index}
                                 className={`cursor-pointer relative ${
                                     activeBoxIndex !== null && activeBoxIndex !== index
                                         ? "hidden"
                                         : ""
                                 }`}
                                 onClick={() => handleBoxClick(index)}>
                                <img
                                    src={boxImage}
                                    alt={`Box ${index + 1}`}
                                    className="w-32 h-32"
                                />
                            </div>
                        ))}
                    </div>
                )
                :
                (
                    <p className="text-white text-xl">
                        Нету ящиков, следующий ящик будет через {formatTime(nextBoxTime)}
                    </p>
                )}
            {activeBoxIndex !== null && (
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500">
                    <img
                        src={ucImage}
                        alt={`Box ${activeBoxIndex + 1}`}
                        className="w-80 h-80 scale-110"
                    />
                    {randomNumber !== null && (
                        <p className="absolute top-[-20%] left-1/2 transform -translate-x-1/2 text-white font-bold text-xl">
                            Вы выбили {randomNumber}! Посмотрите ваш баланс
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

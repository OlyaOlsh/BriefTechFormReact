
import React, { useEffect, useState } from 'react';
import { db } from './../../../src/firebase.js';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import './IdeaList.css'; // Импортируйте стили


const IdeaList = () => {
    const tg = window.Telegram?.WebApp;

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Получаем userId из Telegram Web App или генерируем случайный userId
        if (tg && tg.initDataUnsafe) {
            setUserId(tg.initDataUnsafe.user.id);
        } else {
            // Генерируем случайный userId
            setUserId(generateRandomId());
        }

        const fetchIdeas = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'IdeaTable'));
                const ideasData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setIdeas(ideasData);
            } catch (error) {
                console.error('Ошибка при загрузке идей:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();
    }, [tg]);

    const generateRandomId = () => {
        return 'user_' + Math.random().toString(36).substr(2, 9); // Генерация случайного ID
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    const handleShare = () => {
        const shareUrl = window.location.href; // Получаем текущую ссылку
        const shareImage = 'https://brief-tech-form-react.vercel.app/images/imgforLink.png';

        if (navigator.share) { // Проверяем поддержку API Share
            navigator.share({
                url: shareUrl,
                title: 'Поделитесь этой идеей!',
              
            })
            .then(() => console.log('Успешно поделились!'))
            .catch((error) => console.error('Ошибка при попытке поделиться:', error));
        } else {
            alert('К сожалению, функция "Поделиться" не поддерживается в этом браузере.');
        }
    };

    const handleRating = async (ideaId, rating) => {
        if (!userId) {
            alert('Не удалось получить идентификатор пользователя.');
            return;
        }

        try {
            const ideaRef = doc(db, 'IdeaTable', ideaId);
            const ideaDoc = await getDoc(ideaRef);
            const ideaData = ideaDoc.data();

            // Проверяем, проголосовал ли пользователь ранее
            if (ideaData.voters && ideaData.voters.includes(userId)) {
                alert('Вы уже проголосовали за эту идею.');
                return;
            }

            // Обновление рейтинга и количества голосов в Firestore
            await updateDoc(ideaRef, {
                rating,
                votes: (ideaData.votes || 0) + 1,
                voters: ideaData.voters ? [...ideaData.voters, userId] : [userId] // Добавляем ID пользователя в массив
            });

            // Обновление состояния ideas
            setIdeas(prevIdeas =>
                prevIdeas.map(idea =>
                    idea.id === ideaId ? { ...idea, rating, votes: (ideaData.votes || 0) + 1, voters: ideaData.voters ? [...ideaData.voters, userId] : [userId] } : idea
                )
            );
        } catch (error) {
            console.error('Ошибка при обновлении рейтинга:', error);
        }
    };

    return (
        <div>
            <div className="idea-list">
                {ideas.length === 0 ? (
                    <p>Нет идей для отображения.</p>
                ) : (
                    ideas.map(idea => (
                        <div key={idea.id} className="idea-card">
                            <h3>Проект: {idea.projectName}</h3>
                            <p><strong>Автор:</strong> {idea.fullname}</p>
                            <p><strong>Цели:</strong> {idea.goals}</p>
                            <p><strong>Для кого:</strong> {idea.audience}</p>
                            <div className="rating">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        className={`star ${index < Math.round(idea.rating || 0) ? 'active' : ''}`}
                                        onClick={() => handleRating(idea.id, index + 1)}
                                    >
                                        &#9733; {/* Звездочка */}
                                    </span>
                                ))}
                                <span className="vote-count">({idea.votes || 0})</span> {/* Отображение количества голосов */}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Иконка поделиться */}
            <button onClick={handleShare} className="share-button">
                Поделиться
            </button>
        </div>
    );
};

export default IdeaList;
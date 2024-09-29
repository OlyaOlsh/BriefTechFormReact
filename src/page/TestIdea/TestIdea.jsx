import React, { useEffect, useState } from 'react';
import { db } from './../../../src/firebase.js';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import './../../../src/reset.css';
import './TestIdea.css'; // Импортируйте стили

const TestIdea = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const tg = window.Telegram?.WebApp;

    useEffect(() => {
        if (tg) {
            tg.ready();
            tg.expand(); // Разворачиваем приложение на весь экран
        }

        // Получаем userId из Telegram Web App или генерируем случайный userId
        if (tg) {
            if (tg.initDataUnsafe) {
                setUserId(tg.initDataUnsafe?.user?.id);
            } else {
                setUserId(generateRandomId());
            }
        } else {
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

    const handleShare = () => {
        const shareUrl = window.location.href; // Получаем текущую ссылку
        const shareText = 'Посмотрите эту замечательную идею!'; // Текст сообщения
        if (navigator.share) { 
            navigator.share({
                url: shareUrl,
                title: 'Поделитесь этой идеей!',
                text: shareText,
            })
            .then(() => console.log('Успешно поделились!'))
            .catch((error) => console.error('Ошибка при попытке поделиться:', error));
        } else {
            // Формируем URL для обмена в Telegram
            const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

            // Открываем ссылку в новой вкладке
            window.open(telegramShareUrl, '_blank');
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

    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Получаем имя пользователя из Telegram или устанавливаем общее приветствие
    const userName = tg?.initDataUnsafe?.user?.userName || "Гость";

    return (
        <div className="text-center w-full h-screen bg-gradient-to-r from-[#409BFF] to-[#0a1a5c] rounded-lg shadow-lg overflow-hidden">
            <div className="hi_userName text-white text-2xl mb-4">
                Добро пожаловать, {userName}!
            </div>
            
            <div className="card-list" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 80px)', padding: '0 16px' }}>
                {ideas.length === 0 ? (
                    <p className="text-white">Нет идей для отображения.</p>
                ) : (
                    ideas.map(idea => (
                        <div 
                            key={idea.id} 
                            className="card w-full p-4 rounded-lg shadow-md mb-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-md border border-gray-300"
                        >
                            <h3>{idea.projectName}</h3>
                            <p><strong>Автор:</strong> {idea.fullname}</p>
                            <p><strong>Цели:</strong> {idea.goals}</p>
                            <p><strong>Для кого:</strong> {idea.audience}</p>
                            <div className="rating flex justify-center items-center">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        className={`star ${index < Math.round(idea.rating || 0) ? 'active' : ''}`}
                                        onClick={() => handleRating(idea.id, index + 1)}
                                    >
                                        &#9733; 
                                    </span>
                                ))}
                                <span className="vote-count text-white">({idea.votes || 0})</span> 
                            </div>
                        </div>
                    ))
                )}
                
               {/* <button onClick={handleShare} className="fixed-button">Поделиться в Telegram</button>*/}
                <button className="fixed-button" onClick={() => tg.close()}>
                Закрыть
                </button>
            </div>
        </div>
    );
};

export default TestIdea;
import React, { useEffect, useState } from 'react';
import { db } from './../../../src/firebase.js';
import { collection, getDocs, doc, updateDoc,getDoc } from 'firebase/firestore';
import './../../../src/reset.css';
import './TestIdea.css'; // Импортируйте стили


const TestIdea = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [userNameСur, setUserName] = useState("Гость");
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для поискового запроса
    const tg = window.Telegram?.WebApp;

    useEffect(() => {
        if (tg) {
            tg.ready();
            tg.expand();
        }

        // Запрет прокрутки страницы
        document.body.style.overflow = 'hidden';

        if (tg) {
            if (tg.initDataUnsafe) {
                setUserId(tg.initDataUnsafe?.user?.id);
                setUserName(tg.initDataUnsafe?.user?.first_name || tg.initDataUnsafe?.user?.username || "Гость");
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

        // Восстановление прокрутки при размонтировании компонента
        return () => {
            document.body.style.overflow = 'auto';
        };

    }, [tg]);

    const generateRandomId = () => {
        return 'user_' + Math.random().toString(36).substr(2, 9);
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
                rating: (ideaData.rating || 0) + rating,
                votes: (ideaData.votes || 0) + 1,
                voters: ideaData.voters ? [...ideaData.voters, userId] : [userId] // Добавляем ID пользователя в массив
            });

            // Обновление состояния ideas
            setIdeas(prevIdeas =>
                prevIdeas.map(idea =>
                    idea.id === ideaId ? { ...idea, rating: (ideaData.rating || 0) + rating, votes: (ideaData.votes || 0) + 1, voters: [...(ideaData.voters || []), userId] } : idea
                )
               
            );
             // Уведомление о голосовании
             alert(`Вы проголосовали за идею "${ideaData.projectName}"!`);
        } catch (error) {
            console.error('Ошибка при обновлении рейтинга:', error);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Фильтрация идей по поисковому запросу
    const filteredIdeas = ideas.filter(idea =>
        idea.projectName && idea.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="text-center w-full h-screen bg-gradient-to-r from-[#409BFF] to-[#0a1a5c] rounded-lg shadow-lg overflow-hidden">
            <div className="container">
                <div className="hi_userName">
                    Добро пожаловать, {userNameСur}!
                </div>
            </div>
            {/* Поле для поиска */}
            <input
                type="text"
                placeholder="Поиск по названию проекта"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input mb-4" // Класс для стилей
            />

            <div className="card-list" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 90px)', padding: '0 16px' }}>
                {filteredIdeas.length === 0 ? (
                    <p className="text-white">Нет идей для отображения.</p>
                ) : (
                    filteredIdeas.map(idea => (
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
                                <span className="vote-count #0a1a5c">({idea.votes || 0})</span> 
                            </div>
                        </div>
                    ))
                )}
                 <div style={{ height: '200px' }}></div>
                <button className="fixed-button" onClick={() => tg.close()}>
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default TestIdea;
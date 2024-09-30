import React, { useEffect, useState } from 'react';
import { db } from './../../../src/firebase.js';
import { collection, getDocs, doc, updateDoc,getDoc } from 'firebase/firestore';
import './../../../src/reset.css';
import './TestIdea.css'; // Импортируйте стили

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const TestIdea = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [userNameСur, setUserName] = useState("Гость");
    const [searchQuery, setSearchQuery] = useState('');
    const tg = window.Telegram?.WebApp;

    useEffect(() => {
        if (tg) {
            tg.ready();
            tg.expand();
        }

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

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [tg]);

    const generateRandomId = () => {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    };

    const handleRating = async (ideaId) => {
        if (!userId) {
            alert('Не удалось получить идентификатор пользователя.');
            return;
        }

        try {
            const ideaRef = doc(db, 'IdeaTable', ideaId);
            const ideaDoc = await getDoc(ideaRef);
            const ideaData = ideaDoc.data();

            if (ideaData.voters && ideaData.voters.includes(userId)) {
                alert('Вы уже проголосовали за эту идею.');
                return;
            }

            await updateDoc(ideaRef, {
                votes: (ideaData.votes || 0) + 1,
                voters: ideaData.voters ? [...ideaData.voters, userId] : [userId]
            });

            setIdeas(prevIdeas =>
                prevIdeas.map(idea =>
                    idea.id === ideaId ? { ...idea, votes: (ideaData.votes || 0) + 1, voters: [...(ideaData.voters || []), userId] } : idea
                )
            );

            alert(`Вы проголосовали за идею "${ideaData.projectName}"!`);
        } catch (error) {
            console.error('Ошибка при обновлении рейтинга:', error);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

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
            
            <input
                type="text"
                placeholder="Поиск по названию проекта"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input mb-4"
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
                                <FontAwesomeIcon 
                                    icon={faThumbsUp} 
                                    onClick={() => handleRating(idea.id)} 
                                    style={{ cursor: 'pointer', color: 'yellow', marginRight: '8px' }} 
                                />
                                <span className="vote-count" style={{ color: '#0a1a5c' }}>{idea.votes || 0}</span> 
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
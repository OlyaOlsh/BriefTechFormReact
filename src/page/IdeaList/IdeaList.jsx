import React, { useEffect, useState } from 'react';
import { db } from './../../../src/firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import './IdeaList.css'; // Импортируйте стили

const IdeaList = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, []);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
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
                    </div>
                ))
            )}
        </div>
    );
};

export default IdeaList;
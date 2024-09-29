import React, { useEffect} from 'react';
import './TestIdea.css'; // Импортируйте стили
import './../../../src/reset.css';

const TestIdea = () => {

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand(); // Разворачиваем приложение на весь экран
        }
    }, []);

    const ideas = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        projectName: `Проект ${index + 1}`,
        fullname: `Автор ${index + 1}`,
        goals: `Цели ${index + 1}`,
        audience: `Для кого ${index + 1}`,
    }));

    return (
        <div className="page-container">
            <div className="card-list">
                {ideas.map(idea => (
                    <div key={idea.id} className="card">
                        <h3>{idea.projectName}</h3>
                        <p><strong>Автор:</strong> {idea.fullname}</p>
                        <p><strong>Цели:</strong> {idea.goals}</p>
                        <p><strong>Для кого:</strong> {idea.audience}</p>
                    </div>
                ))}
            </div>
            <button className="fixed-button">Поделиться в Telegram</button>
        </div>
    );
};

export default TestIdea;
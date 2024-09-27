import React, { useEffect } from 'react';
import './Home.css';
import imageUrl from './../../img/imgforLinkIdeas.png';

const Home = () => {

    useEffect(() => {
        const preventScroll = (e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение прокрутки
        };

        // Добавляем обработчик событий
        window.addEventListener('touchmove', preventScroll, { passive: false });

        // Удаляем обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('touchmove', preventScroll);
        };
    }, []);
    return (
        <div className="fullscreen-container_idea">
            <div className="image-container_idea">
                <img src={imageUrl} alt="Идея" className="image_idea" />
            </div>
            <div className="home-container">
                <h1>Ваши идеи — это ключ к преобразованиям!</h1>
                <p>Бриф о разработке нового функционала для MS Dynamics AX.</p>
                <p>Не стесняйтесь делиться своими предложениями и мыслями — каждая идея для нас бесценна!</p>
                <p>Ваше активное участие поможет нам создавать решения, которые повысят продуктивность и эффективность работы в MS Dynamics AX.</p>
            </div>
            <a href="/briefform" className="brief-button_idea">Составить Бриф</a> {/* Кнопка здесь */}
        </div>
    );
};

export default Home;
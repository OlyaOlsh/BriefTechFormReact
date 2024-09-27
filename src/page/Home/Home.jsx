import React, { useEffect } from 'react';
import './Home.css';
import imageUrl from './../../img/imgforLinkIdeas.jpg';

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

   {/* useEffect(() => {
        // Прокручиваем страницу вверх при открытии компонента
        window.scrollTo({ top: 200, behavior: 'smooth' });
    }, []); // Пустой массив зависимостей означает, что этот эффект выполнится только один раз при монтировании */}
    return (
        <div className="fullscreen-container">
        <div className="image-container">
            <img src={imageUrl} alt="Идея" className="image" />
        </div>
        <div className="home-container">
            <h1>Ваши идеи — это ключ к преобразованиям!</h1>
            <p>Бриф о разработке нового функционала для MS Dynamics AX.</p>
            <p>Не стесняйтесь делиться своими предложениями и мыслями — каждая идея для нас бесценна!</p>
            <p>Ваше активное участие поможет нам создавать решения, которые повысят продуктивность и эффективность работы в MS Dynamics AX.</p>
            <a href="/briefform" className="brief-button">Составить Бриф</a>
        </div>
    </div>
    );
};

export default Home;

import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Идеи могут изменить всё!</h1>
            <p>Бриф посвященный созданию нового функционала в MS Dynamics AX</p>
            <p>Поделитесь своими предложениями и идеями — каждая идея для нас ценна!</p>
            <p>Ваше участие поможет нам создавать решения, которые сделают работу в MS Dynamics AX еще более продуктивной и эффективной</p>
            <a href="/briefform" className="brief-button">Составить Бриф</a>
        </div>
    );
};

export default Home;
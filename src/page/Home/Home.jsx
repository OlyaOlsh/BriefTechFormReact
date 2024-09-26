
import React from 'react';
import './Home.css';


const Home = () => {
    return (
        <div className="home-container">
        <h1>Ваши идеи — это ключ к преобразованиям!</h1>
        <p>Бриф о разработке нового функционала для MS Dynamics AX.</p>
        <p>Не стесняйтесь делиться своими предложениями и мыслями — каждая идея для нас бесценна!</p>
        <p>Ваше активное участие поможет нам создавать решения, которые повысят продуктивность и эффективность работы в MS Dynamics AX.</p>
            <a href="/briefform" className="brief-button">Составить Бриф</a>
        </div>
    );
};

export default Home;
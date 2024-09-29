
import React, { useEffect, useState } from 'react';
import './../../../src/reset.css';
import './HomeBrief.css';
import { Link } from 'react-router-dom';

const buttonClasses = 'bg-gradient-to-r from-[#78C946] to-[#5A9A3A] text-white py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl font-MarvelSans-Regular';

const Test = () => {
    const [userNameСur, setUserName] = useState("Гость");

    const tg = window.Telegram?.WebApp;

    useEffect(() => {
        const preventScroll = (e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение прокрутки
        };

        // Проверяем, открыта ли страница через Telegram
        if (tg) {
            tg.ready(); // Подготовка Telegram Web App
            tg.expand(); // Разворачиваем страницу на весь экран
        }

        if (tg) {
          if (tg.initDataUnsafe) {

              setUserName(tg.initDataUnsafe?.user?.first_name || tg.initDataUnsafe?.user?.username || "Гость"); // Используем username

          } 
        } 
        

        // Добавляем обработчик событий
       // window.addEventListener('touchmove', preventScroll, { passive: false });

        // Прокручиваем страницу вверх при открытии компонента
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Удаляем обработчик при размонтировании компонента
        return () => {
          //  window.removeEventListener('touchmove', preventScroll);
        };
    }, [tg]);

  return (
  <div className= "flex justify-center items-center h-screen absolute inset-0 bg-gradient-to-r from-[#409BFF] to-[#0a1a5c] opacity-80 rounded-lg p-6">

      <div className="text-center">
        <p className="text-3xl font-bold text-white mb-4 font-MarvelSans-Regular"style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Ваши идеи — это ключ к преобразованиям!</p>
        <p className="text-lg text-white mb-8" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Каждая идея для нас бесценна!</p>

        {/* Используем Link для навигации */}
        <Link to= "/briefformnew">
          <button className={buttonClasses}  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Создать Бриф
          </button>

        </Link>
        <p className="text-sm text-white mt-4"style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Бриф о разработке нового функционала</p>
        <p className="text-sm text-white mt-4" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>MS Dynamics AX</p>
      </div>
    </div>
  );
};

export default Test;
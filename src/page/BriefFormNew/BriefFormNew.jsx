import React, { useState, useRef, useEffect } from 'react';
import './../../../src/reset.css';
import './BriefFormNew.css';

const inputClasses = "w-full px-3 py-2 placeholder-input text-input bg-blue-100 rounded-lg mb-4 font-MarvelSans-Regular";
const buttonClasses = 'bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl font-MarvelSans-Regular';
const BriefFormNew = () => {
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

        // Добавляем обработчик событий
        window.addEventListener('touchmove', preventScroll, { passive: false });

        // Прокручиваем страницу вверх при открытии компонента
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Удаляем обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('touchmove', preventScroll);
        };
    }, [tg]);












    return (
        <div className="bg-background text-primary-foreground p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Название проекта</h2>
            <input type="text" placeholder="Укажите краткое название" className={inputClasses} />
            <h2 className="text-lg font-bold mb-4">Цели и задачи</h2>
            <textarea placeholder="Опишите основные цели и задачи" className={inputClasses}></textarea>
            <h2 className="text-lg font-bold mb-4">Целевая аудитория</h2>
            <input type="text" placeholder="Определите основных пользователей" className={inputClasses} />
            <h2 className="text-lg font-bold mb-4">Автор идеи</h2>
            <input type="text" placeholder="Укажите полное имя автора" className={inputClasses} />
            <button className={buttonClasses}>Отправить</button>
        </div>
    );
};

export default BriefFormNew;

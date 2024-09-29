
import React, { useState, useRef, useEffect } from 'react';
import { db } from './../../../src/firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import './../../../src/reset.css';
import './BriefFormNew.css';

const inputClasses = "w-full px-3 py-2 placeholder-input text-input bg-blue-100 rounded-lg mb-4 font-MarvelSans-Regular";
const buttonClasses = 'bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl font-MarvelSans-Regular active:scale-95 active:shadow-inner'; // Добавлен эффект нажатия

const BriefFormNew = () => {
    const tg = window.Telegram?.WebApp;
    const [formData, setFormData] = useState({
        projectName: '',
        goals: '',
        audience: '',
        fullname: '',
    });
    
    const [errors, setErrors] = useState({});
    const textareaAudienceRef = useRef(null);
    const textareaGoalsRef = useRef(null);
    const [buttonText, setButtonText] = useState('Отправить');

    useEffect(() => {
        const preventScroll = (e) => {
            e.preventDefault();
        };

        if (tg) {
            tg.ready();
            tg.expand();
        }

        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });

        return () => {
            window.removeEventListener('touchmove', preventScroll);
        };
    }, [tg]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

        if (event.target.name === 'goals' && textareaGoalsRef.current) {
            autoGrow(textareaGoalsRef.current);
        } else if (event.target.name === 'audience' && textareaAudienceRef.current) {
            autoGrow(textareaAudienceRef.current);
        }
    };

    const autoGrow = (el) => {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    useEffect(() => {
        if (textareaGoalsRef.current) {
            textareaGoalsRef.current.style.height = '160px';
            autoGrow(textareaGoalsRef.current);
        }
        if (textareaAudienceRef.current) {
            textareaAudienceRef.current.style.height = '160px';
            autoGrow(textareaAudienceRef.current);
        }

        const goalsTextarea = textareaGoalsRef.current;

        const handlePasteGoals = (event) => {
            setTimeout(() => {
                if (goalsTextarea.value.length > 1000) {
                    goalsTextarea.value = goalsTextarea.value.substring(0, 1000);
                }
            }, 0);
        };

        const handleInputGoals = () => {
            if (goalsTextarea.value.length > 1000) {
                goalsTextarea.value = goalsTextarea.value.substring(0, 1000);
            }
        };

        goalsTextarea.addEventListener('input', handleInputGoals);
        goalsTextarea.addEventListener('paste', handlePasteGoals);

        return () => {
            goalsTextarea.removeEventListener('input', handleInputGoals);
            goalsTextarea.removeEventListener('paste', handlePasteGoals);
        };
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectName) newErrors.projectName = "Название проекта обязательно.";
        if (!formData.goals) newErrors.goals = "Цели и задачи обязательны.";
        if (formData.goals.length > 1000) newErrors.goals = "Цели и задачи не могут превышать 1000 символов.";
        if (!formData.fullname) newErrors.fullname = "Автор идеи обязательно.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            await addDoc(collection(db, 'IdeaTable'), formData);

            tg.sendData(JSON.stringify(formData));
            
            setFormData({
                projectName: '',
                goals: '',
                audience: '',
                fullname: '',
            });
            
            setButtonText('Отправлено!');
            alert('Данные успешно отправлены!');

            setTimeout(() => {
                setButtonText('Отправить еще');
            }, 3000);

        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            alert('Произошла ошибка при сохранении данных.');
        }
    };
    // Получаем имя пользователя из Telegram или устанавливаем общее приветствие
    const userName = tg?.initDataUnsafe?.user?.userName || "Гость";

    return (
        <div className="bg-background text-primary-foreground p-4 rounded-lg shadow-lg flex flex-col h-screen justify-between">
            <div className="hi_userName">
                Добро пожаловать, {userName}!
            </div>
            <div className="flex-grow">
            <h2 className="text-lg font-bold mb-4">Название проекта</h2>
            <input 
                type="text" 
                name="projectName" 
                value={formData.projectName} 
                onChange={handleChange} 
                placeholder="Укажите краткое название" 
                className={inputClasses} 
            />
            <h2 className="text-lg font-bold mb-4">Цели и задачи</h2>
            <textarea 
                name="goals" 
                ref={textareaGoalsRef} 
                value={formData.goals} 
                onChange={handleChange} 
                placeholder="Опишите основные цели и задачи" 
                className={inputClasses}
            ></textarea>
            <h2 className="text-lg font-bold mb-4">Целевая аудитория</h2>
            <input 
                type="text" 
                name="audience" 
                value={formData.audience} 
                onChange={handleChange} 
                placeholder="Определите основных пользователей" 
                className={inputClasses} 
            />
            <h2 className="text-lg font-bold mb-4">Автор идеи</h2>
            <input 
                type="text" 
                name="fullname" 
                value={formData.fullname} 
                onChange={handleChange} 
                placeholder="Укажите полное имя автора" 
                className={inputClasses} 
            />
            {errors.projectName && <p className="text-red-500">{errors.projectName}</p>}
            {errors.goals && <p className="text-red-500">{errors.goals}</p>}
            {errors.fullname && <p className="text-red-500">{errors.fullname}</p>}
            </div>
             {/* Фиксированная кнопка */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background">
            <button className={buttonClasses} onClick={handleSubmit}>{buttonText}</button>
            </div>
        </div>
    );
};

export default BriefFormNew;
import React, { useState, useRef, useEffect } from 'react';
//import './../../../src/firebase.js';
import { db } from './../../../src/firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import './BriefForm.css';

const inputClasses = 'w-full px-4 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200 font-MarvelSans-Regular';
const containerClasses = 'bg-background text-primary-foreground p-6 rounded-lg shadow-lg max-w-lg mx-auto min-h-screen flex flex-col justify-between font-MarvelSans-Regular';
const labelClasses = 'block text-sm font-medium mb-0.5 text-secondary font-MarvelSans-Regular label-custom';

const BriefForm = () => {
    const tg = window.Telegram.WebApp;
    const [formData, setFormData] = useState({
        projectName: '',
        goals: '',
        audience: '',
        fullname: '',
    });
    
    const [errors, setErrors] = useState({});
    const textareaAudienceRef = useRef(null); // Реф для textarea целевой аудитории
    const textareaGoalsRef = useRef(null); // Реф для textarea целей
    const [buttonText, setButtonText] = useState('Отправить'); // Состояние для текста кнопки

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Сбрасываем ошибку при изменении

        // Изменяем высоту textarea
        if (event.target.name === 'goals' && textareaGoalsRef.current) {
            autoGrow(textareaGoalsRef.current);
        } else if (event.target.name === 'audience' && textareaAudienceRef.current) {
            autoGrow(textareaAudienceRef.current);
        }
    };

    // Функция для динамического изменения высоты
    const autoGrow = (el) => {
        el.style.height = 'auto'; // Сбрасываем высоту
        el.style.height = `${el.scrollHeight}px`; // Устанавливаем новую высоту
    };

    // Устанавливаем начальную высоту при монтировании компонента
    useEffect(() => {
        if (textareaGoalsRef.current) {
            textareaGoalsRef.current.style.height = '160px'; // Установите желаемую начальную высоту для целей
            autoGrow(textareaGoalsRef.current); // Применяем функцию авто-роста
        }
        if (textareaAudienceRef.current) {
            textareaAudienceRef.current.style.height = '160px'; // Установите желаемую начальную высоту для целевой аудитории
            autoGrow(textareaAudienceRef.current); // Применяем функцию авто-роста
        }
            // Добавляем обработчики событий для ограничения символов
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
        if (!formData.fullname) newErrors.fullname = "ФИО обязательно.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        try {
           // Отправка данных в Firestore
            await addDoc(collection(db, 'IdeaTable'), {
                projectName: formData.projectName,
                goals: formData.goals,
                audience: formData.audience,
                fullname: formData.fullname,
                });

                // Отправка данных в Telegram
            tg.sendData(JSON.stringify({
                projectName: formData.projectName,
                goals: formData.goals,
                audience: formData.audience,
                fullname: formData.fullname,
            }));
            
                // Очищаем поля формы
                setFormData({
                projectName: '',
                goals: '',
                audience: '',
                fullname: '',
                });
                
                // Меняем текст на кнопке после успешной отправки
                setButtonText('Отправлено!'); 

                // Вы можете добавить сообщение об успехе здесь
                alert('Данные успешно отправлены!');

                // Возвращаем текст кнопки через некоторое время (например, 3 секунды)
                setTimeout(() => {
                    setButtonText('Отправить еще');
                }, 3000);

            } catch (error) {
                console.error('Ошибка при сохранении данных:', error);
                alert('Произошла ошибка при сохранении данных.');
            }
    };

    const handleFocus = () => {
       window.scrollTo({ top: window.scrollY, behavior: 'smooth' }); // Прокручиваем страницу вверх при фокусе
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex-grow">
        <div className={containerClasses}>
            <span className={'username'}>{tg.initDataUnsafe?.user?.userName}</span>
            
            {/* Поле: Название проекта */}
            <div className="form-group">
                <label htmlFor="project-name" className={labelClasses}>
                    Название проекта
                </label>
                <input 
                    type="text" 
                    id="project-name" 
                    name="projectName" 
                    maxLength="1000"
                    placeholder="Укажите краткое название" 
                    className={inputClasses} 
                    value={formData.projectName} 
                    onChange={handleChange} 
                />
                {errors.projectName && <p className="text-red-500 text-sm">{errors.projectName}</p>}
            </div>
    
            {/* Поле: Цели и задачи */}
            <div className="form-group">
                <label htmlFor="goals" className={labelClasses}>
                    Цели и задачи
                </label>
                <textarea
                    id="goals"
                    name="goals"
                    maxLength="1000"
                    placeholder="Опишите основные цели и задачи"
                    className={`${inputClasses} h-auto resize-none`} 
                    ref={textareaGoalsRef}
                    value={formData.goals}
                    onChange={handleChange}
                ></textarea>
                {errors.goals && <p className="text-red-500 text-sm">{errors.goals}</p>}
            </div>
    
            {/* Поле: Целевая аудитория */}
            <div className="form-group">
                <label htmlFor="audience" className={labelClasses}>
                    Целевая аудитория
                </label>
                <textarea
                    id="audience"
                    name="audience"
                    maxLength="1000"
                    placeholder="Определите основных пользователей"
                    className={`${inputClasses} h-auto resize-none`} 
                    ref={textareaAudienceRef}
                    value={formData.audience}
                    onChange={handleChange}
                ></textarea>
            </div>
    
            {/* Поле: Автор идеи */}
            <div className="form-group">
                <label htmlFor="fullname" className={labelClasses}>
                    Автор идеи
                </label>
                <input 
                    type="text" 
                    id="fullname" 
                    name="fullname" 
                    placeholder="Укажите полное имя автора" 
                    className={inputClasses} 
                    value={formData.fullname} 
                    onChange={handleChange}  
                />
                {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
            </div>              
    
            {/* Кнопка отправки */}
            <button 
                type="submit"
                disabled={!formData.goals || !formData.fullname}
                className={`custom-button ${!formData.goals || !formData.fullname ? 'opacity-50' : ''}`}>
                {buttonText}
            </button>
        </div>
    </form>
    )
};

export default BriefForm;
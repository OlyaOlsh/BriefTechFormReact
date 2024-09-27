import React, { useState, useRef, useEffect } from 'react';
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
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectName) newErrors.projectName = "Название проекта обязательно.";
        if (!formData.goals) newErrors.goals = "Цели и задачи обязательны.";
        if (!formData.fullname) newErrors.fullname = "ФИО обязательно.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        // Отправка данных
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
        
        // Вы можете добавить сообщение об успехе здесь
    };

    const handleFocus = () => {
       window.scrollTo({ top: window.scrollY - 300, behavior: 'smooth' }); // Прокручиваем страницу вверх при фокусе
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex-grow">
            <div className={containerClasses}>
                <span className={'username'}>{tg.initDataUnsafe?.user?.userName}</span>
                <h2 className="custom-header text-3xl font-bold">А это Идея!</h2>
    
                {/* Поле: Название проекта */}
                <div className="mb-2">
                    <label htmlFor="project-name" className={labelClasses}>
                        Название проекта
                    </label>
                    <input 
                        type="text" 
                        id="project-name" 
                        name="projectName" 
                        placeholder="Укажите краткое название" 
                        className={inputClasses} 
                        value={formData.projectName} 
                        onChange={handleChange} 
                    />
                    {errors.projectName && <p className="text-red-500 text-sm font-MarvelSans">{errors.projectName}</p>}
                </div>
                
                {/* Поле: Автор идеи */}
                <div className="mb-2">
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
                        onFocus={handleFocus}
                    />
                    {errors.fullname && <p className="text-red-500 text-sm font-MarvelSans">{errors.fullname}</p>}
                </div>
    
                {/* Поле: Целевая аудитория */}
                <div className="mb-2">
                    <label htmlFor="audience" className={labelClasses}>
                        Целевая аудитория
                    </label>
                    <textarea
                        id="audience"
                        name="audience"
                        placeholder="Определите основных пользователей"
                        className={`${inputClasses} h-auto resize-none overflow-y-hidden`} // Убираем фиксированную высоту
                        ref={textareaAudienceRef} // Привязываем реф к textarea целевой аудитории
                        value={formData.audience}
                        onChange={handleChange}
                        onFocus={handleFocus} // Добавляем обработчик фокуса
                    ></textarea>
                </div>
    
                {/* Поле: Цели и задачи */}
                <div className="mb-2">
                    <label htmlFor="goals" className={labelClasses}>
                        Цели и задачи
                    </label>
                    <textarea
                        id="goals"
                        name="goals"
                        placeholder="Опишите основные цели и конкретные задачи, которые решает данная функциональность"
                        className={`${inputClasses} h-auto resize-none overflow-y-hidden`} // Убираем фиксированную высоту
                        ref={textareaGoalsRef} // Привязываем реф к textarea
                        value={formData.goals}
                        onChange={handleChange}
                        onFocus={handleFocus} // Добавляем обработчик фокуса
                    ></textarea>
                    {errors.goals && <p className="text-red-500 text-sm">{errors.goals}</p>}
                </div>
    
                {/* Кнопка отправки */}
                <button 
                    type="submit"
                    disabled={!formData.goals || !formData.fullname}
                    className={`custom-button ${!formData.goals || !formData.fullname ? 'opacity-50' : ''}`}>
                    Отправить
                </button>
            </div>
        </form>
    );
};

export default BriefForm;
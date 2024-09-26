import React, { useState } from 'react';
import './BriefForm.css';

const inputClasses = 'w-full px-4 py-3 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200';
const containerClasses = 'bg-background text-primary-foreground p-8 rounded-lg shadow-lg max-w-lg mx-auto min-h-screen flex flex-col justify-between';
const labelClasses = 'block text-sm font-medium mb-1 text-secondary';

const BriefForm = () => {
    const tg = window.Telegram.WebApp;
    const [formData, setFormData] = useState({
        projectName: '',
        goals: '',
        audience: '',
        fullname: '',
    });
    
    const [errors, setErrors] = useState({});
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Сбрасываем ошибку при изменении
    };

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

    return (
        <form onSubmit={handleSubmit} className="relative flex-grow">
            <div className={containerClasses}>
                <span className={'username'}>{tg.initDataUnsafe?.user?.userName}</span>
                <h2 className="text-3xl font-bold text-center mb-6 text-accent">Идея в MS Dynamics AX</h2>

                <div className="mb-6">
                    <label htmlFor="project-name" className={labelClasses}>
                        Название проекта
                    </label>
                    <input type="text" id="project-name" name="projectName" placeholder="Укажите краткое название" className={inputClasses} value={formData.projectName} onChange={handleChange} />
                    {errors.projectName && <p className="text-red-500 text-sm">{errors.projectName}</p>}
                </div>
                
                <div className="mb-6">
                    <label htmlFor="goals" className={labelClasses}>
                        Цели и задачи
                    </label>
                    <textarea
                        id="goals"
                        name="goals"
                        placeholder="Опишите ключевые цели и конкретные задачи, кот. данная функциональность решает"
                        className={`${inputClasses} h-48 resize-none overflow-y-auto`}
                        value={formData.goals}
                        onChange={handleChange}
                    ></textarea>
                    {errors.goals && <p className="text-red-500 text-sm">{errors.goals}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="audience" className={labelClasses}>
                        Целевая аудитория
                    </label>
                    <input type="text" id="audience" name="audience" placeholder="Основные пользователи" className={inputClasses} value={formData.audience} onChange={handleChange} />
                </div>

                <div className="mb-6">
                    <label htmlFor="fullname" className={labelClasses}>
                        Автор идеи
                    </label>
                    <input type="text" id="fullname" name="fullname" placeholder="Укажите ФИО" className={inputClasses} value={formData.fullname} onChange={handleChange} />
                    {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
                </div>

                {/* Кнопка отправки */}
                <button 
                    type="submit"
                    disabled={!formData.goals || !formData.fullname}
                    className={`bg-blue-500 text-white hover:bg-blue-400 px-6 py-3 rounded-md w-full transition duration-200 shadow-md ${!formData.goals || !formData.fullname ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
                    Отправить
                </button>
            </div>
        </form>
    );
};

export default BriefForm;
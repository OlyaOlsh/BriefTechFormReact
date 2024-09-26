import React from 'react';
import './BriefForm.css';


const inputClasses = 'w-full px-4 py-3 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200';
const containerClasses = 'bg-background text-primary-foreground p-8 rounded-lg shadow-lg max-w-lg mx-auto min-h-screen';
const labelClasses = 'block text-sm font-medium mb-1 text-secondary';

const BriefForm = () => {
    const tg = window.Telegram.WebApp;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        // Отправляем данные на сервер через web_app_data
        tg.sendData(JSON.stringify(data));
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className={containerClasses}>
                <span className={'username'}>{tg.initDataUnsafe?.user?.userName}</span>
                <h2 className="text-3xl font-bold text-center mb-6 text-accent">Бриф на разработку в MS Dynamics AX</h2>

                <div className="mb-6">
                    <label htmlFor="project-name" className={labelClasses}>
                        Название проекта
                    </label>
                    <input type="text" id="project-name" name="project-name" placeholder="Введите название проекта" className={inputClasses} />
                </div>
                <div className="mb-6">
                    <label htmlFor="goals" className={labelClasses}>
                        Цели и задачи
                    </label>
                    <textarea id="goals" name="goals" placeholder="Введите основные цели разработки и задачи" className={inputClasses}></textarea>
                </div>
                <div className="mb-6">
                    <label htmlFor="audience" className={labelClasses}>
                        Целевая аудитория
                    </label>
                    <input type="text" id="audience" name="audience" placeholder="Введите, кто будет пользоваться" className={inputClasses} />
                </div>
                <div className="mb-6">
                    <label htmlFor="additional-materials" className={labelClasses}>
                        Дополнительные материалы (изображения, файл)
                    </label>
                    <input type="file" id="additional-materials" name="additional-materials" className={inputClasses} />
                </div>
                <div className="mb-6">
                    <label htmlFor="fullname" className={labelClasses}>
                        ФИО (для обратной связи)
                    </label>
                    <input type="text" id="fullname" name="fullname" placeholder="Введите Ваше ФИО" className={inputClasses} />
                </div>
                <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-md w-full transition duration-200 shadow-md">
                    Отправить
                </button>
            </div>
        </form>
    );
};

export default BriefForm;
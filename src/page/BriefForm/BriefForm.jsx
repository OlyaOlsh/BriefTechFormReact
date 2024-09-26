import React from 'react';
import './BriefForm.css';


const inputClasses = 'w-full px-4 py-3 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200'
const containerClasses = 'bg-background text-primary-foreground p-8 rounded-lg shadow-lg max-w-lg mx-auto'
const labelClasses = 'block text-sm font-medium mb-1 text-secondary'

const BriefForm = () => {
  const tg = window.Telegram.WebApp;


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:8000/send-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Данные успешно отправлены!');
        } else {
            alert('Ошибка при отправке данных.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
};


  return (
    <form onSubmit={handleSubmit} className="relative">
    <div className={containerClasses}>
      <span className ={'username'}>{tg.inititDataUnsafe?.user?.userName}</span>
      <img src="https://placehold.co/150.png?text=Logo" alt="Company Logo" className="mx-auto mb-6" />
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
        <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/80 px-6 py-3 rounded-md w-full transition duration-200 shadow-md fixed bottom-4 left-1/2 transform -translate-x-1/2">
          Отправить
        </button>
    </div>
    </form>

  )
};

export default BriefForm;

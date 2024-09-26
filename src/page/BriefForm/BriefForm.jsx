
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
       /* additionalMaterials: null,*/
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (event) => {
        setFormData((prevData) => ({ ...prevData, additionalMaterials: event.target.files[0] }));
    };

    const handleFileRemove = () => {
        setFormData((prevData) => ({ ...prevData, additionalMaterials: null }));
    };

    const isSubmitDisabled = !formData.goals || !formData.fullname;

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Создаем объект FormData для отправки данных формы
        const dataToSend = new FormData();
        dataToSend.append('projectName', formData.projectName);
        dataToSend.append('goals', formData.goals);
        dataToSend.append('audience', formData.audience);
        dataToSend.append('fullname', formData.fullname);

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
                </div>
                <div className="mb-6">
                    <label htmlFor="goals" className={labelClasses}>
                        Цели и задачи
                    </label>
                    <textarea id="goals" name="goals" placeholder="Опишите ключевые цели и конкретные задачи, кот. данная функциональность решает" className={inputClasses + ' h-32'} value={formData.goals} onChange={handleChange}></textarea>
                </div>
                <div className="mb-6">
                    <label htmlFor="audience" className={labelClasses}>
                        Целевая аудитория
                    </label>
                    <input type="text" id="audience" name="audience" placeholder="Основные пользователи" className={inputClasses} value={formData.audience} onChange={handleChange} />
                </div>
                <div className="mb-6">
                    <label htmlFor="fullname" className={labelClasses}>
                        ФИО (для обратной связи)
                    </label>
                    <input type="text" id="fullname" name="fullname" placeholder="Пожалуйста, укажите ФИО" className={inputClasses} value={formData.fullname} onChange={handleChange} />
                </div>
               {/* <div className="mb-6">
                    <label htmlFor="additional-materials" className={labelClasses}>
                        Дополнительные материалы и ресурсы
                    </label>
                    <div className="flex items-center">
                        <input type="file" id="additional-materials" name="additional-materials" className={inputClasses} onChange={handleFileChange} />
                        {formData.additionalMaterials && (
                            <div className="ml-4 flex items-center">
                                <img src={URL.createObjectURL(formData.additionalMaterials)} alt="Дополнительные материалы" className="max-w-[100px] max-h-[100px] object-contain mr-2" />
                           
                                <button type="button" onClick={handleFileRemove} className="text-red-500 hover:text-red-600">
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>
                </div> */}
                    <button 
                    type="submit"
                    disabled={isSubmitDisabled}
                    className={`bg-blue-500 text-white hover:bg-blue-400 px-6 py-3 rounded-md w-full transition duration-200 shadow-md ${!isSubmitDisabled ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}>

                    Отправить
                </button>
            </div>
        </form>
    );
};

export default BriefForm; 
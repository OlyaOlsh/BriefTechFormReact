
import React, { useState, useRef, useEffect } from 'react';
import { db } from './../../../src/firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import './../../../src/reset.css';
import './BriefFormNew.css';


const inputClasses = "w-full px-3 py-2 placeholder-input text-input bg-blue-100 rounded-lg mb-4 font-MarvelSans-Regular";
const buttonClasses = 'bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl font-MarvelSans-Regular active:scale-95 active:shadow-inner';

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
    const [isSubmitting, setIsSubmitting] = useState(false); // Состояние для отслеживания нажатия кнопки
    const submitButtonRef = useRef(null); // Реф для кнопки

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
        if (!formData.projectName) newErrors.projectName = "Идея обязательно.";
        if (!formData.goals) newErrors.goals = "Цели и задачи обязательны.";
        if (formData.goals.length > 1000) newErrors.goals = "Цели и задачи не могут превышать 1000 символов.";
        if (!formData.fullname) newErrors.fullname = "Автор идеи обязательно.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm() || isSubmitting) return; // Проверяем валидность формы и состояние кнопки

        setIsSubmitting(true); // Устанавливаем состояние на "нажата"

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


            const message = 'Данные успешно отправлены!';
            if (window.Telegram) {
                tg.sendData(message);
            } else {
                alert(message);
            }

            setTimeout(() => {
                setButtonText('Отправить еще');
                setIsSubmitting(false); // Возвращаем состояние кнопки обратно
            }, 3000);

        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            const message = 'Произошла ошибка при сохранении данных.';
            if (window.Telegram) {
                tg.sendData(message);
            } else {
                alert(message);
            }
            setIsSubmitting(false); // Возвращаем состояние кнопки обратно в случае ошибки
        }
    };

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Предотвращаем стандартное поведение Enter
            if (nextRef && nextRef.current) {
                nextRef.current.focus(); // Переводим фокус на кнопку
                window.scrollTo({
                    top: nextRef.current.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    };
    
    const handleFocus = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    };

    const audienceRef = useRef(null);
    const fullnameRef = useRef(null);

    // Получаем имя пользователя из Telegram или устанавливаем общее приветствие
    const userName = tg?.initDataUnsafe?.user?.userName || "Гость";

    return (
        <form onSubmit={handleSubmit} className="bg-background">
            <div className="bg-background text-primary-foreground p-4 rounded-lg shadow-lg flex flex-col h-screen justify-between">
                <div className="flex-grow">
                    <h2 className="text-lg font-bold mb-4">Идея</h2>
                    <input 
                        type="text" 
                        name="projectName" 
                        value={formData.projectName} 
                        onChange={handleChange} 
                        onKeyDown={(e) => handleKeyDown(e, textareaGoalsRef)} // Переход на текстовое поле
                        placeholder="Укажите краткое название" 
                        className={inputClasses} 
                    />
                    <h2 className="text-lg font-bold mb-4">Цели и задачи</h2> 
                    <textarea 
                        name="goals" 
                        ref={textareaGoalsRef} 
                        value={formData.goals} 
                        onChange={handleChange} 
                        onKeyDown={(e) => handleKeyDown(e, audienceRef)} // Переход на следующее поле
                        placeholder="Опишите кратко основные цели и задачи" 
                        className={inputClasses}
                    ></textarea>
                    <h2 className="text-lg font-bold mb-4">Для кого</h2>
                    <input 
                        type="text" 
                        name="audience" 
                        ref={audienceRef}
                        value={formData.audience}  
                        onChange={handleChange} 
                        onFocus={handleFocus} 
                        onKeyDown={(e) => handleKeyDown(e, fullnameRef)} // Переход на следующее поле
                        placeholder="Укажите для какого отдела" 
                        className={inputClasses} 
                    />
                    <h2 className="text-lg font-bold mb-4">Автор идеи</h2>
                    <input 
                        type="text" 
                        name="fullname" 
                        ref={fullnameRef}
                        value={formData.fullname} 
                        onChange={handleChange} 
                        onKeyDown={(e) => handleKeyDown(e, submitButtonRef)} // Переход к кнопке
                        placeholder="Укажите полное имя автора" 
                        className={inputClasses} 
                    />
                    {errors.projectName && <p className="text-red-500">{errors.projectName}</p>}
                    {errors.goals && <p className="text-red-500">{errors.goals}</p>}
                    {errors.fullname && <p className="text-red-500">{errors.fullname}</p>}
                </div>

                <button 
                    ref={submitButtonRef} 
                    className={`${buttonClasses} ${isSubmitting ? 'bg-[#78C946]' : ''}`} // Изменяем цвет при нажатии
                    type="submit" 
                    disabled={isSubmitting} // Отключаем кнопку во время обработки
                >
                    {buttonText}
                </button>
            </div>
        </form>
    );
};

export default BriefFormNew;
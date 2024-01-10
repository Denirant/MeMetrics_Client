import { useState, useEffect } from "react";

/**
* @param {React.node} el
* @param {boolen} initialState
*/

export const useDetectOutsideClick = (el, initialState) => {

    const [isActive, setIsActive] = useState(initialState);
    //хук - элемент кода, который позволяет взаимодействовать с компонентами принимая то или иное состояние
    //useEffect - обрабатываем нажатием вне компонента имеено в этом случае
    useEffect(() => {
        const onClick = event => {
            // !el.current.contains(e.target - обращаемся к элемента и проверяем 
            // есть ли элемент вызвавший события изменения навигационной панели
            if (el.current !== null && !el.current.contains(event.target)) {
                setIsActive(!isActive);
            }

            console.log(event.target)
        };
        //если элемент активный(открыт), то слушаем события нажатия клика для закрытия панели
        if (isActive) {
            window.addEventListener("mousedown", onClick);
        }

        return () => {
            window.removeEventListener("mousedown", onClick);
        };
    }, [isActive, el]);

    return [isActive, setIsActive];
}
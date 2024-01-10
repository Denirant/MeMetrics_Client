import { useState, useEffect } from "react";
import updateItemWidth from "./changeFileSize";
/**
 * Hook for handling closing when clicking outside of an element
 * @param {React.node} el
 * @param {boolean} initialState
 */
export const useOutsideClick = (el, initialState) => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const onClick = (e) => {

      // If the active element exists and is clicked outside of
      if (el.current !== null && !el.current.contains(e.target)) {
        setIsActive(false)

        if(document.getElementById('webNav') === el.current){
          localStorage.setItem('isOpen', JSON.stringify(false));

          setTimeout(() => {
              updateItemWidth()
          }, 220)
        }
      }
    };

    // If the item is active (ie open) then listen for clicks outside
    if (isActive) {

      window.addEventListener("mousedown", onClick);
      window.addEventListener("contextmenu", onClick);
    }

    return () => {
      window.removeEventListener("mousedown", onClick);
      window.addEventListener("contextmenu", onClick);
    };
  }, [isActive, el]);

  return [isActive, setIsActive];
};

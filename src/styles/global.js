// src/styles/global.js
import "./global.css";

// Optional: Global JavaScript if needed
export const onClientEntry = () => {
  console.log("M.E.G.A. Global Styles Loaded");
  
  // Fix any remaining white text issues on load
  setTimeout(() => {
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.color === 'rgb(255, 255, 255)' && 
          style.backgroundColor === 'rgb(255, 255, 255)') {
        el.style.color = '#FFFFFF';
        el.style.backgroundColor = '#0A1D3F';
      }
    });
  }, 100);
};
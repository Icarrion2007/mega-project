// src/components/layout.js
import React from "react";
import PropTypes from "prop-types";

// Import global styles
import "../styles/global.css";

const Layout = ({ children }) => {
  return (
    <>
      <div 
        style={{
          minHeight: "100vh",
          background: "#0A1D3F",
          color: "#FFFFFF"
        }}
      >
        {children}
      </div>
      
      {/* Global script to fix white text */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              // Fix white-on-white text
              function fixWhiteText() {
                const elements = document.querySelectorAll('*');
                elements.forEach(el => {
                  const style = window.getComputedStyle(el);
                  const bgColor = style.backgroundColor;
                  const textColor = style.color;
                  
                  // If background is white/light and text is white, fix it
                  if ((bgColor === 'rgb(255, 255, 255)' || 
                       bgColor === 'rgb(248, 249, 250)' ||
                       bgColor === 'rgb(245, 247, 250)') &&
                      textColor === 'rgb(255, 255, 255)') {
                    el.style.color = '#FFFFFF';
                    el.style.backgroundColor = '#0A1D3F';
                  }
                  
                  // If background is transparent and parent has white bg
                  if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                    let parent = el.parentElement;
                    while (parent) {
                      const parentStyle = window.getComputedStyle(parent);
                      if (parentStyle.backgroundColor === 'rgb(255, 255, 255)') {
                        el.style.color = '#000000';
                        break;
                      }
                      parent = parent.parentElement;
                    }
                  }
                });
              }
              
              // Run on load and after 1 second (for dynamic content)
              fixWhiteText();
              setTimeout(fixWhiteText, 1000);
              
              // Observe DOM changes
              const observer = new MutationObserver(fixWhiteText);
              observer.observe(document.body, { 
                childList: true, 
                subtree: true 
              });
            });
          `
        }}
      />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
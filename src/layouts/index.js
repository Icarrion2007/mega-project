import React from "react";
import "../styles/global.css";

const Layout = ({ children }) => {
  return (
    <div style={{ 
      backgroundColor: "#0A1D3F", 
      color: "#FFFFFF",
      minHeight: "100vh"
    }}>
      {children}
      
      {/* Hidden JS fix for any remaining white text */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              // Fix any white-on-white text immediately
              const fix = () => {
                document.querySelectorAll('div, section, table').forEach(el => {
                  if (window.getComputedStyle(el).backgroundColor === 'rgb(255, 255, 255)') {
                    el.style.backgroundColor = '#0A1D3F';
                  }
                  if (window.getComputedStyle(el).color === 'rgb(255, 255, 255)') {
                    el.style.color = '#FFFFFF';
                  }
                });
              };
              fix();
              setTimeout(fix, 100);
              setTimeout(fix, 1000);
            });
          `
        }}
      />
    </div>
  );
};

export default Layout;

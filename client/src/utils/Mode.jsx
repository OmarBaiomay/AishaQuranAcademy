import React from 'react';

const Mode = () => {
    const handleToggle = (isChecked) => {
        const htmlTag = document.documentElement;
        if (isChecked) {
            htmlTag.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            htmlTag.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    };

    const handleChange = (event) => {
        const isChecked = event.target.checked;
        handleToggle(isChecked);
    };

    return (
       
            <div className='mode-container'>
                <input
                    type="checkbox"
                    onChange={handleChange}
                    
                    checked={localStorage.getItem('darkMode')}
                />
            </div>
       
    );
};

export default Mode;
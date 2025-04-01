document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const colorDisplay = document.getElementById('colorDisplay');
    const colorCode = document.getElementById('colorCode');
    const colorPicker = document.getElementById('colorPicker');
    const presetColors = document.querySelectorAll('.preset-color');
    const redSlider = document.getElementById('redSlider');
    const greenSlider = document.getElementById('greenSlider');
    const blueSlider = document.getElementById('blueSlider');
    const redInput = document.getElementById('redInput');
    const greenInput = document.getElementById('greenInput');
    const blueInput = document.getElementById('blueInput');
    const randomColorBtn = document.getElementById('randomColor');
    const copyColorBtn = document.getElementById('copyColor');
    const colorHistory = document.getElementById('colorHistory');
    const toast = document.getElementById('toast');
    
    let currentColor = '#4285F4';
    let colorHistoryArray = [];
    
    // Initialize color display
    updateColorDisplay(currentColor);
    
    // Event listeners
    colorPicker.addEventListener('input', function() {
      currentColor = this.value;
      updateColorDisplay(currentColor);
      updateSliders(currentColor);
      addToHistory(currentColor);
    });
    
    // Preset color selection
    presetColors.forEach(preset => {
      preset.addEventListener('click', function() {
        currentColor = this.getAttribute('data-color');
        updateColorDisplay(currentColor);
        updateSliders(currentColor);
        colorPicker.value = currentColor;
        addToHistory(currentColor);
      });
    });
    
    // RGB Sliders
    redSlider.addEventListener('input', updateFromSliders);
    greenSlider.addEventListener('input', updateFromSliders);
    blueSlider.addEventListener('input', updateFromSliders);
    
    // RGB number inputs
    redInput.addEventListener('input', function() {
      constrainInput(this, 0, 255);
      redSlider.value = this.value;
      updateFromSliders();
    });
    
    greenInput.addEventListener('input', function() {
      constrainInput(this, 0, 255);
      greenSlider.value = this.value;
      updateFromSliders();
    });
    
    blueInput.addEventListener('input', function() {
      constrainInput(this, 0, 255);
      blueSlider.value = this.value;
      updateFromSliders();
    });
    
    // Random color button
    randomColorBtn.addEventListener('click', function() {
      const randomColor = getRandomColor();
      currentColor = randomColor;
      updateColorDisplay(currentColor);
      updateSliders(currentColor);
      colorPicker.value = currentColor;
      addToHistory(currentColor);
    });
    
    // Copy color code button
    copyColorBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(currentColor)
        .then(() => {
          showToast();
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    });
    
    // Functions
    function updateColorDisplay(color) {
      colorDisplay.style.backgroundColor = color;
      colorCode.textContent = color.toUpperCase();
      
      // Change text color based on background brightness
      const rgb = hexToRgb(color);
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      
      if (brightness > 128) {
        colorCode.style.color = '#000000';
      } else {
        colorCode.style.color = '#FFFFFF';
      }
    }
    
    function updateSliders(color) {
      const rgb = hexToRgb(color);
      redSlider.value = rgb.r;
      greenSlider.value = rgb.g;
      blueSlider.value = rgb.b;
      redInput.value = rgb.r;
      greenInput.value = rgb.g;
      blueInput.value = rgb.b;
    }
    
    function updateFromSliders() {
      const red = parseInt(redSlider.value);
      const green = parseInt(greenSlider.value);
      const blue = parseInt(blueSlider.value);
      
      redInput.value = red;
      greenInput.value = green;
      blueInput.value = blue;
      
      currentColor = rgbToHex(red, green, blue);
      updateColorDisplay(currentColor);
      colorPicker.value = currentColor;
      addToHistory(currentColor);
    }
    
    function constrainInput(input, min, max) {
      let value = parseInt(input.value);
      if (isNaN(value)) {
        value = 0;
      }
      if (value < min) {
        value = min;
      }
      if (value > max) {
        value = max;
      }
      input.value = value;
    }
    
    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    }
    
    function rgbToHex(r, g, b) {
      return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    }
    
    function componentToHex(c) {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }
    
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    
    function addToHistory(color) {
      if (!colorHistoryArray.includes(color)) {
        colorHistoryArray.unshift(color);
        if (colorHistoryArray.length > 10) {
          colorHistoryArray.pop();
        }
        updateColorHistory();
      }
    }
    
    function updateColorHistory() {
      colorHistory.innerHTML = '';
      colorHistoryArray.forEach(color => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-color';
        historyItem.style.backgroundColor = color;
        historyItem.setAttribute('data-color', color);
        historyItem.addEventListener('click', function() {
          currentColor = this.getAttribute('data-color');
          updateColorDisplay(currentColor);
          updateSliders(currentColor);
          colorPicker.value = currentColor;
        });
        
        historyItem.addEventListener('mouseover', function() {
          const tooltip = document.createElement('div');
          tooltip.textContent = color;
          tooltip.style.position = 'absolute';
          tooltip.style.backgroundColor = '#333';
          tooltip.style.color = 'white';
          tooltip.style.padding = '3px 6px';
          tooltip.style.borderRadius = '3px';
          tooltip.style.fontSize = '12px';
          tooltip.style.zIndex = '100';
          tooltip.className = 'color-tooltip';
          
          document.body.appendChild(tooltip);
          
          const rect = this.getBoundingClientRect();
          tooltip.style.top = `${rect.bottom + 5}px`;
          tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        });
        
        historyItem.addEventListener('mouseout', function() {
          const tooltips = document.querySelectorAll('.color-tooltip');
          tooltips.forEach(t => t.remove());
        });
        
        colorHistory.appendChild(historyItem);
      });
    }
    
    function showToast() {
      toast.classList.add('show-toast');
      setTimeout(() => {
        toast.classList.remove('show-toast');
      }, 2000);
    }
  });
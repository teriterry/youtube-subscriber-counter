export class RollingCounter {
  constructor(selector, initialValue = 0) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.value = initialValue;
    this.renderCounter(this.value);
  }

  createDigitElement(digit = 0) {
    const digitContainer = document.createElement('div');
    digitContainer.className = 'digit';

    const wrapper = document.createElement('div');
    wrapper.className = 'digits-wrapper';

    for (let i = 0; i <= 9; i++) {
      const span = document.createElement('span');
      span.textContent = i;
      wrapper.appendChild(span);
    }

    wrapper.style.transform = `translateY(${-digit * 1}em)`;
    digitContainer.appendChild(wrapper);
    return digitContainer;
  }

  renderCounter(value) {
    const valueStr = value.toString();
    const digitCount = this.container.children.length;

    // 添加或删除 digit 容器
    if (digitCount < valueStr.length) {
      const missing = valueStr.length - digitCount;
      for (let i = 0; i < missing; i++) {
        this.container.insertBefore(this.createDigitElement(0), this.container.firstChild);
      }
    } else if (digitCount > valueStr.length) {
      const extra = digitCount - valueStr.length;
      for (let i = 0; i < extra; i++) {
        this.container.removeChild(this.container.firstChild);
      }
    }

    // 更新数字
    const newStr = value.toString().padStart(this.container.children.length, '0');
    for (let i = 0; i < this.container.children.length; i++) {
      const digit = parseInt(newStr[i]);
      const digitElem = this.container.children[i];
      const wrapper = digitElem.querySelector('.digits-wrapper');
      // wrapper.style.transform = `translateY(${-digit * 1}em)`;

      wrapper.style.transform = `translateY(${-digit * 1.2}em)`;  // 匹配新的高度

    }
  }

  update(newValue) {
    if (newValue !== this.value) {
      this.renderCounter(newValue);
      this.value = newValue;
    }
  }
}

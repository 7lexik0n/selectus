class Selectus {
  selectClassName = "select select__wrapper";
  selectButtonClassName = "selectus__button";
  optionsBoxName = "selectus__optionsBox";
  optionsClassName = "selectus__option";
  optionsActiveClassName = `${this.optionsClassName}_active`;

  toggleSpeed = 100;

  constructor(defaultSelect, { animated = true } = {}) {
    this.defaultSelect = defaultSelect;
    this.animated = animated;
    this.init();
    this.render();
  }

  init() {
    this.hide(this.defaultSelect);
  }

  hide(element) {
    element.style.display = "none";
  }

  hideMenu = () => {
    this.optionsBox.classList.add("selectus__optionsBox_animated");
    this.menuHeight = this.optionsBox.getBoundingClientRect().height;
    this.optionsBox.style.height = "0px";
  };

  toggleSelectMenu = () => {
    if (!this.animated) {
      this.optionsBox.classList.toggle(`${this.optionsBoxName}_opened`);
    } else {
      this.optionsBox.classList.contains(`${this.optionsBoxName}_opened`) ?
        this.toggleMenu(this.toggleSpeed, "close") :
        this.toggleMenu(this.toggleSpeed, "open");
    }
  };

  toggleMenu(duration, type) {
    const start = performance.now();

    requestAnimationFrame((time) =>
      this.animationFunction({
        time,
        start,
        duration,
        type,
      })
    );
  }

  animationFunction({ time, start, duration, type }) {
    let timeFraction = (time - start) / duration;

    if (timeFraction >= 1) {
      timeFraction = 1;
      
      if (type === "open") {
        this.optionsBox.classList.add(`${this.optionsBoxName}_opened`);

        if (this.options[0].offsetHeight * 5 > this.menuHeight) {
          this.menuHeight = this.options[0].offsetHeight * 5;
          this.optionsBox.style.height = `${this.menuHeight}px`;
        }
      } else {
        this.optionsBox.classList.remove(`${this.optionsBoxName}_opened`);
      }
    }

    let progress =
      type === "open"
        ? this.getOpenTiming(timeFraction)
        : this.getCloseTiming(timeFraction);

    this.draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame((newTime) =>
        this.animationFunction({
          time: newTime,
          start,
          duration,
          type,
        })
      );
    }
  }

  getOpenTiming(timeFraction) {
    return timeFraction;
  }

  getCloseTiming(timeFraction) {
    return 1 - timeFraction;
  }

  draw(progress) {
    this.optionsBox.style.height = `${this.menuHeight * progress}px`;
  }

  selectOption = (evt) => {
    const option = evt.target.closest(`.${this.optionsClassName}`);

    if (option) {
      const value = option.dataset.value;
      const index = option.dataset.index;
      const text = option.innerText;

      this.resetOptions();
      this.changeSelectData(index, value, text);
    }
  };

  resetOptions() {
    this.options[this.index].classList.remove(this.optionsActiveClassName);
    this.defaultSelect.options[this.index].removeAttribute("selected");
  }

  changeSelectData(index, value, text) {
    this.value = value;
    this.index = index;
    this.button.innerText = text;

    this.options[this.index].classList.add(this.optionsActiveClassName);
    this.defaultSelect.options[this.index].setAttribute("selected", "selected");
  }

  render() {
    this.parent = this.defaultSelect.parentElement;

    this.value = this.defaultSelect.value;
    this.index = this.defaultSelect.selectedIndex;

    this.elem = document.createElement("div");
    this.elem.className = this.selectClassName;

    this.button = document.createElement("div");
    this.button.classList.add(this.selectButtonClassName);
    this.button.innerText = this.defaultSelect[this.index].innerText;

    this.optionsBox = document.createElement("div");
    this.optionsBox.classList.add(this.optionsBoxName);

    const options = Array.from(this.defaultSelect.options);
    this.options = [...options].map((option, index) => {
      const value = option.value;
      const text = option.innerText;
      const selected = option.selected;
      const optionElement = document.createElement("div");
      optionElement.innerHTML = `
          <div
            class="${this.optionsClassName}${
        selected ? ` ${this.optionsActiveClassName}` : ""
      }"
            data-value="${value}"
            data-index="${index}"
          >
            ${text}
          </div>
        `;

      return optionElement.firstElementChild;
    });

    this.options.forEach((option) =>
      this.optionsBox.insertAdjacentElement("beforeend", option)
    );

    this.parent.insertAdjacentElement("beforeend", this.elem);
    this.elem.insertAdjacentElement("beforeend", this.button);
    this.elem.insertAdjacentElement("beforeend", this.optionsBox);

    this.addEventListeners();
  }

  addEventListeners() {
    this.elem.addEventListener("click", this.toggleSelectMenu);
    this.optionsBox.addEventListener("click", this.selectOption);

    if (this.animated) {
      document.addEventListener("DOMContentLoaded", this.hideMenu);
    }
  }
}

window.selectus = (className, { animated = true } = {}) => {
  const defaultSelect = document.querySelector(className);

  if (defaultSelect) {
    new Selectus(defaultSelect, { animated });
  }
};

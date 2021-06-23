# Selectus
Customized select element

## Getting Started

- Add `selectus.js` to your project before your closing `body` tag
- Add `selectus.css` to your project and modify it as you want
- Initialize selectus in your script file or an inline script tag
### HTML
```html
  <select id="defaultSelect">
    <option value="1" selected>Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
    <option value="4">Option 4</option>
    <option value="5">Option 5</option>
  </select>
```
### JS
```javascript
  selectus('#defaultSelect');
```

### Syntax
> selectus(*className* [, *settings*]);

## Settings
Selectus is using slide animation to show/hide select menu. You can disable it, using `animated` property:
```javascript
  selectus('#defaultSelect', { animated: false });
```

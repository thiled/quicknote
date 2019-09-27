// menu definition
const menuMap = {
  themes: [
    {
      name: 'Breeze',
      bgColor: '#232627',
      fontColor: '#fcfcfc'
    },
    {
      name: 'Monokai',
      bgColor: '#272822',
      fontColor: '#a6e22e'
    },
    {
      name: 'Light',
      bgColor: '#fff',
      fontColor: '#000'
    },
    {
      name: 'Terminal',
      bgColor: '#000',
      fontColor: '#18f018'
    },
    {
      name: 'VSCode',
      bgColor: '#1e1e1e',
      fontColor: '#9cdcfe'
    }
  ]
};
const ThemeKey = 'quickNote_theme';
const storeTheme = window.localStorage.getItem(ThemeKey);
// fill menu
let html = template('menu-themes', {
  themes: menuMap.themes,
  activeTheme: storeTheme || 'Light'
});
document.getElementById('menu').innerHTML = html;
// restore theme
if (storeTheme) {
  let themeObj = menuMap.themes.find(item => item.name === storeTheme);
  if (themeObj) applyTheme(themeObj);
}
// prevent default context menu
document.oncontextmenu = e => {
  e.preventDefault();
};
// control menu display
document.onmousedown = e => {
  if (e.button === 2) {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('menu').style.left = e.clientX + 'px';
    document.getElementById('menu').style.top = e.clientY + 'px';
  } else {
    document.getElementById('menu').style.display = 'none';
  }
};
// apply theme
document.getElementById('menu').onmousedown = e => {
  const themeMenuItemClass = 'menu-item';
  if (e.target.getAttribute('class').match(new RegExp(themeMenuItemClass))) {
    if (!e.target.getAttribute('class').match(/active/)) {
      applyTheme({
        bgColor: e.target.dataset.bgcolor,
        fontColor: e.target.dataset.fontcolor
      });
      window.localStorage.setItem(ThemeKey, e.target.dataset.name);
      document
        .getElementsByClassName(themeMenuItemClass + ' active')[0]
        .setAttribute('class', themeMenuItemClass);
      e.target.setAttribute('class', themeMenuItemClass + ' active');
    }
  }
};

function applyTheme({ bgColor, fontColor }) {
  document.body.style.color = fontColor;
  document.body.style.background = bgColor;
}

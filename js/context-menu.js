// menu definition
let themesMenu = {
  name: 'themes',
  menu: [
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
  ],
  focused: ''
};
// 上下文菜单，支持多级
let contextMenu = [themesMenu];
const ThemeKey = 'quickNote_theme';
const storeTheme = window.localStorage.getItem(ThemeKey);

Vue.component('context-menu', {
  props: ['menu', 'parent', 'focused'],
  template: document.getElementById('context-menu').innerHTML
});

let app = new Vue({
  el: '#app',
  data: {
    contextMenu: contextMenu,
    menuShow: false,
    menuPosition: {
      left: 0,
      top: 0
    }
  },
  mounted() {
    // control menu display
    document.onmousedown = e => {
      if (e.button === 2) {
        this.menuShow = true;
        this.menuPosition.left = e.clientX + 'px';
        this.menuPosition.top = e.clientY + 'px';
      } else {
        this.menuShow = false;
      }
    };
  }
});

// restore theme
applyTheme(storeTheme || 'Light');

// prevent default context menu
document.oncontextmenu = e => {
  e.preventDefault();
};

// apply theme
document.getElementById('menu').onmousedown = e => {
  if (e.target.dataset.parent === 'themes') {
    applyTheme(e.target.dataset.name);
    window.localStorage.setItem(ThemeKey, e.target.dataset.name);
  }
};

function applyTheme(themeName) {
  let themeObj = themesMenu.menu.find(item => item.name === themeName);
  if (!themeObj) return;
  themesMenu.focused = themeName;
  Vue.set(app.contextMenu, 0, themesMenu);
  document.body.style.color = themeObj.fontColor;
  document.body.style.background = themeObj.bgColor;
}

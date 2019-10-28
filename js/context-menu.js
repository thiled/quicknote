// menu definition
const themesMenu = [
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
];

let contextMenu = [
  {
    name: 'themes',
    menu: themesMenu
  },
  {
    name: 'test',
    menu: [
      {
        name: 1
      }
    ]
  }
];
const ThemeKey = 'quickNote_theme';
const storeTheme = window.localStorage.getItem(ThemeKey);

// restore theme
if (storeTheme) {
  applyTheme(storeTheme);
}

Vue.component('context-menu', {
  props: ['menu'],
  data: function() {
    return {};
  },
  template: document.getElementById('context-menu').innerHTML,
  methods:{
    onMenuSelect(a){
      console.log(a)
    }
  }
});
new Vue({
  el: '#app',
  data: {
    activeTheme: storeTheme || 'Light',
    contextMenu: { menu: contextMenu }
  },
  mounted() {}
});
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
// document.getElementById('menu').onmousedown = e => {
//   const themeMenuItemClass = 'menu-item';
//   if (
//     e.target.getAttribute('class').match(new RegExp(themeMenuItemClass)) &&
//     e.target.dataset.parent === 'themes'
//   ) {
//     if (!e.target.getAttribute('class').match(/active/)) {
//       applyTheme(e.target.dataset.name);
//       window.localStorage.setItem(ThemeKey, e.target.dataset.name);
//       if (
//         document.getElementsByClassName(themeMenuItemClass + ' active').length >
//         0
//       ) {
//         document
//           .getElementsByClassName(themeMenuItemClass + ' active')[0]
//           .setAttribute('class', themeMenuItemClass);
//       }
//       e.target.setAttribute('class', themeMenuItemClass + ' active');
//     }
//   }
// };

function applyTheme(themeName) {
  let themeObj = themesMenu.find(item => item.name === themeName);
  if (!themeObj) return;
  document.body.style.color = themeObj.fontColor;
  document.body.style.background = themeObj.bgColor;
}

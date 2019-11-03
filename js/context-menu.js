// menu definition
let themesMenu = {
  name: 'Themes',
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
let projectListMenu = {
  name: '项目列表',
  menu: [],
  focused: currentListName
};
db.lists.each(item => {
  projectListMenu.menu.push({
    name: item.name
  });
});
// 上下文菜单，支持多级
let contextMenu = [
  themesMenu,
  projectListMenu,
  {
    name: '新建项目'
  }
];
const ThemeKey = 'quickNote_theme';
const storeTheme = window.localStorage.getItem(ThemeKey);

Vue.component('context-menu', {
  props: ['menu', 'parent', 'focused'],
  template: document.getElementById('context-menu').innerHTML
});
Vue.component('v-dialog', {
  props: ['isShown'],
  template: document.getElementById('dialog').innerHTML
});
let app = new Vue({
  el: '#app',
  data: {
    contextMenu: contextMenu,
    menuShow: false,
    menuPosition: {
      left: 0,
      top: 0
    },
    newProjectDialogShow: false,
    newProjectName: ''
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
  },
  methods: {
    onProjectCreate() {
      this.newProjectDialogShow = false;
      if (this.newProjectName) {
        Store.$emit('projectChange', this.newProjectName);
        projectListMenu.menu.push({
          name: this.newProjectName
        });
        projectListMenu.focused = this.newProjectName;
        this.newProjectName = '';
      }
    },
    onMenuSelect(e) {
      if (e.target.dataset.parent === themesMenu.name) {
        applyTheme(e.target.dataset.name);
        window.localStorage.setItem(ThemeKey, e.target.dataset.name);
      } else if (e.target.dataset.name == contextMenu[2].name) {
        this.newProjectDialogShow = true;
      } else if (e.target.dataset.parent === projectListMenu.name) {
        Store.$emit('projectChange', e.target.dataset.name);
        projectListMenu.focused = e.target.dataset.name;
      }
    }
  }
});

// restore theme
applyTheme(storeTheme || 'Light');

// prevent default context menu
document.oncontextmenu = e => {
  e.preventDefault();
};

// apply theme
document.getElementById('menu').onmousedown = e => {};

function applyTheme(themeName) {
  let themeObj = themesMenu.menu.find(item => item.name === themeName);
  if (!themeObj) return;
  themesMenu.focused = themeName;
  // Vue.set(app.contextMenu, 0, themesMenu);
  document.body.style.color = themeObj.fontColor;
  document.body.style.background = themeObj.bgColor;
}

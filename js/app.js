// menu definition
let themesMenu = {
  name: '颜色主题',
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
  focused: ''
};
let newProjectMenu = {
  name: '新建项目'
};
let delProjectMenu = {
  name: '删除项目'
};
// 上下文菜单，支持多级
let contextMenu = [newProjectMenu, projectListMenu, themesMenu, delProjectMenu];

const ThemeKey = 'quickNote_theme';
const storeTheme = window.localStorage.getItem(ThemeKey);

Vue.component('context-menu', {
  props: ['menu', 'parent', 'focused'],
  template: document.getElementById('context-menu').innerHTML
});
Vue.component('v-dialog', {
  props: ['show'],
  template: document.getElementById('dialog').innerHTML,
  watch: {
    show: function(newVal) {
      if (newVal) {
        this.$emit('onshow');
      }
    }
  }
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
  async mounted() {
    Store.$on('projectChange', projectName => {
      projectListMenu.focused = projectName;
    });
    // restore theme
    this.applyTheme(storeTheme || 'Light');
    // prevent default context menu
    document.oncontextmenu = e => {
      e.preventDefault();
    };
    // control menu display
    document.onmousedown = e => {
      if (e.button != 2) {
        this.menuShow = false;
      }
    };
    // menu display control
    document.getElementById('input').onmousedown = e => {
      if (e.button === 2) {
        this.menuShow = true;
        this.menuPosition.left = e.pageX + 'px';
        this.menuPosition.top = e.pageY + 'px';
      }
    };
    //restore project menu
    await this.restoreProjectMenu();
    // restore project select
    let currentListName = window.localStorage.getItem(lastListKey) || 'default';
    this.onProjectCreate(currentListName);
    this.$refs.newProjectInput.onkeyup = e => {
      if (e.keyCode === 13) {
        this.onNewProjectConfirm();
      }
    };
    Store.$on('projectDeleted', projectName => {
      projectListMenu.menu.splice(projectListMenu.menu.indexOf(projectName), 1);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.newProjectDialogShow) {
        this.newProjectDialogShow = false;
      }
    });
  },
  methods: {
    applyTheme(themeName) {
      let themeObj = themesMenu.menu.find(item => item.name === themeName);
      if (!themeObj) return;
      themesMenu.focused = themeName;
      // Vue.set(app.contextMenu, 0, themesMenu);
      document.body.style.color = themeObj.fontColor;
      document.body.style.background = themeObj.bgColor;
    },
    restoreProjectMenu() {
      return new Promise((res, rej) => {
        db.lists.toArray(lists => {
          lists.forEach(item => {
            projectListMenu.menu.push({
              name: item.name
            });
          });
          res();
        });
      });
    },
    onNewProjectConfirm() {
      this.newProjectDialogShow = false;
      if (this.newProjectName) {
        this.onProjectCreate(this.newProjectName);
        this.newProjectName = '';
      }
      let inputDom = document.getElementById('input');
      inputDom.focus();
    },
    onMenuSelect(e) {
      if (e.target.dataset.parent === themesMenu.name) {
        this.applyTheme(e.target.dataset.name);
        window.localStorage.setItem(ThemeKey, e.target.dataset.name);
      } else if (e.target.dataset.name === newProjectMenu.name) {
        this.newProjectDialogShow = true;
      } else if (e.target.dataset.parent === projectListMenu.name) {
        this.onProjectSelect(e.target.dataset.name);
      } else if (e.target.dataset.name === delProjectMenu.name) {
        this.onProjectDelete();
      }
    },
    onProjectSelect(projectName) {
      Store.$emit('projectChange', projectName);
    },
    onNewProjectDialogShow() {
      setTimeout(() => {
        this.$refs.newProjectInput.focus();
      }, 0);
    },
    onProjectCreate(projectName) {
      // 如果是新名称则
      if (!projectListMenu.menu.find(item => item.name === projectName)) {
        Store.$emit('projectCreate', projectName);
        projectListMenu.menu.push({
          name: projectName
        });
        projectListMenu.focused = projectName;
      } else {
        this.onProjectSelect(projectName);
      }
    },
    onProjectDelete() {
      Store.$emit('projectDelete');
    }
  }
});

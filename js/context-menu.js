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
// 上下文菜单，支持多级
let contextMenu = [newProjectMenu, projectListMenu, themesMenu];
export { newProjectMenu, themesMenu, projectListMenu, contextMenu };

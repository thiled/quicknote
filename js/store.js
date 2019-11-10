var Store = new Vue();
const lastListKey = 'lastList';

var db = new Dexie('Store');
var currentListName;
//如果store不存在，添加
db.version(1).stores({
  lists: 'name,content'
});
db.open().catch(function(err) {
  console.error(err.stack || err);
});
//如果name不存在,添加
function addListToDB(data) {
  return new Promise((res, rej) => {
    db.lists
      .where('name')
      .equals(data)
      .count()
      .then(async value => {
        if (!value) {
          await db.lists.add({
            name: data
          });
          res();
        } else {
          rej('项目已存在');
        }
      });
  });
}
// 从indexedDB获取数据
async function restoreData() {
  let data = await db.lists
    .where('name')
    .equals(currentListName)
    .toArray();
  if (data.length) {
    inputDom.innerHTML = data[0].content || '';
  }
}
// 修改保存数据
Store.$on('dataChange', data => {
  db.lists
    .where('name')
    .equals(currentListName)
    .modify({
      content: data
    });
});
//
Store.$on('projectCreate', async data => {
  try {
    await addListToDB(data);
    currentListName = data;
    window.localStorage.setItem(lastListKey, currentListName);
    inputDom.innerHTML = '';
  } catch (e) {
    console.log(e);
  }
});
//
Store.$on('projectChange', async data => {
  currentListName = data;
  window.localStorage.setItem(lastListKey, currentListName);
  restoreData();
});

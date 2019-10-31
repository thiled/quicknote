var Store = new Vue();
const lastListKey = 'lastList';
// restore
let currentListName = window.localStorage.getItem(lastListKey) || 'default';

var db = new Dexie('Store');

//如果store不存在，添加
db.version(1).stores({
  lists: 'name,content'
});
db.open().catch(function(err) {
  console.error(err.stack || err);
});
//如果name不存在,添加
db.lists
  .where('name')
  .equals(currentListName)
  .count()
  .then(value => {
    if (!value) {
      db.lists.add({
        name: currentListName
      });
    }
  });

// 从indexedDB获取数据
async function restoreData() {
  let data = await db.lists
    .where('name')
    .equals(currentListName)
    .toArray();
  if (data.length) {
    inputDom.innerHTML = data[0].content;
  }
}
restoreData();

// 修改保存数据
Store.$on('dataChange', data => {
  db.lists
    .where('name')
    .equals(currentListName)
    .modify({
      content: data
    });
});

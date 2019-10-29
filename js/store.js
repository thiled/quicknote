var Store = new Vue();
const lastListKey = 'lastList';
// restore
let lastListName = window.localStorage.getItem(lastListKey) || 'default';

// 从indexedDB获取数据
// if (storeData) inputDom.innerHTML = storeData;
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
  .equals(lastListName)
  .count()
  .then(value => {
    if (!value) {
      db.lists.add({
        name: lastListName
      });
    }
  });

//
Store.$on('dataChange', data => {
  db.lists
    .where('name')
    .equals(lastListName)
    .modify({
      content: data
    });
});

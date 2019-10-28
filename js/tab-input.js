const storeKey = 'quickNote';

class TabInput {
  static init(inputDom) {
    // restore
    let storeData = window.localStorage.getItem(storeKey);
    if (storeData) inputDom.innerHTML = storeData;
    // insert text node
    function insertRange(sel, str) {
      let range = sel.getRangeAt(0);
      let isCollapsed = sel.isCollapsed;
      // check multi lines
      if (str === '\t') {
        str = sel
          .toString()
          .split('\n')
          .map((value, index) => {
            return '\t' + value;
          })
          .join('\n');
        range.deleteContents();
      }

      let txtNode = document.createTextNode(str);
      range.insertNode(txtNode);
      range.setEndAfter(txtNode);
      if (isCollapsed) {
        range.setStartAfter(txtNode);
        sel.removeAllRanges();
      } else {
        range.setStartBefore(txtNode);
      }
      sel.addRange(range);
    }
    // remove tab
    function removeTab(sel) {
      let range = sel.getRangeAt(0);
      let isCollapsed = sel.isCollapsed;

      let str = sel
        .toString()
        .split('\n')
        .map((value, index) => {
          return value.replace(/^\t/, '');
        })
        .join('\n');
      range.deleteContents();

      let txtNode = document.createTextNode(str);
      range.insertNode(txtNode);
      range.setEndAfter(txtNode);
      if (isCollapsed) {
        range.setStartAfter(txtNode);
        sel.removeAllRanges();
      } else {
        range.setStartBefore(txtNode);
      }
      sel.addRange(range);
    }
    // init style
    inputDom.setAttribute('contenteditable', true);
    inputDom.style.whiteSpace = 'pre';
    //
    let lastLineTabs = '';
    let isEnterInput = false;
    //
    inputDom.addEventListener('keydown', e => {
      lastLineTabs = '';
      isEnterInput = false;
      let sel = document.getSelection();
      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          removeTab(sel);
        } else {
          insertRange(sel, '\t');
        }
        onInputChange();
      } else if (e.key === 'Enter') {
        // remember last line tabs
        isEnterInput = true;
        let lineText = sel.anchorNode.wholeText;
        if (lineText) {
          let match = lineText.match(/^\t+/);
          if (match) {
            let tabsNum = match[0].length;
            while (tabsNum > 0) {
              lastLineTabs += '\t';
              tabsNum--;
            }
          }
        }
      }
    });
    function onInputChange() {
      // store
      let storeData = inputDom.innerHTML;
      window.localStorage.setItem(storeKey, storeData);
    }
    //
    inputDom.addEventListener('input', e => {
      if (isEnterInput && lastLineTabs) {
        // repeat last line tabs
        let sel = document.getSelection();
        insertRange(sel, lastLineTabs);
      }
      onInputChange();
    });
  }
}

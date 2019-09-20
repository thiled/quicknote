const storeKey = 'quickNote';

class TabInput {
  static init(inputDom) {
    // restore
    let storeData = window.localStorage.getItem(storeKey);
    if (storeData) inputDom.innerHTML = storeData;
    // insert text node
    const insertRange = (sel, str) => {
      let range = sel.getRangeAt(0);
      range.deleteContents();
      let txtNode = document.createTextNode(str);
      range.insertNode(txtNode);
      range.setStartAfter(txtNode);
      range.setEndAfter(txtNode);
      sel.removeAllRanges();
      sel.addRange(range);
    };
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
        insertRange(sel, '\t');
      } else if (e.key === 'Enter') {
        // remember last line tabs
        isEnterInput = true;
        let lineText = sel.anchorNode.wholeText;
        if (lineText) {
          let match = lineText.match(/^(\t+)\w/);
          if (match) {
            let tabsNum = match[1].length;
            while (tabsNum > 0) {
              lastLineTabs += '\t';
              tabsNum--;
            }
          }
        }
      }
    });
    //
    inputDom.addEventListener('input', e => {
      if (isEnterInput && lastLineTabs) {
        // repeat last line tabs
        let sel = document.getSelection();
        insertRange(sel, lastLineTabs);
      }
      // store
      let storeData = inputDom.innerHTML;
      window.localStorage.setItem(storeKey, storeData);
    });
  }
}

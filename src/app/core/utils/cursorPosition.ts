export function getCursorPosition(element) {
  let caretOffset = 0;
  const doc = element.ownerDocument || element.document;
  const win = doc.defaultView || doc.parentWindow;
  let sel: { rangeCount: number; type: string; createRange: () => any };
  if (typeof win.getSelection !== 'undefined') {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      const range = win.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
      console.log('!!!!!');
    }
  } else if (sel === doc.selection && sel.type !== 'Control') {
    const textRange = sel.createRange();
    const preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint('EndToEnd', textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

export function setCursor(tag, pos) {
  // Creates range object
  var setpos = document.createRange();

  // Creates object for selection
  var set = window.getSelection();

  // Set start position of range
  setpos.setStart(tag.childNodes[0], pos);

  // Collapse range within its boundary points
  // Returns boolean
  setpos.collapse(true);

  // Remove all ranges set
  set.removeAllRanges();

  // Add range with respect to range object.
  set.addRange(setpos);

  // Set cursor on focus
  tag.focus();
}

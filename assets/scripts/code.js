// The contents of this file were taken from here: https://github.com/AleksandrHovhannisyan/aleksandrhovhannisyan.com/issues/35#issuecomment-2960039483
function initCodeCopy() {
  document.querySelectorAll('pre > code').forEach((codeblock) => {
    const container = codeblock.parentNode.parentNode;

    const copybutton = document.createElement('a');
    copybutton.classList.add('copy-code');
    copybutton.innerHTML = 'copy to clipboard';

    function copyingDone() {
      copybutton.innerHTML = 'copied!';
      setTimeout(() => {
        copybutton.innerHTML = 'copy to clipboard';
      }, 2000);
    }

    copybutton.addEventListener('click', (cb) => {
      if ('clipboard' in navigator) {
        navigator.clipboard.writeText(codeblock.textContent);
        copyingDone();
        return;
      }

      const range = document.createRange();
      range.selectNodeContents(codeblock);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        document.execCommand('copy');
        copyingDone();
      } catch (e) { };
      selection.removeRange(range);
    });

    if (container.classList.contains("highlight")) {
      container.appendChild(copybutton);
    } else if (container.parentNode.firstChild == container) {
      // td containing LineNos
    } else if (codeblock.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "TABLE") {
      // table containing LineNos and code
      codeblock.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(copybutton);
    } else {
        // code blocks not having highlight as parent class
      codeblock.parentNode.appendChild(copybutton);
    }
  });
}

document.addEventListener("DOMContentLoaded", initCodeCopy);
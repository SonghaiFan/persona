// paginate.js - Auto-pagination script for A4 pages
function autoPaginate() {
  const PAGE_SELECTOR = ".page";
  const book = document.getElementById("book");

  // Reset pagination - remove all pages except the first one
  resetPagination();

  const pageHeight = document.querySelector(PAGE_SELECTOR).clientHeight;
  [...document.querySelectorAll(PAGE_SELECTOR)].forEach(splitPage);

  function splitPage(page) {
    while (page.scrollHeight > pageHeight) {
      // 新建空白页
      const newPage = page.cloneNode(false);
      page.after(newPage);

      // 逐个把末尾节点移到新页，直到源页不再溢出
      while (page.scrollHeight > pageHeight && page.lastChild) {
        newPage.prepend(page.lastChild);
      }
      // 如果新页还是溢出，递归继续拆
      if (newPage.scrollHeight > pageHeight) splitPage(newPage);
    }
  }
}

function resetPagination() {
  const book = document.getElementById("book");
  const pages = book.querySelectorAll(".page");

  // Keep only the first page
  for (let i = 1; i < pages.length; i++) {
    pages[i].remove();
  }
}

// 在窗口resize时执行分页（初始分页由main.js调用）
window.addEventListener(
  "resize",
  debounce(() => {
    // Resize时短暂隐藏内容，避免闪动
    document.body.style.opacity = "0.7";
    autoPaginate();
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  }, 300)
);

// 防抖函数，避免频繁执行
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

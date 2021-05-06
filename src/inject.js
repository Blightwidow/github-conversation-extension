let OPTIONS = {
  sort: "top",
  collapse: true,
};

function isDiscussion() {
  return !!window.location.pathname.match(/discussions\/[0-9]+/);
}

function addThreadHandlers() {
  if (!isDiscussion()) return;

  const answerElements = document.querySelectorAll(
    ".js-timeline-progressive-focus-container"
  );

  answerElements.forEach((parent) => {
    const threadElement = parent.querySelector("[data-child-comments]");
    const inputElement = parent.querySelector(".review-thread-reply-button");
    const toggleElement = document.createElement("p");
    const expandThread = () => {
      threadElement.classList.remove("collapse");
      toggleElement.textContent = "Collapse this thread";
    };
    const collapseThread = () => {
      threadElement.classList.add("collapse");
      toggleElement.textContent = "Expand this thread";
    };

    toggleElement.textContent = "Expand this thread";
    toggleElement.className = "expand-button";
    toggleElement.addEventListener("click", () => {
      threadElement.classList.contains("collapse")
        ? expandThread()
        : collapseThread();
    });
    inputElement.addEventListener("click", () => expandThread());

    threadElement.appendChild(toggleElement);

    if (OPTIONS.collapse) {
      collapseThread();
    }
  });
}

function useDefaultSort() {
  if (!isDiscussion()) return;
  const queryParams = new URLSearchParams(window.location.search.slice(1));

  if (OPTIONS.sort !== "none" && !queryParams.get("sort")) {
    window.location.replace(`${window.location.pathname}?sort=${OPTIONS.sort}`);
  }
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      sort: "top",
      collapse: true,
    },
    (options) => {
      OPTIONS = options;
    }
  );
}

let prevPath = ""
const POLLING_RATE = 1000 // 1s

function pollURLChange() {
  if (prevPath !== window.location.pathname) {
    prevPath = window.location.pathname;
    requestAnimationFrame(addThreadHandlers);
    requestAnimationFrame(useDefaultSort);
  }

  setTimeout(pollURLChange, POLLING_RATE);
}

restoreOptions();
requestAnimationFrame(pollURLChange);

function saveOptions() {
  var sort = document.getElementById("sort").value;
  var collapse = document.getElementById("collapse").checked;
  chrome.storage.sync.set(
    {
      sort,
      collapse,
    },
    () => {
      var status = document.getElementById("status");
      status.textContent = "Options saved.";

      setTimeout(function () {
        status.textContent = "";
      }, 750);
    }
  );
}

function restoreOptions() {
  document.getElementById("save").addEventListener("click", saveOptions);

  chrome.storage.sync.get(
    {
      sort: "top",
      collapse: true,
    },
    function (items) {
      document.getElementById("sort").value = items.sort;
      document.getElementById("collapse").checked = items.collapse;
    }
  );
}

document.addEventListener("DOMContentLoaded", restoreOptions);

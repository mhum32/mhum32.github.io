function applyCss(d, styles) {
  for (const [key, value] of Object.entries(styles)) d.style[key] = value;
}

if (document.location.hostname === chrome.runtime.id) {
  setupPromo();
} else {
  chrome.storage.local.get("hostnames", (data) => {
    if (!data.hostnames) {
      data.hostnames = document.location.hostname;
      setupPromo();
      chrome.storage.local.set({ hostnames: data.hostnames });
    } else {
      if (data.hostnames.indexOf(document.location.hostname) > -1) {
        return;
      } else {
        data.hostnames = data.hostnames + "," + document.location.hostname;
        chrome.storage.local.set({ hostnames: data.hostnames });
        setupPromo();
      }
    }
  });
}

function setupPromo() {
  setTimeout(async () => {
    const r = await fetch(
      "https://gamestabs.com/ext/img/promo.php?id=" + chrome.runtime.id,
      {
        method: "GET",
        cache: "no-cache",
        mode: "cors",
      }
    );
    const data = await r.json();
    if (data && data.url && data.img) {
      const img = document.createElement("IMG");
      img.addEventListener("load", () => {
        const a = document.body.appendChild(document.createElement("a"));
        const closePromo = () => {
          setTimeout(() => {
            document.body.removeChild(a);
          });
        };
        a.setAttribute("href", data.url);
        a.style.backgroundImage = 'url("' + data.img + '")';
        a.setAttribute("target", "_blank");
        applyCss(a, {
          margin: "0",
          padding: "0",
          content: '""',
          display: "block",
          width: "728px",
          height: "90px",
          position: "fixed",
          bottom: "0",
          left: "0",
        });
        a.classList.add("promo");
        const close = document.createElement("span");
        a.appendChild(close);
        applyCss(close, {
          margin: "0",
          padding: "0",
          content: '""',
          display: "block",
          width: "17px",
          height: "17px",
          background: "transparent",
          float: "right",
        });
        close.setAttribute("title", "Close");
        a.addEventListener("click", (e) => {
          if (e.target.tagName === "SPAN") {
            e.preventDefault();
            closePromo();
            return !1;
          }
          closePromo();
          return !0;
        });
      });
      img.setAttribute("src", data.img);
    }
  });
}

const stops = Array.from(document.querySelectorAll(".stop"));
const scenes = Array.from(document.querySelectorAll(".scene"));
const stopMenu = document.querySelector(".tour-menu");

function showStop(selected) {
  for (const stop of stops) {
    const active = stop === selected;
    stop.setAttribute("aria-selected", String(active));
    stop.tabIndex = active ? 0 : -1;
    stop.classList.toggle("current", active);
  }
  for (const scene of scenes) {
    scene.hidden = scene.id !== selected.getAttribute("aria-controls");
  }
}

stopMenu.setAttribute("role", "tablist");
for (const [index, stop] of stops.entries()) {
  const scene = document.getElementById("screen-" + stop.dataset.stop);
  stop.id = "stop-" + stop.dataset.stop;
  stop.setAttribute("role", "tab");
  stop.setAttribute("aria-controls", scene.id);
  scene.setAttribute("role", "tabpanel");
  scene.setAttribute("aria-labelledby", stop.id);
  stop.addEventListener("click", event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showStop(stop);
  });
  stop.addEventListener("keydown", event => {
    let next;
    switch (event.key) {
      case "ArrowDown": case "ArrowRight": next = (index + 1) % stops.length; break;
      case "ArrowUp": case "ArrowLeft": next = (index + stops.length - 1) % stops.length; break;
      case "Home": next = 0; break;
      case "End": next = stops.length - 1; break;
      case " ": event.preventDefault(); showStop(stop); return;
      default: return;
    }
    event.preventDefault();
    showStop(stops[next]);
    stops[next].focus();
  });
}
function showLinkedStop() {
  const linked = stops.find(stop => stop.hash === location.hash);
  if (linked) showStop(linked);
}
showStop(stops[0]);
showLinkedStop();
window.addEventListener("hashchange", showLinkedStop);
document.body.classList.add("enhanced");

const covers = document.getElementById("covers");
function updatePullExample() {
  const headcount = Number(covers.value);
  document.getElementById("expected-covers").textContent = headcount.toLocaleString();
  document.getElementById("portions").value = Math.ceil(headcount * 105 / 100).toLocaleString();
}
covers.addEventListener("input", updatePullExample);
updatePullExample();

const viewer = document.getElementById("viewer");
const enlargedImage = document.getElementById("viewer-img");
if (typeof viewer.showModal === "function") {
  for (const link of document.querySelectorAll(".screen")) {
    link.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const img = link.querySelector("img");
      enlargedImage.src = link.href;
      enlargedImage.alt = img.alt;
      document.getElementById("viewer-title").textContent = link.closest("article").querySelector("h3").textContent;
      viewer.showModal();
    });
  }
  document.getElementById("close-viewer").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", event => {
    if (event.target !== viewer) return;
    const box = viewer.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) viewer.close();
  });
}

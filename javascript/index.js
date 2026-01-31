/* ======================
   HERO SLIDER (əgər varsa)
====================== */
const slides = document.querySelectorAll(".slide");
let slideIndex = 0;

if (slides.length > 0) {
  setInterval(() => {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }, 3000);
}

/* ======================
   PRODUCT SLIDERS
====================== */
document.querySelectorAll(".cards-side.slider").forEach(slider => {
  const track = slider.querySelector(".product-cards");
  const viewport = slider.querySelector(".products-slider");
  const nextBtn = slider.querySelector(".btn.next");
  const prevBtn = slider.querySelector(".btn.prev");
  const jsonUrl = slider.dataset.json;

  if (!track || !viewport || !nextBtn || !prevBtn || !jsonUrl) return;

  let x = 0;

  /* ===== FETCH ===== */
  fetch(jsonUrl)
    .then(res => {
      if (!res.ok) throw new Error("JSON tapılmadı");
      return res.json();
    })
    .then(products => {
      track.innerHTML = "";
      x = 0;
      track.style.transform = "translateX(0px)";

      products.forEach(p => {
        track.innerHTML += `
          <div class="product-card">
            ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}

            <img src="${p.image}" alt="${p.name}">

            <h3>${p.name}</h3>

            <div class="price">
              <span class="new">${p.price} ₼</span>
              ${p.oldPrice ? `<span class="old">${p.oldPrice} ₼</span>` : ""}
            </div>

            <div class="quantity">
              <button class="minus">−</button>
              <span class="count">1</span>
              <button class="plus">+</button>
            </div>

            <button class="add-cart">🛒 Səbətə At</button>
          </div>
        `;
      });

      initQuantity(slider);
    })
    .catch(err => console.error("JSON xətası:", err));

  /* ===== SLIDER LOGIC ===== */
  const step = () => {
    const card = track.querySelector(".product-card");
    return card ? card.offsetWidth + 20 : 0;
  };

  nextBtn.onclick = () => {
    const max = track.scrollWidth - viewport.offsetWidth;
    x -= step();
    if (Math.abs(x) > max) x = -max;
    track.style.transform = `translateX(${x}px)`;
  };

  prevBtn.onclick = () => {
    x += step();
    if (x > 0) x = 0;
    track.style.transform = `translateX(${x}px)`;
  };
});

/* ======================
   QUANTITY (+ / -)
====================== */
function initQuantity(scope) {
  scope.querySelectorAll(".quantity").forEach(qty => {
    const minus = qty.querySelector(".minus");
    const plus = qty.querySelector(".plus");
    const count = qty.querySelector(".count");

    minus.onclick = () => {
      let v = +count.textContent;
      if (v > 1) count.textContent = v - 1;
    };

    plus.onclick = () => {
      count.textContent = +count.textContent + 1;
    };
  });
}

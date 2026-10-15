/* =====================================================
   PIZZARIA IMPÉRIO – configurações fáceis de editar
   ===================================================== */
const CONFIG = {
  // Número com código do país + DDD, só dígitos. Ex.: 5577999999999
  whatsapp: "5577997013749",
  phoneDisplay: "(77) 99701-3749",
  defaultMessage: "Olá, Pizzaria Império! Gostaria de fazer um pedido"
};

/* ---------- Cardápio (valores de exemplo) ---------- */
/* Para usar foto real: coloque o arquivo na pasta "images" e escreva o nome COM a extensão
   no campo img. Exemplo: img: "calabresa.jpg". Sem extensão, usa a ilustração (.svg). */
const MENU = {
  pizzas: [
    { name: "Império", img: "pizza-imperio", tag: "Da casa", price: "59,90", desc: "Mussarela, calabresa, bacon, cheddar e azeitonas." },
    { name: "Calabresa", img: "pizza-calabresa", price: "46,90", desc: "Calabresa fatiada, cebola e mussarela." },
    { name: "Mussarela", img: "pizza-mussarela", price: "42,90", desc: "Mussarela cremosa, tomate e orégano." },
    { name: "Portuguesa", img: "pizza-portuguesa", price: "52,90", desc: "Presunto, ovos, cebola, ervilha e mussarela." },
    { name: "Frango com Catupiry", img: "pizza-frango", tag: "Campeã", price: "54,90", desc: "Frango desfiado temperado com catupiry." },
    { name: "Quatro Queijos", img: "pizza-quatro-queijos", price: "56,90", desc: "Mussarela, provolone, parmesão e catupiry." },
    { name: "Margherita", img: "pizza-margherita", price: "48,90", desc: "Mussarela, tomate fresco e manjericão." },
    { name: "Chocolate com Morango", img: "pizza-chocolate-morango", tag: "Doce", price: "49,90", desc: "Chocolate ao leite cremoso com morangos." }
  ],
  esfihas: [
    { name: "Esfiha de Carne", img: "esfiha-carne", tag: "Clássica", price: "5,50", desc: "Carne temperada com tomate e cebola." },
    { name: "Esfiha de Queijo", img: "esfiha-queijo", price: "5,50", desc: "Queijo derretido e orégano." },
    { name: "Esfiha de Calabresa", img: "esfiha-calabresa", price: "5,90", desc: "Calabresa com queijo e cebola." },
    { name: "Esfiha de Frango", img: "esfiha-frango", price: "5,90", desc: "Frango desfiado com catupiry." },
    { name: "Esfiha Império", img: "esfiha-imperio", tag: "Da casa", price: "7,50", desc: "Carne, queijo, bacon e cheddar." },
    { name: "Esfiha de Chocolate", img: "esfiha-chocolate", tag: "Doce", price: "6,50", desc: "Chocolate cremoso, sobremesa perfeita." }
  ],
  burgers: [
    { name: "Clássico", img: "burger-classico", price: "24,90", desc: "Blend artesanal, queijo, alface, tomate e maionese da casa." },
    { name: "X-Bacon", img: "burger-x-bacon", tag: "Favorito", price: "28,90", desc: "Blend artesanal, queijo, bacon crocante e molho especial." },
    { name: "Império Burger", img: "burger-imperio", tag: "Da casa", price: "34,90", desc: "Dois blends, cheddar, bacon, cebola caramelizada e molho Império." },
    { name: "Cheddar Melt", img: "burger-cheddar-melt", price: "29,90", desc: "Blend artesanal coberto de cheddar cremoso." },
    { name: "Frango Crispy", img: "burger-frango-crispy", price: "26,90", desc: "Frango empanado crocante, queijo e maionese temperada." }
  ]
};

/* ---------- Utilidades ---------- */
const waLink = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Links do WhatsApp ---------- */
function setupWhatsApp() {
  $$("[data-wa]").forEach(a => {
    a.href = waLink(a.dataset.msg || CONFIG.defaultMessage);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $("#phoneText").textContent = CONFIG.phoneDisplay;
  $("#year").textContent = new Date().getFullYear();
}

/* ---------- Render do cardápio ---------- */
const grid = $("#menuGrid");
function renderMenu(cat) {
  grid.innerHTML = "";
  const labels = { pizzas: "Pizza", esfihas: "Esfiha", burgers: "Hambúrguer" };
  MENU[cat].forEach((item, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${i * 70}ms`;
    const unit = cat === "esfihas" ? "a unidade" : cat === "pizzas" ? "a partir de (grande)" : "unidade";
    const isPhoto = item.img.includes(".");
    const src = isPhoto ? item.img : item.img + ".svg";
    card.innerHTML = `
      <div class="card-img ${isPhoto ? "photo" : ""}">
        ${item.tag ? `<span class="tag">${item.tag}</span>` : ""}
        <img src="images/${src}" alt="${item.name}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="card-foot">
          <div class="price"><small>${unit}</small>R$ ${item.price}</div>
          <button class="btn-order" type="button">Pedir</button>
        </div>
      </div>`;
    $(".btn-order", card).addEventListener("click", () => {
      const msg = `Olá! Quero pedir: ${labels[cat]} ${item.name}`;
      window.open(waLink(msg), "_blank", "noopener");
    });
    addTilt(card);
    grid.appendChild(card);
  });
}

/* ---------- Abas com indicador animado ---------- */
const tabs = $$(".tab");
const indicator = $("#indicator");
function moveIndicator(btn) {
  indicator.style.width = btn.offsetWidth + "px";
  indicator.style.left = btn.offsetLeft + "px";
  indicator.style.top = btn.offsetTop + "px";
  indicator.style.height = btn.offsetHeight + "px";
}
tabs.forEach(btn => btn.addEventListener("click", () => {
  tabs.forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  moveIndicator(btn);
  renderMenu(btn.dataset.cat);
}));
window.addEventListener("resize", () => moveIndicator($(".tab.active")));

/* ---------- Efeito tilt 3D nos cards ---------- */
function addTilt(card) {
  if (window.matchMedia("(hover: none)").matches) return;
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
}

/* ---------- Reveal ao rolar ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
  });
}, { threshold: .15 });
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
  io.observe(el);
});

/* ---------- Nav: scroll, progresso, menu mobile ---------- */
const nav = $("#nav"), progress = $("#progress"), burger = $("#burger"), links = $("#navLinks");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  const h = document.documentElement;
  progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  links.classList.toggle("open");
});
$$("a", links).forEach(a => a.addEventListener("click", () => {
  burger.classList.remove("open");
  links.classList.remove("open");
}));

/* ---------- Itens flutuantes no hero ---------- */
(function floaties() {
  const box = $("#floaties");
  const imgs = ["pizza-calabresa", "burger-classico", "esfiha-carne", "pizza-margherita", "burger-x-bacon", "esfiha-queijo", "pizza-imperio", "burger-frango-crispy"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("img");
    s.className = "floaty";
    s.src = `images/${imgs[i % imgs.length]}.svg`;
    s.alt = "";
    s.setAttribute("aria-hidden", "true");
    s.style.left = Math.random() * 100 + "%";
    s.style.width = 34 + Math.random() * 40 + "px";
    s.style.animationDuration = 14 + Math.random() * 16 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    box.appendChild(s);
  }
})();

/* ---------- Parallax suave na pizza ---------- */
const art = $(".hero-art");
window.addEventListener("mousemove", e => {
  if (!art || window.scrollY > window.innerHeight) return;
  const x = (e.clientX / window.innerWidth - .5) * 18;
  const y = (e.clientY / window.innerHeight - .5) * 18;
  art.style.transform = `translate(${x}px, ${y}px)`;
});

/* ---------- Início ---------- */
setupWhatsApp();
renderMenu("pizzas");
window.addEventListener("load", () => moveIndicator($(".tab.active")));
document.fonts && document.fonts.ready.then(() => moveIndicator($(".tab.active")));

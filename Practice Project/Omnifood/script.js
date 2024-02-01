// update copyright current year
const year = document.querySelector(".year");
const currentYear = new Date().getFullYear();
// console.log(currentYear);
year.textContent = currentYear;
///////////////////////////////////////////////////////////
// Make mobile navigation bar works
const groupMobileBtn = document.querySelector(".btn-mobile-nav");
const header = document.querySelector(".header");
groupMobileBtn.addEventListener("click", () => {
  header.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// TO SCROLL SMOOTHLY ON ALL DEVICE
const allLinks = document.querySelectorAll("a:link");
allLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const href = link.getAttribute("href");
    //scroll to the top
    if (href === "#") {
      window.scrollTo({
        top: 20,
        behavior: "smooth",
      });
    }
    //scroll into each section
    if (href !== "#" && href.startsWith("#")) {
      const selectedLink = document.querySelector(href);
      selectedLink.scrollIntoView({ behavior: "smooth" });
    }
    //close the mobil menu bar after scrolling
    if (link.classList.contains("nav-items"))
      header.classList.toggle("nav-open");
  });
});
//////////////////////////////////////////////////////////
// TO STICK THE NAV BAR WHILE SCROLLING
const sectionHero = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    console.log(ent);

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }
    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    //in the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);
obs.observe(sectionHero);
///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

// https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js

/*

*/

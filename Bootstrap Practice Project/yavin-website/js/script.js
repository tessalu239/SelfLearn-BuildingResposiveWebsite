function userScroll() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-sticky");
    } else {
      navbar.classList.remove("navbar-sticky");
    }
  });
}

function increaseStats() {
  //Select all class counter
  const counters = document.querySelectorAll(".counter");

  //Loop: set each to 0
  counters.forEach((counter) => {
    counter.innerText = 0;

    //which has variable target = whatever in data-target, c= whatever counter currently, increment= target/200. If c<target->counter text= roundup (c+increment), time to do, 1. else c text=target
    const updateCounter = () => {
      const target = +counter.getAttribute("data-target");
      const c = +counter.innerText;

      const increment = target / 200;

      if (c < target) {
        counter.innerText = Math.ceil(c + increment);
        setTimeout(updateCounter, 5);
      } else {
        counter.innerText = target;
      }
    };
    //call updateCounter()
    updateCounter();
  });
}
document.addEventListener("DOMContentLoaded", userScroll);
document.addEventListener("DOMContentLoaded", increaseStats);

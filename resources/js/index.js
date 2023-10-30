let accordionCount = 0;
init();

function generateCarouselItem(item, index) {
  console.log(item);
  var pubDate = new Date(item.pubDate);
  pubDate = pubDate.getDate()+'/'+(pubDate.getMonth()+1)+'/'+(String)(pubDate.getFullYear()).slice(-2);
  const carouselItem = document.createElement("div");
  carouselItem.classList = "carousel-item" + (!index ? " active" : '');
  carouselItem.innerHTML = `
  <a href="${item.link}">
    <img src="${item.enclosure.link}" alt="${item.title}" class="img-fluid news-board-img">
    <div class="m-5">
      <h3>${item.title}</h3>
      <h6 class="mb-2 text-muted">${item.author} • ${pubDate}</h6>
      <p>${item.description}</p>
    </div>
  </a>`
  return carouselItem;
}

function generateCarouselInDOM(id, data) {
    const carousel = document.createElement("div");
    carousel.classList = "carousel carousel-dark slide news-board";
    carousel.id = "carousel-" + id;
    carousel.setAttribute("data-bs-ride", "carousel");

    const slides = document.createElement("div");
    slides.classList = "carousel-inner";

    data.items.forEach((item, index) => {
      slides.append(generateCarouselItem(item, index));
    });

    const prev = document.createElement("button");
    const next = document.createElement("button");
    prev.classList = "news-board-control news-board-control-left";
    next.classList = "news-board-control news-board-control-right";
    prev.setAttribute("type", "button");
    next.setAttribute("type", "button");
    prev.setAttribute("data-bs-target", "#carousel-" + id);
    next.setAttribute("data-bs-target", "#carousel-" + id);
    prev.setAttribute("data-bs-slide", "prev");
    next.setAttribute("data-bs-slide", "next");
    prev.innerHTML = `
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>`;
    next.innerHTML = `
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>`;
    
    carousel.append(prev);
    carousel.append(slides);
    carousel.append(next);
    document.getElementById("collapse-accordionItem-" + id).append(carousel);
}

function createAccordionItemInDOM(data) {
    const accordionItem = document.createElement("div");
    accordionItem.classList = "accordion-item";
    accordionItem.id = "accordionItem-" + ++accordionCount;
    accordionItem.innerHTML = `
    <div class="accordion-item">
        <h6 class="accordion-header" id="heading-${accordionItem.id}">
            <button
                class="accordion-button-custom text-muted fw-semibold${accordionCount===1 ? '' : " collapsed"}" 
                type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse-${accordionItem.id}"
                aria-expanded="true"
                aria-controls="collapse-${accordionItem.id}"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
              ${data.feed.title}
            </button>
        </h6>
        <div
            id="collapse-${accordionItem.id}"
            class="accordion-collapse collapse${accordionCount===1 ? " show" : ''}"
            aria-labelledby="heading-${accordionItem.id}"
            data-bs-parent="#accordion"
        >
        </div>
    </div>`;
    document
      .getElementById("accordion")
      .append(accordionItem);
    generateCarouselInDOM(accordionCount, data);
}

function init() {
  magazines.forEach(async (item) => {
    const res = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURI(item)
    );
    createAccordionItemInDOM(await res.json());
  });
}

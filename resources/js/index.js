init();
let accordionCount = 0;

function generateCarouselItem(item, index) {
  console.log(item);
  var pubDate = new Date(item.pubDate);
  pubDate = pubDate.getDate()+'/'+pubDate.getMonth()+'/'+(String)(pubDate.getFullYear()).slice(-2);
  const carouselItem = document.createElement("div");
  carouselItem.classList = "carousel-item" + (!index ? " active" : '');
  carouselItem.innerHTML = `
  <img src="${item.enclosure.link}" alt="${item.title}" class="img-fluid">
  <div class="m-5">
    <h3>${item.title}</h3>
    <h6 class="mb-2 text-muted">${item.author} • ${pubDate}</h6>
    <p>${item.description}</p>
  </div>`
  return carouselItem;
}

function generateCarouselInDOM(id, data) {
    const carousel = document.createElement("div");
    carousel.classList = "carousel slide";
    carousel.id = "carousel-" + id;
    carousel.setAttribute("data-bs-ride", "carousel");

    const slides = document.createElement("div");
    slides.classList = "carousel-inner";

    data.items.forEach((item, index) => {
      slides.append(generateCarouselItem(item, index));
    });

    carousel.append(slides);
    document.getElementById("collapse-accordionItem-" + id).append(carousel);
}

function createAccordionItemInDOM(data) {
    const accordionItem = document.createElement("div");
    accordionItem.classList = "accordion-item";
    accordionItem.id = "accordionItem-" + ++accordionCount;
    accordionItem.innerHTML = `
    <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${accordionItem.id}">
            <button
                class="accordion-button${accordionCount===1 ? '' : " collapsed"}" 
                type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse-${accordionItem.id}"
                aria-expanded="true"
                aria-controls="collapse-${accordionItem.id}"
            >
                ${data.feed.title}
            </button>
        </h2>
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

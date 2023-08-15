fetch("https://dummyjson.com/products")
  .then((response) => response.json())
  .then((result) => result.products)
  .then(function (prod) {
    products.push(...prod);
    return fillItems(prod);
  });

let products = [];

function fillItems(products) {
  const items = document.querySelector("#items");

  for (const item of products) {
    const image = document.createElement("img");
    image.classList.add("card-image");
    image.src = item.thumbnail;

    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = item.title;

    const description = document.createElement("div");
    description.textContent = item.description;

    const titleAndDescription = document.createElement("div");
    titleAndDescription.append(title, description);

    const price = document.createElement("div");
    price.textContent = `Price ${item.price}$ `;

    const rating = document.createElement("div");
    rating.textContent = `Rating ${item.rating}`;

    const priceAndRatingContainer = document.createElement("div");
    priceAndRatingContainer.classList.add("price-and-rating-container");

    priceAndRatingContainer.append(price, rating);

    const addButton = document.createElement("button");
    addButton.textContent = "Add to cart";
    addButton.classList.add("card-button");
    addButton.setAttribute("id", "card-button");
    addButton.onclick = () => {
      addItemToCart(item);
    };

    const container = document.createElement("div");
    container.append(priceAndRatingContainer, addButton);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.append(titleAndDescription, container);

    const card = document.createElement("div");
    card.classList.add("card");

    card.append(image, cardBody);

    items.append(card);
  }
}

window.onload = () => {
  let popup = document.getElementById("popup");
  let popupToggle = document.getElementById("cart");
  let popupClose = document.querySelector(".close");

  popupToggle.onclick = function () {
    popup.style.display = "flex";
  };
  popupClose.onclick = function () {
    popup.style.display = "none";
  };

  let input = document.querySelector("#search");

  let searchButton = document.getElementById('search-button');
  searchButton.onclick = function() {
    let value = input.value.trim().toUpperCase();
    let list = document.querySelectorAll(".items .card");
    if (value) {
      list.forEach((elem) => {
        if (elem.innerText.toUpperCase().search(value) === -1) {
          elem.classList.add("hide");
        } else {
          elem.classList.remove("hide");
        }
      });
    } else {
      list.forEach((elem) => {
        elem.classList.remove("hide");
      });
    }
  };
};

let priceNum = 0;
function addCartPrice(price) {
  priceNum = priceNum + price;
  renderPrice(priceNum);
}

function renderPrice(price) {
  let pricetext = document.querySelector("#price");
  let orderSum = document.querySelector("#order-sum")
  pricetext.textContent = `${price}.00$`;
  orderSum.textContent = `${price}.00$`;
}
function removeCartPrice(price) {
  priceNum = priceNum - price;
  renderPrice(priceNum);
}

let cartItems = {};
function addItemToCart(item) {

  addCartPrice(item.price);
    let id = item.id;
    if (cartItems[id] != undefined) ++cartItems[id];
    else cartItems[id] = 1;

  fillPopup(cartItems);
}
function removeItemFromCart(item, removeAll = false) {
  let id = item.id;
  if (removeAll)
  {

    delete cartItems[id];
  }
  else{
    if(cartItems[id] > 1)
    --cartItems[id];
  }
  fillPopup(cartItems);
}

function fillPopup(cartItems) {
  const cart = document.querySelector("#popup-body-items");
  cart.replaceChildren();
  const emptyOrder = document.querySelector("#empty-order");
  const orderButton = document.querySelector("#order")

  if (Object.keys(cartItems).length === 0) {
    
    emptyOrder.classList.remove("hide");
 
    orderButton.style.color = "background: dodgerblue";
    
    
  } else {
    orderButton.removeAttribute('disabled', '', );
    emptyOrder.classList.add("hide");
    
  }

  for (const id in cartItems) {
    const item = products.find((e) => e.id == id);
    let itemsCount = cartItems[id];

    const image = document.createElement("img");
    image.classList.add("item-image");
    image.src = item.thumbnail;

    const title = document.createElement("div");
    title.classList.add("item-title");
    title.textContent = item.title;

    const addAmountbutton = document.createElement("button");
    addAmountbutton.classList.add("add-amount-button");
    addAmountbutton.textContent = "+";
    addAmountbutton.onclick = () => {
      addItemToCart(item)
    };

    const amount = document.createElement("div");
    amount.classList.add("item-amount");
    amount.textContent = `${itemsCount} x ${item.price}`;

    const removeAmountbutton = document.createElement("button");
    removeAmountbutton.classList.add("remove-amount-button");
    removeAmountbutton.textContent = "-";
    removeAmountbutton.onclick = () => {
      removeItemFromCart(item);
    };

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");
    removeButton.textContent = "Remove from order";
    removeButton.onclick = () => {
      removeItemFromCart(item, true);
    };

    const card = document.createElement("div");
    card.classList.add("item");

    card.append(image, title, addAmountbutton, amount, removeAmountbutton, removeButton);

    cart.append(card);
  }
}

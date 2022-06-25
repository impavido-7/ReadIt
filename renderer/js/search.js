const search = document.getElementById("search");

const items = require("./items");

search.addEventListener("keyup", e => {
    const value = search.value;
    let result;
    if (value) {
        result = items.totalItems.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
    }
    else {
        result = items.totalItems;
    }
    items.toggleItemContainer(result);
    items.initialization();
    items.setUI(result);
});
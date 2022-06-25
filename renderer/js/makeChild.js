const { shell, ipcRenderer } = require("electron");

const moveChildToRead = () => {
    const element = document.querySelector(".selected");
    if (element.parentElement.parentElement.id === "unread") {
        const parent = document.getElementById("unread");
        const children = parent.children;

        let i;
        for (i = 1; i < children.length; i++) {
            const ele = children[i].children[0];
            if (ele.classList.contains("selected"))
                break;
        }
        ipcRenderer.send("make-item-read", i);
    }

}

exports.openItem = (url) => {
    shell.openExternal(url);
    moveChildToRead();
}

exports.makeChild = (item, domElement, atStart = false) => {

    if (domElement.style.display == "none") {
        domElement.style.display = "block";
    }
    const parent = document.createElement("div");
    parent.classList.add("display-flex");

    const containerDivForImgAndTitle = document.createElement("div");
    containerDivForImgAndTitle.setAttribute("class", "read-item");
    containerDivForImgAndTitle.setAttribute("data-url", item.url);

    if (!document.querySelector(".selected")) {
        containerDivForImgAndTitle.classList.add("selected");
    }

    containerDivForImgAndTitle.addEventListener("click", e => {
        document.querySelector(".selected").classList.remove("selected");
        containerDivForImgAndTitle.classList.add("selected");
    });

    containerDivForImgAndTitle.addEventListener("dblclick", e => {
        this.openItem(item.url);
    });

    const image = document.createElement("img");
    image.src = item.screenshot;
    containerDivForImgAndTitle.appendChild(image);

    const h2 = document.createElement("h2");
    h2.innerText = item.title;
    containerDivForImgAndTitle.appendChild(h2);

    parent.appendChild(containerDivForImgAndTitle);

    if (atStart) {
        if (domElement.children.length > 1) {
            domElement.insertBefore(parent, domElement.children[1]);
        }
        else {
            domElement.appendChild(parent);
        }
    }
    else {
        domElement.appendChild(parent);
    }
}

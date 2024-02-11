const SUCCESS_POPUP_DURATION = 2000;
const sayingsContainer = document.getElementById("sayings_container");
let sayings = undefined;
let successPopupVisible = false;

const createSayingElement = (key, saying, transliteration, translation, symbol) => {
    const container = document.createElement("div");
    container.classList.add("saying_container");
    container.id = key;
    container.innerHTML = `
                    <div class="successful" id="successful_${key}">
                        Successfully copied to clipboard!
                    </div>
                    <div class="hover_container" id="hover_${key}">
                        <div class="transliteration">Transliteration: ${transliteration}</div>
                        <div class="translation">Translation: ${translation}</div>
                    </div>
                    <div class="item_container ${symbol ? "symbol" : ""}">
                    ${saying}
                    </div>`;
    container.addEventListener("mouseover", () => {
        if (successPopupVisible) return;
        const hoverContainer = document.getElementById(`hover_${key}`);
        hoverContainer.classList.add("visible");
    })
    container.addEventListener("mouseout", () => {
        const successContainer = document.getElementById(`successful_${key}`);
        const hoverContainer = document.getElementById(`hover_${key}`);
        hoverContainer.classList.remove("visible");
        successContainer.classList.remove("visible");
        successPopupVisible = false;

    })
    container.addEventListener("click", async () => {
        try {
            const successContainer = document.getElementById(`successful_${key}`);
            const hoverContainer = document.getElementById(`hover_${key}`);
            await navigator.clipboard.writeText(saying);
            hoverContainer.classList.remove("visible");
            successContainer.classList.add("visible");
            successPopupVisible = true;
            setTimeout(() => {
                successContainer.classList.remove("visible");
                successPopupVisible = false;
            }, SUCCESS_POPUP_DURATION);
        } catch (error) {
            console.log(error);
        }
    })
    return container;
}

const getSayings = async () => {
    if(!sayings){
        const response = await fetch("./sayings.json");
        sayings = await response.json();
    }
    sayings.forEach(element => {
        sayingsContainer.append(createSayingElement(element.key, element.saying, element.transliteration, element.translation, element.symbol));
    });
}

const setupSearchBar = () => {
    const searchBar = document.getElementById("search_bar");
    searchBar.addEventListener("input", (e) => {
        const searchValue = e.target.value.toLowerCase();
        if (!searchValue.length || !searchValue.trim().length) getSayings();
        while (sayingsContainer.hasChildNodes()) {
            sayingsContainer.removeChild(sayingsContainer.firstChild);
        }
        sayings.forEach(element => {
            if (element.saying.indexOf(searchValue) >= 0 || element.transliteration.toLowerCase().indexOf(searchValue) >= 0 || element.translation.toLowerCase().indexOf(searchValue) >= 0) sayingsContainer.append(createSayingElement(element.key, element.saying, element.transliteration, element.translation));
        });
    })
}

getSayings();
setupSearchBar();
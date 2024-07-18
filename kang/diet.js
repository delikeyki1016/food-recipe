const API_KEY = "4ea57cfaa61b4f4c95c3";
const originAddress = `https://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/json`;
let arrRecipe = [];

const getRecipe = async () => {
    const firstItem = 1;
    const lastItem = 8;
    const listAddress = originAddress + `/${firstItem}/${lastItem}`;
    const url = new URL(listAddress);
    // console.log(url);
    try {
        const response = await fetch(url);
        // console.log("response:", response);
        const data = await response.json(); // json파일형태로 data변수에 선언
        if (response.status === 200) {
            // console.log("data", data);
            arrRecipe = data.COOKRCP01.row;
            console.log("레시피array", arrRecipe);
            render();
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        errorRender(error.message);
    }
};

getRecipe();

const render = () => {
    let listHTML = ``;
    arrRecipe.map((item, index) => {
        listHTML += `
        <div class="card">
            <img src=${item.ATT_FILE_NO_MAIN} class="card-img-top" alt=${item.RCP_NM}>
            <div class="card-body">
                <h5 class="card-title">${item.RCP_NM}</h5>
                <ul>
                    <li>${item.INFO_ENG} calorie</li>
                    <li>#${item.HASH_TAG}</li>
                </ul>
                <a role="button" data-bs-toggle="modal" data-bs-target="#recipeModal" class="btn btn-primary" onclick="showDetail(${index})">레시피 보기</a>
            </div>
            </div>`;
    });

    document.getElementById("listRecipe").innerHTML = listHTML;
};

const showDetail = (index) => {
    console.log(arrRecipe[index]);
    let recipeOrderHTML = ``;
    for (let i = 1; i <= 20; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        const imgText = "arrRecipe[index].MANUAL_IMG" + i;
        const text = "arrRecipe[index].MANUAL" + i;
        if (eval(imgText) !== "") {
            recipeOrderHTML += `<div class="d-flex align-items-start gap-3 m-3">
            <img src=${eval(imgText)} alt="" />
            <p>${eval(text)}</p>
        </div>`;
        }
    }
    const detailHTML = `<div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">${arrRecipe[index].RCP_NM}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">      
            ${recipeOrderHTML}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>`;
    document.querySelector(".modal-content").innerHTML = detailHTML;
};

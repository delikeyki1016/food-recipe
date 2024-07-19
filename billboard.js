// open api 주소 : https://www.foodsafetykorea.go.kr/api/openApiInfo.do?menu_grp=MENU_GRP31&menu_no=661&show_cnt=10&start_idx=1&svc_no=COOKRCP01

const API_KEY = "4ea57cfaa61b4f4c95c3";
const originAddress = `https://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/json`;
let arrRecipe = [];
// https://openapi.foodsafetykorea.go.kr/api/4ea57cfaa61b4f4c95c3/COOKRCP01/json/37/48/ 전체가 나오는 오류있음
let totalResults = 0; // 전체 레시피 수
const pageSize = 10; // 한페이지에 보여줄 레시피개수
const groupSize = 5; // 한그룹에 보여줄 페이지 수
let pageNum = 1; // 현재 페이지넘버

// 레시피 리스트 api
const getRecipe = async () => {
    const firstItem = (pageNum - 1) * pageSize + 1;
    const lastItem = firstItem + pageSize - 1;
    // console.log(firstItem, lastItem);
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
            // console.log("레시피array", arrRecipe);
            totalResults = data.COOKRCP01.total_count;
            render();
            pageRender();

            billboardLink();
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        errorRender(error.message);
    }
};

getRecipe();

// 리스트 그리기
const render = () => {
    let listHTML = ``;
    arrRecipe.map((item, index) => {
        listHTML += `
        <div class="card">
            <img src=${item.ATT_FILE_NO_MAIN} class="card-img-top" alt=${
            item.RCP_NM
        }>
            <div class="card-body">
                <h5 class="card-title">${item.RCP_NM}</h5>
                <ul>
                    <li>${item.INFO_ENG} calorie</li>
                    <li>#${
                        item.HASH_TAG
                            ? item.HASH_TAG
                            : item.RCP_NM.split(" ")[
                                  item.RCP_NM.split(" ").length - 1
                              ]
                    }</li>
                </ul>
                <a role="button" data-bs-toggle="modal" data-bs-target="#recipeModal" class="btn btn-primary" onclick="showDetail(${index})">레시피 보기</a>
            </div>
            </div>`;
    });

    document.getElementById("listRecipe").innerHTML = listHTML;
};

// pagination
const pageRender = () => {
    const totalPage = Math.ceil(totalResults / pageSize);
    const pageGroup = Math.ceil(pageNum / groupSize);
    // lastPage, firstPage를 구하는 식이 중요!!
    let lastPage = pageGroup * groupSize;
    // 마지막 페이지가 그룹사이즈보다 작을경우
    if (lastPage > totalPage) {
        lastPage = totalPage;
    }
    // 마지막페이지 그룹이 groupSize보다 작을 때에도 groupSize만큼 보여주기
    const firstPage =
        lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
    let pageHTML = ``;

    if (pageNum > 1) {
        pageHTML = `
        <li class="page-item"><a class="page-link" href='#N' aria-label="First page" onclick="moveToPage(1)">&lt;&lt;</a></li>
        <li class="page-item">
            <a class="page-link" href="#N" aria-label="Previous page" onclick="moveToPage(${
                pageNum - 1
            })">
                <span aria-hidden="true">&lt;</span>
            </a>
        </li>`;
    }

    for (let i = firstPage; i <= lastPage; i++) {
        pageHTML += `<li class="page-item"><a class="page-link ${
            pageNum === i ? "active" : ""
        }" href="#N" onclick="moveToPage(${i})">${i}</a></li>`;
    }

    if (pageNum < totalPage) {
        pageHTML += `<li class="page-item">
        <a class="page-link" href="#N" aria-label="Next page" onclick="moveToPage(${
            pageNum + 1
        })">
            <span aria-hidden="true">&gt;</span>
        </a>
    </li>
    <li class="page-item">
        <a class="page-link" href='#N' aria-label="Last page" onclick="moveToPage(${totalPage})">&gt;&gt;</a>
    </li>`;
    }

    document.querySelector(".pagination").innerHTML = pageHTML;
};

const moveToPage = (page) => {
    pageNum = page;
    getRecipe();
};

// 빌보드 키워드 api
let billboardKeyword = ["채소비빔밥", "약밥", "유부완자탕"];
let billboardRecipe = [];
const billboardLink = async () => {
    for (let i = 0; i < billboardKeyword.length; i++) {
        const listAddress =
            originAddress + `/1/1/RCP_NM=${billboardKeyword[i]}`;
        // console.log(listAddress);
        const url = new URL(listAddress);
        try {
            const response = await fetch(url);
            const data = await response.json();
            // console.log("빌보드데이터", data);
            if (response.status === 200) {
                billboardRecipe.push(data.COOKRCP01.row[0]);
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            errorRender(error.message);
        }
    }
};

// 레시피 모달 보여주기
const showDetail = (index, arrName) => {
    let showRecipe = [];
    if (arrName) {
        showRecipe = billboardRecipe;
    } else {
        showRecipe = arrRecipe;
    }
    // console.log(showRecipe[index]);
    let recipeOrderHTML = ``;
    let order = 1;
    for (let i = 1; i <= 20; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        const imgText = "showRecipe[index].MANUAL_IMG" + i;
        const text = "showRecipe[index].MANUAL" + i;
        // console.log("text:", eval(text));
        if (eval(imgText) !== "") {
            recipeOrderHTML += `<div class="d-flex align-items-start gap-3 m-3">
            <img src=${eval(imgText)} alt="" width="170" />
            <p>${eval(text).replace(/^\d+/, order++)}</p>
        </div>`;
        }
    }
    const detailHTML = `<div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">${showRecipe[index].RCP_NM}</h1>
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

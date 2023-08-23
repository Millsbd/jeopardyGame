let body = document.querySelector('body');
let divContainer = document.createElement('div');
let button = document.createElement('button');
body.appendChild(divContainer);
body.appendChild(button);
button.innerText = 'Restart Game';

let categories = [];
let url = "http://jservice.io/api"

addEventListener('load', () => {
    console.log('the page has loaded');
    gatherData();
    generateTable();
})

button.addEventListener('click', () => {
    divContainer.innerHTML = '';
    gatherData();
    generateTable();
})
// When button is clicked, it grabs the data from axios then uses it to create the table. 
// *****Works sometimes throws errors others if you keep clicking button will work eventually, one is undefined reading properties at 57, the other is about accessing the servers. I THINK THE SECOND SET OF ISSUES IS A PROBLEM WITH THE SOURCE API AS THE EXAMPLE IN THE ASSIGNMENT HAS SAME ISSUE*****
function gatherData(){
    const catData = getCategoryIds();
    getCategory(catData);
}
// Users getRandom to generate a random number, then passes that into a loop in get ids which returns an array of 5 random category numbers within the limit of possible category options. 
const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
function getCategoryIds() {
    let catIds = [];
    for (let i = 1; i <= 6; i++) {
        catIds.push(getRandom(0, 18500));
    }
    return catIds;
}
async function getCategory(catIds) {
    for(let cat of catIds){
    let categoryObj = {};
    const res = await axios.get(`${url}/category`, {params: {id: cat}});
    categoryObj.title = res.data.title;
    categoryObj.clues = res.data.clues; 
    for(let i = 0; i < 5; i++){
    categoryObj.clues[i].showing = '?';
    }
    categories.push(categoryObj);
}
// **Remember to keep everything you need inside Loop!!**
// fills out the categories array with all needed data [{title: str clues: [question, answer, showing]}]
}
function generateTable(){
    const tbl = document.createElement('table');
    const tblBody = document.createElement('tbody');
    const tblHead = document.createElement('thead');

    const headRow = document.createElement('tr');
    for(let i = 0; i <= 5; i++){
        const headCell = document.createElement('th');
        headCell.setAttribute('class', 't-head');
        headCell.innerText = categories[i].title;
        headRow.appendChild(headCell);
    }
    // Creates header row for titles and adds in the values from categories array. Each i in the loop is a vertical th in the tr row. 
    for(let i = 0; i <= 4; i++){
        const row = document.createElement('tr');
        // creating 5 horizontal rows
        for(let j = 0; j <= 5; j++){
            const cell = document.createElement('td');
               // adding 6 vertical colums to each row
            cell.setAttribute('class', 't-body');
            cell.setAttribute('id', `${j}-${i}`);
            cell.innerText = categories[j].clues[i].showing; 
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    // Fills 5 horizontal rows with 6 vertical columns, assigns an id tied to the format of categories[j].clues[i] so that the clue object will be tied to the correct cateogry title in header. 
    }
    tblHead.appendChild(headRow);
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    divContainer.appendChild(tbl);

    tblBody.addEventListener('click', function handleClick(evt){
        let element = evt.target;
        const idText = element.getAttribute('id');
        element.innerText = categories[idText[0]].clues[idText[2]].question;
        element.setAttribute('class', 'question');

        element.addEventListener('click', function (e){
            console.log(e.target);
            const idT = e.target.getAttribute('id');
            e.target.innerText = categories[idT[0]].clues[idT[2]].answer;
            e.target.setAttribute('class', 'answer');
        })
    });
    // **Same problem as with the if below can only get it to show quesion or answer not question then click then answer**

    tblBody.addEventListener('click', function handleClick(evt){
        let element = evt.target;
        const idText = element.getAttribute('id');
        if(element.innerText = categories[idText[0]].clues[idText[2]].showing){
        element.innerText = categories[idText[0]].clues[idText[2]].question;
        element.setAttribute('class', 'question');
        }
        if(element.innerText = categories[idText[0]].clues[idText[2]].question){
        element.innerText = categories[idText[0]].clues[idText[2]].answer;
        element.setAttribute('class', 'answer');
        }
    });

// **Only getting it to show the answer or the question can't get it to cycle through the question then the answer when clicked twice. 
}


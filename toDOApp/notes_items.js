let item = document.querySelector("#list_input");
let item_name = document.querySelector(".item_name");
let form = document.querySelector(".insert_form");
let add_btn = document.querySelector(".add_btn");
let ol = document.querySelector("ol");

// Getting position data:
const params = new URLSearchParams(window.location.search);
const q = parseInt(params.get("itemName"));

let itemName_field = document.getElementsByName('itemName');
if ( String(q) != 'NaN' ){
      itemName_field.value = q;    
}

let pos = itemName_field.value;
let user_data = JSON.parse(localStorage.getItem('User-Data'));
let Item = user_data[pos];  // working object

let itemName = Object.keys(Item)[0];
item_name.textContent = itemName;
let Data = Item[itemName];


if( Data != null ){
    for (const ele of Data) {
        loadData(ele);
    }
    console.log(Data);
}

add_btn.addEventListener('click', (e) => {
    e.preventDefault();
    loadData(item.value);
    Data.push(item.value);

    Item[itemName] = Data;
    user_data[pos] = Item;
    localStorage.setItem('User-Data',JSON.stringify(user_data));
    item.value = null;
})


function loadData(data){
    let li = document.createElement('li'); 
    let p = document.createElement('p');
    p.innerText = data; 
    li.appendChild(p);
    ol.appendChild(li);

    let btn = document.createElement('button');
    btn.innerText = 'Delete';
    btn.className = "delete_btn btn";
    li.insertAdjacentElement('beforeend', btn);

    li.addEventListener('dblclick',()=>{
        p.setAttribute('contenteditable', 'true' );
        btn.innerText = 'Update';
        btn.className = "update_btn btn";
    })

   
    btn.addEventListener('click', () => {
        let li = btn.parentElement;
        let i =  [...li.parentElement.children].indexOf(li);
        let para = li.children[0];
        console.log(Data);
        
        if (btn.classList.contains('delete_btn')){
    
            Data.splice(i, 1);
            ol.removeChild(li);
            console.log(pos);

            Item[itemName] = Data;
            user_data[pos] = Item;
            localStorage.setItem('User-Data',JSON.stringify(user_data));

        }
        else if ( btn.classList.contains('update_btn') ){
    
            Data.splice(i, 1, para.textContent );
            console.log(pos); 

            Item[itemName] = Data;
            user_data[pos] = Item;
            localStorage.setItem('User-Data',JSON.stringify(user_data));

            btn.innerText = 'Delete';
            btn.className = "delete_btn btn";
            p.removeAttribute('contenteditable');
        }
    })

}







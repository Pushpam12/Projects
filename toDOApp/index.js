let item = document.querySelector("#list_input");
let form = document.querySelector(".insert_form");
let add_btn = document.querySelector(".add_btn");
let ol = document.querySelector("ol");
let item_name = document.querySelector('#itemName')

let user_data = JSON.parse(localStorage.getItem('User-Data'));
if ( !user_data ){
    user_data = [] ;
    // [ {name : []} ]
}
for (const ele of user_data) {
    if ( ele != null ){
        loadData(Object.keys(ele)[0]);
        // console.log(ele);
    }
    console.log(user_data);
}

form.addEventListener('submit', (e) => {
    loadData(item.value);
    let o = {};
    o[item.value] = [];
    user_data.push(o);
    localStorage.setItem('User-Data',JSON.stringify(user_data));
    // console.log(localStorage.getItem('User-Data'));
    e.preventDefault();
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

    li.addEventListener('drag',()=>{
        p.setAttribute('contenteditable', 'true' );
        btn.innerText = 'Update';
        btn.className = "update_btn btn";
    })

    p.addEventListener('dblclick', ()=>{
        let index =  [...li.parentElement.children].indexOf(li);
        item_name.value = index;
        document.getElementById('item_name').submit();
    })

   
    btn.addEventListener('click', () => {
        let li = btn.parentElement;
        let pos =  [...li.parentElement.children].indexOf(li);
        let para = li.children[0];
        
        if (btn.classList.contains('delete_btn')){
    
            ol.removeChild(li);
            user_data.splice(pos, 1);
            localStorage.setItem('User-Data',JSON.stringify(user_data));
            // console.log(localStorage.getItem('User-Data'));

        }
        else if ( btn.classList.contains('update_btn') ){
    
            let obj = user_data[pos];
            let oldKey = Object.keys(obj)[0];
            obj[para.textContent] = obj[oldKey];
            delete obj[oldKey];
            localStorage.setItem('User-Data',JSON.stringify(user_data));

            btn.innerText = 'Delete';
            btn.className = "delete_btn btn";
            p.removeAttribute('contenteditable');
        }
    })

}






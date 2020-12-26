import productdb,{  bulkcreate,
  createEle,
  getData,
  SortObj} from "./module.mjs";


let db = productdb("Bookdb",{ //db name
    books:`++id,name,author,price` //table name :`col names` 
    //++id-auto increment
});

//inputs
const userid = document.getElementById("userid");
const product = document.getElementById("prdt");
const author = document.getElementById("author");
const price = document.getElementById("price");

//buttons
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

btncreate.onclick = event => {
    // insert values
    let flag = bulkcreate(db.books, { //bulkcreate(table,data)
      name: product.value,
      author: author.value,
      price: price.value
    });
    product.value = author.value = price.value = ""; //setting all fields to null after insertion

getData(db.books, data => {
    userid.value = data.id + 1 || 1; //to increase id value
  });

  table();

let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};

// event listerner for read button
btnread.onclick = table;

// button update
btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    // call dexie update method
    db.books.update(id, {
      name: product.value,
      author: author.value,
      price: price.value
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;
      let get = updated ? true : false;

      // display message
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      product.value = author.value = price.value = "";
      //console.log(get);
    })
  } else {
    console.log(`Please Select id: ${id}`);
  }
}

// delete button
btndelete.onclick = () => {
  db.delete();
  db = productdb("Productdb", {
    books: `++id, name, author, price`
  });
  db.open();
  table();
  textID(userid);
  // display message
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
  // set id textbox value on loading of window
  textID(userid);
};





// create dynamic table
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  // remove all childs from the dom first i.e to remove duplicate rows
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  } 
  getData(db.books, (data, index) => {
    if (data) { //if data exists create a tablerow
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => { //create table data for name and 
            td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "No record found in the database...!";
    }

  });
}

const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.books.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    product.value = newdata.name || "";
    author.value = newdata.author || "";
    price.value = newdata.price || "";
  });
}

// delete icon remove element 
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.books.delete(id);
  table();
}

// textbox id
function textID(textboxid) {
  getData(db.books, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

// function msg
function getMsg(flag, element) {
  if (flag) {
    // call msg 
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}
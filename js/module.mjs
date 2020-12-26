function productdb(dbname,table){
//create db
const db = new Dexie(dbname)
db.version(1).stores(table);

db.open(); 

return db;
}

const bulkcreate = (dbtable, data) => {
    let flag = empty(data);//checking if any of data field is empty
    if (flag) {
      dbtable.bulkAdd([data]);
      console.log("data inserted successfully...!");
    } else {
      console.log("Please provide data...!");
    }
    return flag;
  };
  
  // create dynamic elements
  const createEle = (tagname, appendTo, fn) => {
    const element = document.createElement(tagname);
    if (appendTo) appendTo.appendChild(element);
    if (fn) fn(element);
  };
  
  // check textbox validation
  const empty = object => {
    let flag = false;
    for (const value in object) {
      if (object[value] != "" && object.hasOwnProperty(value)) {
        flag = true;
      } else {
        flag = false;
      }
    }
    return flag;
  };
  
  // getData from the database
  const getData = (dbname, fn) => {
    let index = 0;
    let obj = {};
    dbname.count(count => {
      if (count) {
        dbname.each(table => {
          obj = SortObj(table);
          fn(obj, index++); 
        });
      } else {
        fn(0);
      }
    });
  };
  
  const SortObj = (sortobj) => { //sort in given order->id,name,author,price
    let obj = {};
    obj = {
      id: sortobj.id,
      name: sortobj.name,
      author: sortobj.author,
      price: sortobj.price
    };
    return obj;
  }
  
  
  export default productdb;
  export {
    bulkcreate,
    createEle,
    getData,
    SortObj
  };




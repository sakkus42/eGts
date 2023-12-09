// let dataPrdct;

// document.getElementById('memberList').addEventListener('click', async function() {
//     try{
//         const res = await fetch('/user/all-user', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         }); 
//         const data = await res.json();
//         const users = data.users;

//         const tableBody = document.querySelector('#userTable tbody');
//         tableBody.innerHTML = '';

//         users.forEach(user => {
//             const row = tableBody.insertRow();
//             row.insertCell().textContent = user.email;
//             row.insertCell().textContent = user.phone;
//             row.insertCell().textContent = user.name;
//             row.insertCell().textContent = user.sirname;


//             const buttonCell = row.insertCell();
//             const button = document.createElement('button');

//             buttonCell.appendChild(button);
//             button.classList.add("btn");

//             if (user.isBlocked){
//                 button.textContent = 'Engeli Aç';
//                 button.classList.add("btn-success");
//             }else{
//                 button.textContent = 'Engelle'; 
//                 button.classList.add("btn-danger");
//             }
            
//             // const bntDel = document.createElement('button');
//             // row.insertCell().appendChild(bntDel);
//             // bntDel.textContent = "Sil";
//             // bntDel.classList.add("btn");
//             // bntDel.classList.add("btn-warning");
            
//             button.addEventListener('click', async () => {
//                 try {
//                     const response = await fetch(`/user/${user.id}/block`, {
//                         method: 'PUT',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         }
//                     });
        
//                     if (!response.ok) {
//                         throw new Error('Network response was not ok.');
//                     }
        
//                     user.isBlocked = !user.isBlocked;
        
//                     if (user.isBlocked) {
//                         button.textContent = 'Engeli Aç';
//                         button.classList.remove("btn-danger");
//                         button.classList.add("btn-success");
//                     } else {
//                         button.textContent = 'Engelle'; 
//                         button.classList.remove("btn-success");
//                         button.classList.add("btn-danger");
//                     }
//                 } catch (error) {
//                     console.error('There has been a problem with your fetch operation:', error);
//                 }
//             });
//         });
//     }catch(err){
//         console.log(err);
//     }
// });

// document.getElementById('getAllProducts').addEventListener('click', async function() {
//     closeAll("products");
//     try{

//         const res = await fetch("/product/allProduct", {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         });

//         const data = await res.json();
//         const products = data.products;
//         dataPrdct = products;
//         const tableBody = document.querySelector('#productTable tbody');
//         tableBody.innerHTML = '';
//         products.forEach(el => {
//             const row = tableBody.insertRow();
//             const secretId= row.insertCell();
//             secretId.style.display = "none";
//             secretId.textContent = el.id;
//             row.insertCell().textContent = el.title;
//             row.insertCell().textContent = el.category;
//             row.insertCell().textContent = el.brand;
//             row.insertCell().textContent = el.price;
//             row.insertCell().textContent = el.quantity;

//             const buttonCell = row.insertCell();
//             const button = document.createElement('button');

//             buttonCell.appendChild(button);
//             button.classList.add("btn");
//             button.classList.add("btn-del");
//             button.classList.add("btn-warning");
//             button.textContent = "sil";

//             const buttonCell1 = row.insertCell();
//             const buttonInfo = document.createElement('button');

//             buttonCell1.appendChild(buttonInfo);
//             buttonInfo.classList.add("btn");
//             buttonInfo.classList.add("btn-warning");
//             buttonInfo.textContent = "İncele";
//         });
//     }catch(err){
//         console.log(err);
//     }
// });

// // $('#searchProduct').on('click', function(ev){
// //     ev.preventDefault();
// //     let key = slugify($('#search').val());
// //     const res = fetch("/product/search/:slug")
// //     console.log(key);
// //     return;
// // });

// $('#productTable').on('click', async function(event) {
//     if ($(event.target).hasClass('btn-del')) {
//         try {
//             const row = $(event.target).closest('tr');
//             const id = row.find('td').first().text();
//             row.remove();
            
//             const response = await fetch(`/product/del/${id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//         } catch (err) {
//             console.log(err);
//         }
//     }
// });


// $('#productCreat').on('click', async () => {
//     closeAll('product-maker');
//     try {
//         const res = await fetch("/product/getCategory");
//         const { category } = await res.json();

//         const datalist = $("#categories");
        
//         category.forEach(cat => {
//             datalist.append(`<option value="${cat}">`);
//         });
//     } catch (error) {
//         console.error(error);
//     }
// });


// document.getElementById('createProductBtn').addEventListener('click', async (event) => {
//     try{
//         const form = document.getElementById('productForm');
//         const formData =  new FormData(form);
//         const fileInput = document.querySelector('input[type="file"]');
//         const files = fileInput.files;
//         const formDataFile = new FormData();
//         // if (files.length == 0){
//         //     throw new Error("Her inputu doldur");
//         // }
//         Array.from(files).forEach((file, index) => {
//             if (file.length == 0){
//                 console.log("burdayım");
//             }
//             formDataFile.append(`file${index + 1}`, file);
//         });
//         event.preventDefault();

//         fetch('/product/creatProduct', {
//             method: 'POST',
//             body: formData,
//             file: formDataFile,
//         })
//         .then(response => {
//             if (!response.ok) {
//                 console.log("burdayım")
//                 throw new Error('Network response was not ok');
//             }
//         })
//         .catch(error => {
//             console.log(error);
//             alert("aynı üründen bir adet olabilir");
//         });


    
//     }catch(error) {console.log(error);}
// })


// function closeAll( name ){
//     const docs = [{name: "members", display: "block"}, {name: "product-maker", display: "grid"}, {name: "products", display: "block"}];
//     docs.forEach((el) => {
//         const docMem = document.getElementsByClassName(el.name)[0];
//         if (el.name == name && docMem.style.display != el.display){
//             docMem.style.display = el.display;
//             return;
//         }
//         if (docMem.style.display == el.display){
//             docMem.style.display = "none";
//             return;
//         }
//     })
// };





  

//database referece
var itemsRef = firebase.database().ref().child("Items");

var totPrice=0; //global
var formError;

//declare onsubmit functions
document.getElementById('transForm').addEventListener('submit', addItem);
document.getElementById('billCalculate').addEventListener('submit', generateBill);

//get form data
itemsRef.on("child_added",snap=>{

    var itemCode = snap.child("itemCode").val();
    var itemName = snap.child("itemName").val();
    var itemPrice = snap.child("itemPrice").val();
    var quantity = snap.child("quantity").val();
   
    //load select menu
    $('#itemCode').append("<option>"+itemCode+"</option>");
});

function loadData(){
    var x = document.getElementById('itemCode').value;
    if(x=='selectID'){
        document.getElementById('transForm').reset();
    }else{
        //filter by item code
        itemsRef.orderByChild("itemCode").equalTo(x).on("child_added", function(data) {
            var newItemName = data.val().itemName;
            var newItemPrice = data.val().itemPrice;
            var newQuantity = data.val().quantity;
            
            //load values
            document.getElementById('go').innerHTML=newQuantity;
            document.getElementById('itemName').value=newItemName;
            document.getElementById('itemPrice').value=newItemPrice;
            document.getElementById('quantity').value=newQuantity;
         });
    }   
}

function addItem(e){
    e.preventDefault();

    //get form data
    var nItemCode = document.getElementById('itemCode').value;
    var nItemName = document.getElementById('itemName').value;
    var nItemPrice = document.getElementById('itemPrice').value;
    var nnewQuantity = document.getElementById('newQuantity').value;
 
    //update remaining items
    var y = document.getElementById('itemCode').value;
    itemsRef.orderByChild("itemCode").equalTo(y).on("child_added", function(snapshot) {
        qty=document.getElementById('go').innerHTML;
        var path = snapshot.key;
        var updatedRemQuantity = qty - nnewQuantity;
        if(updatedRemQuantity < 0){
            formError = 'Not enough items left';
            document.getElementById('valid').innerHTML = formError;

            //reset form
            document.getElementById('transForm').reset();
        }else{
            formError = 'Item added to cart';
            document.getElementById('valid').innerHTML = formError;

            firebase.database().ref("Items/" + path).update({ quantity: updatedRemQuantity });

            //form validate
            if(nItemCode == 'selectID' || newQuantity == ""){
            document.getElementById("addItem").disabled = true;
            }else{
            document.getElementById("addItem").disabled = false;

            //load table
            $('#table_bdy').append("<tr><td>"+nItemCode+"</td><td>"+nItemName+"</td><td>"+nItemPrice+"</td><td>"+nnewQuantity+"</td></tr>");

            //calculate total price
            var newItemPrice = parseInt(nItemPrice);
            var trueValue = nnewQuantity * newItemPrice;
            totPrice = totPrice + trueValue;
            document.getElementById('totalBill').value=totPrice;

            //reset form
            document.getElementById('transForm').reset();
            }    
        }
    });   
}

function generateBill(e){
    e.preventDefault();

    //load total price
    var newTotal = document.getElementById('totalBill').value;
    var cash = document.getElementById('cash').value;
    var balance = cash - newTotal;
    document.getElementById('balance').value= balance;
}

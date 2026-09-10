const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Serve files from the public folder (GET)
app.use(express.static(path.join(__dirname, "public")));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const appdata = []


app.post("/submit", function(request, response) {
  handleSubmit(request, response);
});

app.post("/update", function(request, response) {
  handleUpdate(request, response);
})

app.post("/delete", function(request, response) {
  handleDelete(request, response);
})


const description = function( item ) {
   return item.description = item.quantity + " " + item.item
}

const handleSubmit = function( request, response ) {

    const listItem = request.body
    listItem.id = appdata.length + 1 // add a unique id to the item
    listItem.description = description( listItem )
    console.log( listItem )

    appdata.push( listItem ) // add the new item to the array
    console.log( appdata )

    response.status(200).json(appdata)
}

const handleUpdate = function (request, response) {
    const update = request.body

    // find the item in the array that matches the id of the checked/unchecked item
    const item = appdata.find(function(grocery) {
      return grocery.id === update.id
    })

    // update the is_purchased property of the item
    item.is_purchased = update.is_purchased

    console.log(appdata)

    response.status(200).json(appdata)
}

const handleDelete = function (request, response) {

    const deleted = request.body

    // find the item in the array that matches the id of the deleted item
    const index = appdata.findIndex(function(grocery) {
      return grocery.id === deleted.id
    })

    appdata.splice(index, 1)

    console.log(appdata)

    response.status(200).json(appdata)
}


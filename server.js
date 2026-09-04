const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = []

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    if (request.url === '/submit') {
      handleSubmit(request, response)
    } else if (request.url === '/update') {
      handleUpdate(request, response)
    } else if (request.url === '/delete') {
      handleDelete(request, response)
    }
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const description = function( item ) {
   return item.description = item.quantity + " " + item.item
}

const handleSubmit = function( request, response ) {
  let dataString = '' // holds data from the browser

  // whenever some data arrives, add it to dataString
  request.on( 'data', function( data ) {
      dataString += data 
  })


  request.on( 'end', function() { // wait until all the data is received
    const listItem = JSON.parse( dataString ) // convert the JSON string back to a js object
    listItem.id = appdata.length + 1 // add a unique id to the item
    listItem.description = description( listItem )
    console.log( listItem )

    appdata.push( listItem ) // add the new item to the array
    console.log( appdata )

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' }) // tells the browser that the response is ok/success

    response.end(JSON.stringify(appdata))
  })
}

const handleUpdate = function (request, response) {
  let dataString = ''

  // whenever some data arrives, add it to dataString
  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on('end', function() {
    const update = JSON.parse(dataString)

    // find the item in the array that matches the id of the checked/unchecked item
    const item = appdata.find(function(grocery) {
      return grocery.id === update.id
    })

    // update the is_purchased property of the item
    item.is_purchased = update.is_purchased

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' }) // tells the browser that the response is ok/success

    console.log(appdata)

    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function (request, response) {
  let dataString = ''

  // whenever some data arrives, add it to dataString
  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on('end', function() {
    const deleted = JSON.parse(dataString)

    // find the item in the array that matches the id of the deleted item
    const index = appdata.findIndex(function(grocery) {
      return grocery.id === deleted.id
    })

    appdata.splice(index, 1)

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' }) // tells the browser that the response is ok/success

    console.log(appdata)

    response.end(JSON.stringify(appdata))

  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )

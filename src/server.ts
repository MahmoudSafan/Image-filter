import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, checkUrl} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  app.get("/filteredimage", async (request:express.Request, response: express.Response) =>{
    let image_url = String(request.query.image_url);
    if(!image_url){
      return response.status(400).send("image_url is required!");
    }
    if(checkUrl(image_url)){
      const filterdPath = await filterImageFromURL(image_url);

     return response.sendFile(filterdPath, function (err) {
        if (!err) {
          deleteLocalFiles(filterdPath);
        }
    }); 
      
    }else{
      return response.status(400).send("image_url is invalid!");
    }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( request:express.Request, response: express.Response ) => {
    response.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
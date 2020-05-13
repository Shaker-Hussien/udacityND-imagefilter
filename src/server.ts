import express ,{Request,Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  app.get( "/filteredimage", async ( req :Request, res :Response) => {
    let {image_url} = req.body;
    if(!image_url) return res.status(400).send({message: "image url is required."})

    let filtered_image_path = await filterImageFromURL(image_url);
    res.status(200).sendFile(filtered_image_path,async () =>{
      await deleteLocalFiles([filtered_image_path]);
    })
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
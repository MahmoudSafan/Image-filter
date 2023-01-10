import fs from "fs";
import Jimp = require("jimp");
import path = require("path");
import validUrl = require('valid-url');
import axios from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file

export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: imageBuffer } = await axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer'
      });

      const photo = await Jimp.read(imageBuffer);
      const outpath:string =
        path.join(__dirname, "tmp", "filtered." ) + Math.floor(Math.random() * 2000) + ".jpg";

      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, () => {
           resolve(outpath);
        });
        
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(file:string) {
  try {
    fs.unlinkSync(file);
  } catch (error) {
    throw new Error("invalid delete file");
    
    
  }
}


// checkUrl
// helper function to check if url is valid or not
export function checkUrl(url:any): boolean{
  return validUrl.isUri(url) ? true : false;
}

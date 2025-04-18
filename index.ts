import { Letter, LetterOptions } from "./letter";
import {GoogleDrive} from './googleDrive'
import {GoogleDocs} from './googleDoc'
const options: LetterOptions = {
  company: "",
  detail:
    "",
  position: "",
  mission:".",
};
const letter = new Letter(options).createCoverLetter();

async function main(){

  const googleDrive = new GoogleDrive()
  await googleDrive.initialize()
  const googleDocs = new GoogleDocs()
  await googleDocs.initialize()

  const fileId =await googleDrive.createFile(`${options.company} ${options.position} Cover Letter`)
  await googleDocs.copyContentAndStylingToDoc(fileId, letter)  
  const {exec} = require('child_process')
 exec(`start https://docs.google.com/document/d/${fileId}`)
}

main()


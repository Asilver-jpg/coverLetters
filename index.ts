import { Letter } from "./letter/letter.ts";
import {GoogleDrive} from './google/googleDrive.ts'
import {GoogleDocs} from './google/googleDoc.ts'
import {exec} from 'child_process'
import {options} from './input.ts'


const letter = new Letter(options).createCoverLetter();

async function main(){

  const googleDrive = new GoogleDrive()
  await googleDrive.initialize()
  const googleDocs = new GoogleDocs()
  await googleDocs.initialize()

  const fileId =await googleDrive.createFile(`${options.company} ${options.position} Cover Letter`)
  if(fileId){
  await googleDocs.copyContentAndStylingToDoc(fileId, letter)  
 exec(`start https://docs.google.com/document/d/${fileId}`)
  }else{
    console.log('no fileId')
  }
}

main()


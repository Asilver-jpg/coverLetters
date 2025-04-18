import 'dotenv/config'
import {GoogleAuth} from 'google-auth-library'
import { google, docs_v1 } from 'googleapis';
export class GoogleApis{

public client;
constructor(){
     const auth = new GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDS,
        scopes:["https://www.googleapis.com/auth/docs", "https://www.googleapis.com/auth/drive"]
    })
    return (async ():Promise<GoogleApis>=>{
       this.client= await auth.getClient()
        return this;

    })() as unknown as GoogleApis
}

}
import { GoogleAuth } from "google-auth-library"
import { drive_v3, google } from "googleapis"
import 'dotenv/config'

export class GoogleDrive{
    private auth
    public drive:drive_v3.Drive
    constructor(){
        this.auth = new GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDS,
            scopes:["https://www.googleapis.com/auth/docs", "https://www.googleapis.com/auth/drive"]
        })
    }

    public async initialize(){
        const authClient = await this.auth.getClient()
        this.drive =  google.drive({version:"v3", auth: authClient})
    }

    public async createFile(name:string){
        try{
       const file = await this.drive.files.copy({
           fileId: process.env.TEMPLATE_GOOGLE_DOC_ID,
       requestBody:{
           name: name,
        },
       fields: 'id'
        })
        const fileId = file.data.id
        console.log(`File Created with ID: ${fileId}`)

        await this.drive.permissions.create({
            fileId,
            requestBody:{
                type: 'user',
                role: 'writer',
                emailAddress: process.env.USER_EMAIL
            }
        })
        return fileId;
    }catch(error){
        console.error('Error:', error.message);
    }
    }


}
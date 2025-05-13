import {docs_v1, google} from 'googleapis'
import {GoogleAuth, JWT} from 'google-auth-library'

export interface DocFunctionality {
content: string | null | undefined; 
link?: docs_v1.Schema$Link | undefined; 
style: { 
  fontFamily: string; 
  fontSize: number | null | undefined; 
  bold: boolean; italic: boolean; underline: boolean; 
  } 
}

export class GoogleDocs{
  private auth;
  public docs: docs_v1.Docs | undefined;
  constructor(){
     this.auth = new GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDS,
        scopes:["https://www.googleapis.com/auth/docs", "https://www.googleapis.com/auth/drive"]
    })
  }

  public async initialize(){
    const authClient = (await this.auth.getClient()) as JWT;
    this.docs = google.docs({version:'v1',auth: authClient });
  }
    
    public async getDocumentContent(documentId:string){
      if(this.docs===undefined){
        console.error('doc was somehow not defined -get doc content')
        return;
      }
        const res = await this.docs.documents.get({documentId: documentId})
        return res.data;
    }

    public extractTextAndFunctionality(doc:docs_v1.Schema$Document):(DocFunctionality | undefined)[] | undefined{
      if(doc.body?.content){
        return doc.body.content.map((element) => {
            if (element.paragraph && element.paragraph.elements) {
              return element.paragraph.elements.map((el) => {
                const textRun = el.textRun;
                if (textRun) {
                  const content = textRun.content;
                  const link = textRun?.textStyle?.link;
                  return {
                    content: content,
                    link: link, 
                    style: {
                      fontFamily: textRun.textStyle?.weightedFontFamily?.fontFamily || "Arial", 
                      fontSize: textRun?.textStyle?.fontSize ? textRun.textStyle.fontSize.magnitude : 9, 
                      bold: textRun?.textStyle?.bold || false,
                      italic: textRun?.textStyle?.italic || false,
                      underline: textRun?.textStyle?.underline || false,
                    },
                  };
                }
              }).filter(Boolean);
            }
          }).flat() ; 
        }
        return undefined;

    }

   
  

    public async copyContentToNewDoc(newDocId:string, content: DocFunctionality[]){
      if(this.docs===undefined){
        console.error('doc was somehow not defined -copy content ')
        return;
      }
        let index = 1
        const doc = await this.docs.documents.get({ documentId: newDocId });
        if(doc){
          const requests: docs_v1.Schema$Request[] = []
          content.forEach((textElement)=>{
              if(textElement === undefined){
                return
              }
                requests.push({
                    insertText:{
                        location:{index},
                        text: textElement.content === "\\n" ? "\n" : textElement.content
                    }
                });
                if(textElement.content){
                requests.push({
                    updateTextStyle:{
                        range:{
                            startIndex: index,
                            endIndex: index + textElement?.content?.length
                        },
                        textStyle: {
                          weightedFontFamily:{
                            fontFamily: textElement.style.fontFamily,
                          },
                          fontSize:{
                            magnitude: textElement.style.fontSize,
                            unit:'PT'
                          },
                          
                            bold: textElement.style.bold,
                            italic: textElement.style.italic,
                            underline: textElement.style.underline,
                          },
                          fields:  "weightedFontFamily,bold,italic,underline,fontSize",
                        },
                });
              
                if (textElement.link) {
                    requests.push({
                      updateTextStyle: {
                        range: {
                          startIndex: index,
                          endIndex: index + textElement.content.length,
                        },
                        textStyle: {
                          link: {
                            url: textElement.link.url, // Apply the link URL
                          },
                        },
                        fields: "link",
                      },
                    });
                  }
                  index += textElement.content.length;
                }
            });
          
          await this.docs.documents.batchUpdate({
              documentId: newDocId,
              requestBody: {requests}
          })
      }else{
        console.log("No file found")
      }
        
      }

      public async writeToDocument(newDocId:string, letter:string, index: number){
        if(this.docs===undefined){
          console.error('doc was somehow not defined - write document')
          return;
        }
        const requests:docs_v1.Schema$Request[]= [{insertText:{location:{index}, text:'\n'}}]
        index+=1;
        const paragraphs = letter.split("\n\n")
        paragraphs.forEach((paragraph)=>{
          requests.push({
            insertText:{
              location:{index},
              text: paragraph + '\n\n'
            }
          })
          requests.push({updateTextStyle:{
            range:{
              startIndex: index,
              endIndex: index + paragraph.length
            },
            textStyle:{
              weightedFontFamily:{
                fontFamily:'Arial'
              },
              fontSize:{
                magnitude: 9,
                unit:'PT'
              }
            },
            fields: "weightedFontFamily,fontSize",
          }})
          index += paragraph.length +2
        })

        await this.docs.documents.batchUpdate({
          documentId: newDocId,
          requestBody:{
            requests
          }
        })
      }

      public async copyContentAndStylingToDoc(newDocId: string, letter:string){
        const res = await this.getDocumentContent(newDocId);
        if(res && res.body){
        const documentLength = res.body.content?.[res.body.content?.length-1]?.endIndex || 1;

          this.writeToDocument(newDocId, letter, documentLength-1)
        }
       console.log('Wrote to document')
      }
    }

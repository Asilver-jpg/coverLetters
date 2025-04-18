This is a small app that will automate cover letters via a provided template and create a new google doc for download. You can optionally provide a template file that exists on google docs via its fileID which can be found in the url of the google doc. This will create a header before the content of your letter.
You will need a GCP account and need to create a project.
Setup: 
 1.  Create a service account in the project. You can find this via IAM & admin > Service Accounts
 2.  Create a new key for the service worker and save it as a json. You will need to add this file to the directory, name this secrets.json
 3.  Enable the Google Docs and Google Drive APIs. You can find these in APIs & Services. Add each one by clicking manage.
 4.  Create an .env file. It will need the following values

      ```
            GOOGLE_APPLICATION_CREDS= REQUIRED name of json file from your service worker
            TEMPLATE_GOOGLE_DOC_ID= OPTIONAL. If you want to have a header of some sort seperate from the content of your letter, place the file id here
            USER_EMAIL= REQUIRED. The google email you want to access these files with```
6. Provide your cover letter in BaseLetter.txt substituting sections you want to replace with $ starting characters. The list of those currently in the application are:
```
            $C: company,
            $D: detail,
            $P: position,
            $M: mission,
            $R: recruiterPosition
```
   Feel free to add or alter more in the letter.ts file.
8. In index.ts, fill in the options you want to be filled in your letter.
9. Don't forget to install and run ```npm run start```.

If everything was done correctly, a new window should open in your browser to the new file on google docs.
      

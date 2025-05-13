import * as fs from 'fs';

export interface LetterOptions{
    company: string;
    detail: string;
    position: string;
    mission: string;
    recruiterPosition?:string
}

interface Matchers{
    $C: string,
    $P: string,
    $D: string;
    $M: string;
    $R?: string;
}

export class Letter{

    private letter : string;
    private matchers: Matchers;
    constructor({company, detail, position, mission, recruiterPosition}:LetterOptions){
        this.matchers = {
            $C: company,
            $D: detail,
            $P: position,
            $M: mission,
            $R: recruiterPosition || "Hiring Manager"
        }
        this.letter = fs.readFileSync('./BaseLetter.txt').toString();
    }

    public createCoverLetter(){
        const regex = /\$C|\$D|\$P|\$R|\$M/gi
        const match = this.matchers
      const coverLetter = this.letter.replace(regex, function replace(matched:string){
        return match[matched as keyof Matchers] ?? ''
      });

      return coverLetter;
    }


}

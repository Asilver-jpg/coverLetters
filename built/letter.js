import * as fs from 'fs';
export class Letter {
    constructor({ company, detail, position }) {
        this.matchers = {
            $C: company,
            $D: detail,
            $P: position
        };
        this.letter = fs.readFileSync('./BaseLetter').toString();
    }
    createCoverLetter() {
        const regex = /\$C|\$D|\$P/gi;
        const coverLetter = this.letter.replace(regex, function replace(matched) {
            return this.matchers[matched];
        });
        fs.writeFile(`letters/${this.matchers.$P} ${this.matchers.$C}`, coverLetter, (err) => {
            err && console.log(err);
            if (!err) {
                console.log("File written successfully");
            }
        });
    }
}

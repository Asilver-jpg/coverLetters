import { Letter } from "./letter";
const options = {
    company: "C",
    detail: "D",
    position: "P"
};
const letter = new Letter(options);
console.log("LETTER");
letter.createCoverLetter();

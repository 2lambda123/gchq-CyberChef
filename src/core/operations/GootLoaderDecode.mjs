/**
 * @author drole [rodelm@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */
import Operation from "../Operation.mjs";
 /**
  * Gootloader decode operation
  */
class GootloaderDecode extends Operation {
     /**
      * Gootloader constructor
      */
    constructor() {
        super();
        this.name = "Gootloader Decode";
        this.module = "Code";
        this.description = "Decodes Gootloader JScript code block obfuscation";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

     /**
    * @param {string} input
    * @param {Object[]} args
    * @returns {string}
    */
    run(input, args) {
        if (!input) return "";
        let decoded = "";
        let decodedReversed = "";
        for (let i = 0; i < input.length; i++) {
            if (i%2) {
                decoded += input.charAt(i);
            } else {
                decodedReversed += input.charAt(i);
            }
        }
        return decodedReversed.split("").reverse().join("") + decoded;
    }
}

export default GootloaderDecode;

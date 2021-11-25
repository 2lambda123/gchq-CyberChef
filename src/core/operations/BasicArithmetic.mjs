/**
 * @author scottdermott [scottdermott@outlook.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import BigNumber from "bignumber.js";
import Operation from "../Operation.mjs";

/**
 * Basic Arithmetic operation
 */
class BasicArithmetic extends Operation {

    /**
     * BasicArithmetic constructor
     */
    constructor() {
        super();

        this.name = "BasicArithmetic";
        this.module = "Default";
        this.description = "Evalutes Basic Arithmetic. <br><br>e.g. <code>1+2-1</code> becomes <code>2</code>";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "number";
        this.args = [];
    }
    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {number}
     */
    run(input, args) {
        if (input.length >= 1) {
            if (parseInt(input, 10).toString().length === input.length) {
                const val = parseInt(input, 10);
                return BigNumber.isBigNumber(val) ? val : new BigNumber(NaN);
            } else {
                return (input.replace(/\s/g, "").match(/[+-]?([0-9.]+)/g) || [])
                    .reduce(function (sum, value) {
                        const val = parseFloat(sum) + parseFloat(value);
                        return BigNumber.isBigNumber(val) ? val : new BigNumber(NaN);
                    });
            }
        } else {
            return new BigNumber(NaN);
        }
    }

}

export default BasicArithmetic;

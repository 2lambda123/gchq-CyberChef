/**
 * @author ccarpo [ccarpo@gmx.net]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import YAML from "yaml";

/**
 * JSON to YAML operation
 */
class JSONToYAML extends Operation {

    /**
     * JSONToYAML constructor
     */
    constructor() {
        super();

        this.name = "JSON to YAML";
        this.module = "Default";
        this.description = "Converts a JSON into a YAML";
        this.infoURL = "https://en.wikipedia.org/wiki/YAML";
        this.inputType = "JSON";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        try {
            return YAML.stringify(input);
        } catch (err) {
            throw new OperationError("Test");
        }
    }

}

export default JSONToYAML;

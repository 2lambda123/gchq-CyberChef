/* eslint no-console: 0 */

/**
 * nodeApi.js
 *
 * Test node api operations
 *
 * Aim of these tests is to ensure each arg type is
 * handled correctly by the wrapper.
 *
 * Generally just checking operations that use external dependencies to ensure
 * it behaves as expected in Node.
 *
 * @author d98762625 [d98762625@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import assert from "assert";
import it from "../assertionHandler.mjs";
import fs from "fs";

import {
    addLineNumbers,
    adler32Checksum,
    AESDecrypt,
    affineCipherDecode,
    affineCipherEncode,
    bifidCipherEncode,
    bitShiftRight,
    cartesianProduct,
    CSSMinify,
    toBase64,
    toHex,
} from "../../../src/node/index";
import chef from "../../../src/node/index.mjs";
import TestRegister from "../../lib/TestRegister.mjs";
import File from "../../../src/node/File.mjs";

global.File = File;

TestRegister.addApiTests([

    it("ADD: toggleString argument", () => {
        const result = chef.ADD("sample input", {
            key: {
                string: "some key",
                option: "Hex"
            }
        });
        assert.equal(result.toString(), "aO[^ZS\u000eW\\^cb");
    }),


    it("ADD: default option toggleString argument", () => {
        const result = chef.ADD(3, {
            key: "4",
        });
        assert.strictEqual(result.toString(), "7");
    }),

    it("addLineNumbers: No arguments", () => {
        const result = addLineNumbers("sample input");
        assert.equal(result.toString(), "1 sample input");
    }),

    it("adler32Checksum: No args", () => {
        const result = adler32Checksum("sample input");
        assert.equal(result.toString(), "1f2304d3");
    }),

    it("AES decrypt: toggleString and option", () => {
        const result = AESDecrypt("4a123af235a507bbc9d5871721d61b98504d569a9a5a7847e2d78315fec7", {
            key: {
                string: "some longer key1",
                option: "utf8",
            },
            iv: {
                string: "some iv some iv1",
                option: "utf8",
            },
            mode: "OFB",
        });
        assert.equal(result.toString(), "a slightly longer sampleinput?");
    }),

    it("AffineCipherDecode: number input", () => {
        const result = affineCipherDecode("some input", {
            a: 7,
            b: 4
        });
        assert.strictEqual(result.toString(), "cuqa ifjgr");
    }),

    it("affineCipherEncode: number input", () => {
        const result = affineCipherEncode("some input", {
            a: 11,
            b: 6
        });
        assert.strictEqual(result.toString(), "weiy qtpsh");
    }),

    it("analyzeHash", () => {
        const result = chef.analyseHash(chef.MD5("some input"));
        const expected = `Hash length: 32
Byte length: 16
Bit length:  128

Based on the length, this hash could have been generated by one of the following hashing functions:
MD5
MD4
MD2
HAVAL-128
RIPEMD-128
Snefru
Tiger-128`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("AND", () => {
        const result = chef.AND("Scot-free", {
            key: {
                string: "Raining Cats and Dogs",
                option: "Hex",
            }
        });
        assert.strictEqual(result.toString(), "\u0000\"M$(D  E");
    }),

    it("atBash Cipher", () => {
        const result = chef.atbashCipher("Happy as a Clam");
        assert.strictEqual(result.toString(), "Szkkb zh z Xozn");

    }),

    it("Bcrypt", async () => {
        const result = await chef.bcrypt("Put a Sock In It");
        const strResult = result.toString();
        assert.equal(strResult.length, 60);
        assert.equal(strResult.slice(0, 7), "$2a$10$");
    }),

    it("bcryptCompare", async() => {
        const result = await chef.bcryptCompare("Put a Sock In It", {
            hash: "$2a$10$2rT4a3XnIecBsd1H33dMTuyYE1HJ1n9F.V2rjQtAH73rh1qvOf/ae",
        });
        assert.strictEqual(result.toString(), "Match: Put a Sock In It");
    }),

    it("Bcrypt Parse", async () => {
        const result = await chef.bcryptParse("$2a$10$ODeP1.6fMsb.ENk2ngPUCO7qTGVPyHA9TqDVcyupyed8FjsiF65L6");
        const expected = `Rounds: 10
Salt: $2a$10$ODeP1.6fMsb.ENk2ngPUCO
Password hash: 7qTGVPyHA9TqDVcyupyed8FjsiF65L6
Full hash: $2a$10$ODeP1.6fMsb.ENk2ngPUCO7qTGVPyHA9TqDVcyupyed8FjsiF65L6`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("bifid cipher decode", () => {
        const result = chef.bifidCipherDecode("Vhef Qnte Ke Xfhz Mxon Bmgf", {
            keyword: "Alpha",
        });
        assert.strictEqual(result.toString(), "What Goes Up Must Come Down");
    }),

    it("bifid cipher encode: string option", () => {
        const result = bifidCipherEncode("some input", {
            keyword: "mykeyword",
        });
        assert.strictEqual(result.toString(), "nmhs zmsdo");
    }),

    it("bit shift left", () => {
        const result = chef.bitShiftLeft("Keep Your Eyes Peeled");
        assert.strictEqual(result.toString(), "ÊÊà@²Þêä@òÊæ@ ÊÊØÊÈ");
    }),

    it("bitShiftRight: number and option", () => {
        const result = bitShiftRight("some bits to shift", {
            type: "Arithmetic shift",
            amount: 1,
        });
        assert.strictEqual(result.toString(), "9762\u001014:9\u0010:7\u00109443:");
    }),

    it("Blowfish encrypt", () => {
        const result = chef.blowfishEncrypt("Fool's Gold", {
            key: {
                string: "One",
                option: "hex",
            },
            iv: {
                string: "Two",
                option: "utf8"
            }
        });
        assert.strictEqual(result.toString(), "8999b513bf2ff064b2977dea7e05f1b5");
    }),

    it("Blowfish decrypt", () => {
        const result = chef.blowfishDecrypt("8999b513bf2ff064b2977dea7e05f1b5", {
            key: {
                string: "One",
                option: "hex",
            },
            iv: {
                string: "Two",
                option: "utf8",
            }
        });
        assert.strictEqual(result.toString(), "Fool's Gold");
    }),

    it("BSON Serialise / Deserialise", () => {
        const result = chef.BSONDeserialise(chef.BSONSerialise("{\"phrase\": \"Mouth-watering\"}"));
        assert.strictEqual(result.toString(), `{
  "phrase": "Mouth-watering"
}`);
    }),

    it("Bzip2 Decompress", async () => {
        const result = await chef.bzip2Decompress(chef.fromBase64("QlpoOTFBWSZTWUdQlt0AAAIVgEAAAQAmJAwAIAAxBkxA0A2pTL6U2CozxdyRThQkEdQlt0A="));
        assert.strictEqual(result.toString(), "Fit as a Fiddle");
    }),

    it("cartesianProduct: binary string", () => {
        const result = cartesianProduct("1:2\\n\\n3:4", {
            itemDelimiter: ":",
        });
        assert.strictEqual(result.toString(), "(1,3):(1,4):(2,3):(2,4)");
    }),

    it("Change IP format", () => {
        const result = chef.changeIPFormat("172.20.23.54", {
            inputFormat: "Dotted Decimal",
            outputFormat: "Hex",
        });
        assert.strictEqual(result.toString(), "ac141736");
    }),

    it("Chi square", () => {
        const result = chef.chiSquare("Burst Your Bubble");
        assert.strictEqual(result.toString(), "433.55399816176475");
    }),

    it("Compare CTPH Hashes", () => {
        const result = chef.compareCTPHHashes("1234\n3456");
        assert.strictEqual(result.toString(), "0");
    }),

    it("Compare SSDEEPHashes", () => {
        const result = chef.compareCTPHHashes("1234\n3456");
        assert.strictEqual(result.toString(), "0");
    }),

    it("Convert area", () => {
        const result = chef.convertArea("12345", {
            inputUnits: "Square metre (sq m)",
            outputUnits: "Isle of Wight"
        });
        assert.strictEqual(result.toString(), "0.00003248684210526316");
    }),

    it("Convert data units", () => {
        const result = chef.convertDataUnits("12345", {
            inputUnits: "Bits (b)",
            outputUnits: "Kilobytes (KB)",
        });
        assert.strictEqual(result.toString(), "1.543125");
    }),

    it("Convert distance", () => {
        const result = chef.convertDistance("1234567", {
            inputUnits: "Nanometres (nm)",
            outputUnits: "Furlongs (fur)",
        });
        assert.strictEqual(result.toString(), "0.00000613699494949495");
    }),

    it("Convert mass", () => {
        const result = chef.convertMass("123", {
            inputUnits: "Earth mass (M⊕)",
            outputUnits: "Great Pyramid of Giza (6,000,000 tonnes)",
        });
        assert.strictEqual(result.toString(), "122429895000000000");
    }),

    it("Convert speed", () => {
        const result = chef.convertSpeed("123", {
            inputUnits: "Lunar escape velocity",
            outputUnits: "Jet airliner cruising speed",
        });
        assert.strictEqual(result.toString(), "1168.5");
    }),

    it("Count occurrences", () => {
        const result = chef.countOccurrences("Talk the Talk", {
            searchString: {
                string: "Tal",
                option: "Simple string",
            }
        });
        assert.strictEqual(result.toString(), "2");
    }),

    it("CRC16 Checksum", () => {
        const result = chef.CRC16Checksum("Rain on Your Parade");
        assert.strictEqual(result.toString(), "db1c");
    }),

    it("CRC32 Checksum", () => {
        const result = chef.CRC32Checksum("Rain on Your Parade");
        assert.strictEqual(result.toString(), "e902f76c");
    }),

    it("CSS Beautify", () => {
        const result = chef.CSSBeautify("header {color:black;padding:3rem;}");
        const expected = `header {
\\tcolor:black;
\\tpadding:3rem;
}
`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("CSS minify: boolean", () => {
        const input = `header {
// comment
width: 100%;
color: white;
}`;
        const result = CSSMinify(input, {
            preserveComments: true,
        });
        assert.strictEqual(result.toString(), "header {// comment width: 100%;color: white;}");
    }),

    it("CSS Selector", () => {
        const result = chef.CSSSelector("<html><header><h1>Hello</h1></header></html>", {
            cssSelector: "h1",
        });
        assert.strictEqual(result.toString(), "<h1>Hello</h1>");
    }),

    it("CTPH", () => {
        const result = chef.CTPH("If You Can't Stand the Heat, Get Out of the Kitchen");
        assert.strictEqual(result.toString(), "A:+EgFgBKAA0V0UFfClEs6:+Qk0gUFse");
    }),

    it("Decode NetBIOS Name", () => {
        assert.strictEqual(chef.decodeNetBIOSName("EBGMGMCAEHHCGFGFGLCAFEGPCAENGFCA").toString(), "All Greek To Me");
    }),

    it("Decode text", () => {
        const encoded = chef.encodeText("Ugly Duckling", {
            encoding: "UTF16LE (1200)",
        });
        const result = chef.decodeText(encoded, {
            encoding: "UTF16LE (1200)",
        });
        assert.strictEqual(result.toString(), "Ugly Duckling");
    }),

    it("Derive EVP Key", () => {
        const result = chef.deriveEVPKey("", {
            passphrase: {
                string: "46 6c 65 61 20 4d 61 72 6b 65 74",
                option: "Hex",
            },
            salt: {
                string: "Market",
                option: "Hex",
            },
        });
        assert.strictEqual(result.toString(), "7c21a9f5063a4d62fb1050068245c181");
    }),

    it("Derive PBKDF2 Key", () => {
        const result = chef.derivePBKDF2Key("", {
            passphrase: {
                string: "Jack of All Trades Master of None",
                option: "utf8",
            },
            keySize: 256,
            iterations: 2,
            hashingFunction: "md5",
            salt: {
                string: "fruit",
                option: "utf8"
            }
        });
        assert.strictEqual(result.toString(), "728a885b209e8b19cbd7430ca32608ff09190f7ccb7ded204e1d4c50f87c47bf");
    }),

    it("DES Decrypt", () => {
        const result = chef.DESDecrypt("713081c66db781c323965ba8f166fd8c230c3bb48504a913", {
            key: {
                string: "onetwoth",
                option: "utf8",
            },
            iv: {
                string: "threetwo",
                option: "Hex",
            },
            mode: "ECB",
        });
        assert.strictEqual(result.toString(), "Put a Sock In It");
    }),

    it("DES Encrypt", () => {
        const result = chef.DESEncrypt("Put a Sock In It", {
            key: {
                string: "onetwoth",
                option: "utf8",
            },
            iv: {
                string: "threetwo",
                option: "Hex",
            },
            mode: "ECB",
        });
        assert.strictEqual(result.toString(), "713081c66db781c323965ba8f166fd8c230c3bb48504a913");
    }),

    it("Diff", () => {
        const result = chef.diff("one two\\n\\none two three");
        assert.strictEqual(result.toString(), "one two three");
    }),

    it("Disassemble x86", () => {
        const result = chef.disassembleX86(chef.toBase64("one two three"));
        const expected = `0000000000000000 0000                            ADD BYTE PTR [RAX],AL\r
0000000000000002 0B250000000B                    OR ESP,DWORD PTR [0000000-F4FFFFF8]\r
`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("Divide", () => {
        assert.strictEqual(chef.divide("4\n7").toString(), "0.57142857142857142857");
    }),

    it("Drop bytes", () => {
        assert.strictEqual(chef.dropBytes("There's No I in Team").toString(), "'s No I in Team");
    }),

    it("Entropy", () => {
        const result = chef.entropy("Ride Him, Cowboy!");
        assert.strictEqual(result.toString(), "3.734521664779752");
    }),

    it("Escape string", () => {
        const result = chef.escapeString("Know the Ropes", {
            escapeLevel: "Everything",
            JSONCompatible: false,
            ES6Compatible: true,
            uppercaseHex: true,
        });
        assert.strictEqual(result.toString(), "\\x4B\\x6E\\x6F\\x77\\x20\\x74\\x68\\x65\\x20\\x52\\x6F\\x70\\x65\\x73");
    }),

    it("Escape unicode characters", () => {
        assert.strictEqual(chef.escapeUnicodeCharacters("σου").toString(), "\\u03C3\\u03BF\\u03C5");
    }),

    it("Expand alphabet range", () => {
        assert.strictEqual(
            chef.expandAlphabetRange("Fight Fire With Fire", {delimiter: "t"}).toString(),
            "Ftitgthttt tFtitrtet tWtitttht tFtitrte");
    }),

    it("Extract dates", () => {
        assert.strictEqual(chef.extractDates("Don't Look a Gift Horse In The Mouth 01/02/1992").toString(), "01/02/1992\n");
    }),

    it("Filter", () => {
        const result = chef.filter(
            `I Smell a Rat
Every Cloud Has a Silver Lining
Top Drawer`, {
                regex: "Every",
            });
        const expected = "Every Cloud Has a Silver Lining";
        assert.strictEqual(result.toString(), expected);
    }),

    it("Find / Replace", () => {
        assert.strictEqual(
            chef.findReplace(
                "Curiosity Killed The Cat",
                {
                    find: {
                        string: "l",
                        option: "Regex",
                    },
                    replace: "s",
                }).toString(),
            "Curiosity Kissed The Cat");
    }),

    it("Fletcher8 Checksum", () => {
        assert.strictEqual(chef.fletcher8Checksum("Keep Your Eyes Peeled").toString(), "48");
    }),

    it("Format MAC addresses", () => {
        const result = chef.formatMACAddresses("00-01-02-03-04-05");
        const expected = `000102030405
000102030405
00-01-02-03-04-05
00-01-02-03-04-05
00:01:02:03:04:05
00:01:02:03:04:05
`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("Frequency distribution", () => {
        const result = chef.frequencyDistribution("Don't Count Your Chickens Before They Hatch");
        const expected = "{\"dataLength\":43,\"percentages\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13.953488372093023,0,0,0,0,0,0,2.3255813953488373,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.3255813953488373,4.651162790697675,2.3255813953488373,0,0,0,2.3255813953488373,0,0,0,0,0,0,0,0,0,0,0,2.3255813953488373,0,0,0,0,2.3255813953488373,0,0,0,0,0,0,0,2.3255813953488373,0,4.651162790697675,0,9.30232558139535,2.3255813953488373,0,6.976744186046512,2.3255813953488373,0,2.3255813953488373,0,0,6.976744186046512,9.30232558139535,0,0,4.651162790697675,2.3255813953488373,6.976744186046512,4.651162790697675,0,0,0,2.3255813953488373,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"distribution\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,2,0,4,1,0,3,1,0,1,0,0,3,4,0,0,2,1,3,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"bytesRepresented\":22}";
        // Whacky formatting, but the data is all there
        assert.strictEqual(result.toString().replace(/\r?\n|\r|\s/g, ""), expected);
    }),

    it("From base", () => {
        assert.strictEqual(chef.fromBase("11", {radix: 13}).toString(), "14");
    }),

    it("From BCD", () => {
        assert.strictEqual(chef.fromBCD("1143", { inputFormat: "Raw", scheme: "7 4 2 1"}).toString(), "31313433");
    }),

    it("From binary", () => {
        assert.strictEqual(chef.fromBinary("010101011100101101011010").toString(), "UËZ");
    }),

    it("From Charcode", () => {
        assert.strictEqual(chef.fromCharcode("4c 6f 6e 67 20 49 6e 20 54 68 65 20 54 6f 6f 74 68 0a").toString(), "Long In The Tooth\n");
    }),

    it("From decimal", () => {
        assert.strictEqual(chef.fromDecimal("72 101 108 108 111").toString(), "Hello");
    }),

    it("From hex", () => {
        assert.strictEqual(chef.fromHex("52 69 6e 67 20 41 6e 79 20 42 65 6c 6c 73 3f").toString(), "Ring Any Bells?");
    }),

    it("From hex content", () => {
        assert.strictEqual(chef.fromHexContent("foo|3d|bar").toString(), "foo=bar");
    }),

    it("To and From hex dump", () => {
        assert.strictEqual(chef.fromHexdump(chef.toHexdump("Elephant in the Room")).toString(), "Elephant in the Room");
    }),

    it("From HTML entity", () => {
        assert.strictEqual(chef.fromHTMLEntity("&amp;").toString(), "&");
    }),

    it("To and From morse code", () => {
        assert.strictEqual(chef.fromMorseCode(chef.toMorseCode("Put a Sock In It")).toString(), "PUT A SOCK IN IT");
    }),

    it("From octal", () => {
        assert.strictEqual(chef.fromOctal("113 156 157 167 40 164 150 145 40 122 157 160 145 163").toString(), "Know the Ropes");
    }),

    it("To, From punycode", () => {
        assert.strictEqual(chef.fromPunycode(chef.toPunycode("münchen")).toString(), "münchen");
    }),

    it("From unix timestamp", () => {
        assert.strictEqual(chef.fromUNIXTimestamp("978346800").toString(), "Mon 1 January 2001 11:00:00 UTC");
    }),

    it("Generate HOTP", () => {
        const result = chef.generateHOTP("Cut The Mustard", {
            name: "colonel",
        });
        const expected = `URI: otpauth://hotp/colonel?secret=IN2XIICUNBSSATLVON2GC4TE

Password: 034148`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("Generate PGP Key Pair", async () => {
        const result = await chef.generatePGPKeyPair("Back To the Drawing Board", {
            keyType: "ECC-256",
        });
        assert.strictEqual(result.toString().length, 2005);
    }),

    it("Generate UUID", () => {
        const result = chef.generateUUID();
        assert.ok(result.toString());
        assert.strictEqual(result.toString().length, 36);
    }),

    it("Gzip, Gunzip", () => {
        assert.strictEqual(chef.gunzip(chef.gzip("Down To The Wire")).toString(), "Down To The Wire");
    }),

    it("Hex to Object Identifier", () => {
        assert.strictEqual(
            chef.hexToObjectIdentifier(chef.toHex("You Can't Teach an Old Dog New Tricks")).toString(),
            "2.9.111.117.32.67.97.110.39.116.32.84.101.97.99.104.32.97.110.32.79.108.100.32.68.111.103.32.78.101.119.32.84.114.105.99.107.115");
    }),

    it("Hex to PEM", () => {
        const result = chef.hexToPEM(chef.toHex("Yada Yada"));
        const expected = `-----BEGIN CERTIFICATE-----\r
WWFkYSBZYWRh\r
-----END CERTIFICATE-----\r\n`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("HMAC", () => {
        assert.strictEqual(chef.HMAC("On Cloud Nine", {key: "idea"}).toString(), "e15c268b4ee755c9e52db094ed50add7");
    }),

    it("JPathExpression", () => {
        assert.strictEqual(chef.JPathExpression("{\"key\" : \"value\"}", {query: "$.key"}).toString(), "\"value\"");
    }),

    it("JSON Beautify", () => {
        assert.strictEqual(
            chef.JSONBeautify("{\"key\" : \"value\"}").toString(),
            `{
    "key": "value"
}`);
    }),

    it("Keccak", () => {
        assert.strictEqual(chef.keccak("Flea Market").toString(), "c2a06880b19e453ee5440e8bd4c2024bedc15a6630096aa3f609acfd2b8f15f27cd293e1cc73933e81432269129ce954a6138889ce87831179d55dcff1cc7587");
    }),

    it("MD6", () => {
        assert.strictEqual(chef.MD6("Head Over Heels", {key: "arty"}).toString(), "d8f7fe4931fbaa37316f76283d5f615f50ddd54afdc794b61da522556aee99ad");
    }),

    it("Parse ASN.1 Hex string", () => {
        assert.strictEqual(chef.parseASN1HexString(chef.toHex("Mouth-watering")).toString(), "UNKNOWN(4d) 7574682d7761746572696e67\n");
    }),

    it("Parse DateTime", () => {
        const result = chef.parseDateTime("06/07/2001 01:59:30");
        const expected = `Date: Friday 6th July 2001
Time: 01:59:30
Period: AM
Timezone: UTC
UTC offset: +0000

Daylight Saving Time: false
Leap year: false
Days in this month: 31

Day of year: 187
Week number: 2001
Quarter: 3`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("Parse IPV6 address", () => {
        const result = chef.parseIPv6Address("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        const expected = `Longhand:  2001:0db8:85a3:0000:0000:8a2e:0370:7334
Shorthand: 2001:db8:85a3::8a2e:370:7334

This is a documentation IPv6 address. This range should be used whenever an example IPv6 address is given or to model networking scenarios. Corresponds to 192.0.2.0/24, 198.51.100.0/24, and 203.0.113.0/24 in IPv4.
Documentation range: 2001:db8::/32`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("Parse URI", () => {
        const result = chef.parseURI("https://www.google.co.uk/search?q=almonds");
        const expected = `Protocol:	https:
Hostname:	www.google.co.uk
Path name:	/search
Arguments:
\tq = almonds
`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("Parse user agent", () => {
        const result = chef.parseUserAgent("Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 ");
        const expected = `Browser
    Name: Mozilla
    Version: 5.0
Device
    Model: unknown
    Type: unknown
    Vendor: unknown
Engine
    Name: Gecko
    Version: 47.0
OS
    Name: Windows
    Version: 7
CPU
    Architecture: amd64`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("PGP Encrypt and decrypt", async () => {
        const pbkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v2.1.3
Comment: https://keybase.io/crypto

xo0EXZtlowEEAKUqTFownTmqgXWu2KDrtyNYtFck7a16WM5QD95bFoAFFdnlwZ45
6Vw8G8LCzHdyRXYp/JF1GknDrAd7nIRE+SuSz2yVK5nlOCfO1HFcg2Ov7e7/pBwd
qawx9GUIsCKd/6NxwDuT4YqarLFsuwljRC/eQiibO+ejnhoiKcU69sTNABEBAAHN
AMK0BBMBCgAeBQJdm2WjAhsvAwsJBwMVCggCHgECF4ADFgIBAhkBAAoJEGS79V2S
7D0owtMD/RT+o4BQJ8NSQBDgkYf42uOOu1Ud6GuN89nX6n20yAZbmqQ8CHnHY+Qc
l6ft4HnbIaNrI3arp/C2C+cwFypmt1BKyFEJUXO7ft3i/IxnjpCorDyAMCDckDvq
uma1LWtUHLb5s/ZuGMSHnhuji74IRWuIofNPdf7bCZW1GMbW9jNUzo0EXZtlowEE
AL38zaNkPmUVQaowP696fayBo18Nxs0yOzC4+0TYv1B/k5aUb0Air2h+o/Xw4E42
Jh9gVdPSvhOAEqdV0UDe71wxa4cfAVMDY9v8ta81MWunChj3ISUk1oIQylTJNsY/
b4KWOrLaOtBD9dyFGCzss5vLVdqdMjVIW2Cz0hb6IYG7ABEBAAHCwIMEGAEKAA8F
Al2bZaMFCQ8JnAACGy4AqAkQZLv1XZLsPSidIAQZAQoABgUCXZtlowAKCRA16MU2
u2hFTX+JBACZ27xk0Afny2jjSoRzqLMrhzE7DBGcg2QqecMdNre12hVompAWcS4l
NFmPShKRi6UT8Zb38nD43vwfqwZImn60dOPqqAep3YF/Axm1u5HJb0aMEsb8O9jV
sVmNJv9jVTzPdlTGFQjuaeJfk5lwxB+5/O9NcgDhPgRAk9xb4FrT+xzmA/4tD11C
AdcITUkTZT4ZOo2418DGeaiaEqWcIkZeQG4Vh5TMj4QtZDwsYQhXPl5Zj1zKIN/1
gRrKC+ztaQoDG8pJXTTtc9inRU++dhMqnRGrPcz0VfVXFaiH7PUCy+4WpP6r5Bs5
YQ9ESHo+FsmIvDzU3e/PD0SfXfO4vqBrFYN8986NBF2bZaMBBADJafe0w9diaCNx
3A7e8MqjbNrhrLkD2cPxXspCATX3SuI19d2+hMiHZfKTyadBTIa+ICxvqoxwxyZD
raHSY3CWVZd1V4KB5mqf+3Zj5riLeGU0dtXwi/5c0bdUhBUgHiAMhi75p05jYih5
KsNxPcK9hEwPu7B+QeHURMiIgojTGQARAQABwsCDBBgBCgAPBQJdm2WjBQkDwmcA
AhsuAKgJEGS79V2S7D0onSAEGQEKAAYFAl2bZaMACgkQzdkMJSM5Bqg2rwP/Ue28
m3Fdfgh5JxouZ3Dm2KUDhZL95B+vdMk72acdoU7SRjlyDT8cApRqYx+MIXb8WrPN
1xCZnOM4zXeWIM0CAPQ1e/sCrK58L+P+eVngNmrW9epKtZ4L6hx+dqqja9vPZGQK
CsFAhA6A1gWB++OLk9Y6H23tWIdKEXMeAX7492zDYgP+OSPS79EWAqXL8SvmDrbl
WI5eiM6X5hAMrOjQqzXhatD7eP41N/FC3SfhyhX7hFbagO7MJG2AS5bmSvcuCdcN
wDwXd94B+7bfYgJIRKbr272yDwkyzGn+zmxzvMUt6ak5PNzfmadvhMZvIfDftswp
GYpXIUU0GObOgP2tpCGTErs=
=m++F
-----END PGP PUBLIC KEY BLOCK-----`;
        const privateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: Keybase OpenPGP v2.1.3
Comment: https://keybase.io/crypto

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
pCGTErs=
=Ya+/
-----END PGP PRIVATE KEY BLOCK-----`;

        const message = "A Fool and His Money are Soon Parted";

        const encrypted = await chef.PGPEncrypt(message, {
            publicKeyOfRecipient: pbkey,
        });
        const result = await chef.PGPDecrypt(encrypted, {
            privateKeyOfRecipient: privateKey,
        });

        assert.strictEqual(result.toString(), message);
    }),

    it("Raw deflate", () => {
        assert.strictEqual(chef.rawInflate(chef.rawDeflate("Like Father Like Son", { compressionType: "Fixed Huffman Coding"})).toString(), "Like Father Like Son");
    }),

    it("RC4", () => {
        assert.strictEqual(
            chef.RC4("Go Out On a Limb", {passphrase: {string: "Under Your Nose", option: "UTF8"}, inputFormat: "UTF8", outputFormat: "Hex"}).toString(),
            "7d17e60d9bc94b7f4095851c729e69a2");
    }),

    it("RC4 Drop", () => {
        assert.strictEqual(
            chef.RC4Drop("Go Out On a Limb", {passphrase: {string: "Under Your Nose", option: "UTF8"}, inputFormat: "UTF8", outputFormat: "Hex"}).toString(),
            "8fa5f2751d34476a0c857439f43816cf");
    }),

    it("Regular Expression", () => {
        assert.strictEqual(chef.regularExpression("Wouldn't Harm a Fly", {regex: "\\'[a-z]"}).toString(), "Wouldn't Harm a Fly");
    }),

    it("Remove EXIF", () => {
        const result = chef.removeEXIF(fs.readFileSync("tests/node/sampleData/pic.jpg"));
        assert.strictEqual(result.toString().length, 4582);
    }),

    it("Scan for embedded files", () => {
        const result = chef.scanForEmbeddedFiles(fs.readFileSync("src/web/static/images/cook_male-32x32.png"));
        const expected = "Scanning data for 'magic bytes' which may indicate embedded files.";
        assert.ok(result.toString().indexOf(expected) === 0);
    }),

    it("Scrypt", () => {
        assert.strictEqual(
            chef.scrypt("Playing For Keeps", {salt: {string: "salty", option: "Hex"}}).toString(),
            "5446b6d86d88515894a163201765bceed0bc39610b1506cdc4d939ffc638bc46e051bce756e2865165d89d955a43a7eb5504502567dea8bfc9e7d49aaa894c07");
    }),

    it("SHA3", () => {
        assert.strictEqual(
            chef.SHA3("benign gravel").toString(),
            "2b1e36e0dbe151a89887be08da3bad141908cce62327f678161bcf058627e87abe57e3c5fce6581678714e6705a207acbd5c1f37f7a812280bc2cc558f00bed9");
    }),

    it("Shake", () => {
        assert.strictEqual(
            chef.shake("murderous bloodshed").toString(),
            "b79b3bb88099330bc6a15122f8dfaededf57a33b51c748d5a94e8122ff18d21e12f83412926b7e4a77a85ba6f36aa4841685e78296036337175e40096b5ac000");
    }),

    it("Snefru", () => {
        assert.strictEqual(
            chef.snefru("demeaning milestone").toString(),
            "a671b48770fe073ce49e9259cc2f47d345a53712639f8ae23c5ad3fec19540a5");
    }),

    it("SQL Beautify", () => {
        const result = chef.SQLBeautify(`SELECT MONTH, ID, RAIN_I, TEMP_F 
FROM STATS;`);
        const expected = `SELECT MONTH,
         ID,
         RAIN_I,
         TEMP_F
FROM STATS;`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("SSDEEP", () => {
        assert.strictEqual(
            chef.SSDEEP("shotgun tyranny snugly").toString(),
            "3:DLIXzMQCJc:XERKc");
    }),

    it("strings", () => {
        const result = chef.strings("smothering ampersand abreast", {displayTotal: true});
        const expected = `Total found: 1

smothering ampersand abreast
`;
        assert.strictEqual(result.toString(), expected);
    }),

    it("toBase64: editableOption", () => {
        const result = toBase64("some input", {
            alphabet: {
                value: "0-9A-W+/a-zXYZ="
            },
        });
        assert.strictEqual(result.toString(), "StXkPI1gRe1sT0==");
    }),

    it("toBase64: editableOptions key is value", () => {
        const result = toBase64("some input", {
            alphabet: "0-9A-W+/a-zXYZ=",
        });
        assert.strictEqual(result.toString(), "StXkPI1gRe1sT0==");
    }),

    it("toBase64: editableOptions default", () => {
        const result = toBase64("some input");
        assert.strictEqual(result.toString(), "c29tZSBpbnB1dA==");
    }),

    it("To BCD", () => {
        assert.strictEqual(chef.toBCD("443").toString(), "0100 0100 0011");
    }),

    it("To CamelCase", () => {
        assert.strictEqual(chef.toCamelCase("Quickest Wheel").toString(), "quickestWheel");
    }),

    it("toHex: accepts args", () => {
        const result = toHex("some input", {
            delimiter: "Colon",
        });
        assert.strictEqual(result.toString(), "73:6f:6d:65:20:69:6e:70:75:74");
    }),

    it("To Kebab case", () => {
        assert.strictEqual(chef.toKebabCase("Elfin Gold").toString(), "elfin-gold");
    }),

    it("To punycode", () => {
        assert.strictEqual(chef.toPunycode("♠ ♣ ♥ ♦ ← ↑ ‍ →").toString(), "       -m06cw7klao368lfb3aq");
    }),

    it("to snake case", () => {
        assert.strictEqual(chef.toSnakeCase("Abhorrent Grass").value, "abhorrent_grass");
    }),

    it("to unix timestamp", () => {
        assert.strictEqual(chef.toUNIXTimestamp("2001-04-01").toString(), "986083200 (Sun 1 April 2001 00:00:00 UTC)");
    }),

    it("Translate DateTime format", () => {
        assert.strictEqual(chef.translateDateTimeFormat("01/04/1999 22:33:01").toString(), "Thursday 1st April 1999 22:33:01 +00:00 UTC");
    }),

    it("Triple DES encrypt / decrypt", () => {
        assert.strictEqual(
            chef.tripleDESDecrypt(
                chef.tripleDESEncrypt("Destroy Money", {
                    key: {string: "30 31 2f 30 34 2f 31 39 39 39 20 32 32 3a 33 33 3a 30 3130 31 2f 30 34", option: "Hex"},
                    iv: {string: "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 0000 00 00 00 00", option: "Hex"}}),
                {
                    key: {string: "30 31 2f 30 34 2f 31 39 39 39 20 32 32 3a 33 33 3a 30 3130 31 2f 30 34", option: "Hex"},
                    iv: {string: "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 0000 00 00 00 00", option: "Hex"}
                }).toString(),
            "Destroy Money");
    }),

    it("UNIX Timestamp to Windows Filetime", () => {
        assert.strictEqual(chef.UNIXTimestampToWindowsFiletime("2020735").toString(), "116464943350000000");
    }),

    it("XML Beautify", () => {
        assert.strictEqual(
            chef.XMLBeautify("<contact-info><company>abc</company></contact-info>").toString(),
            `<contact-info>
\\t<company>abc</company>
</contact-info>`);
    }),

    it("XOR: toggleString with default option", () => {
        assert.strictEqual(chef.XOR("fe023da5", {
            key: "73 6f 6d 65"
        }).toString(),
        "\u0015\n]W@\u000b\fP");
    }),

    it("XOR: toggleString with custom option", () => {
        assert.strictEqual(chef.XOR("fe023da5", {
            key: {
                string: "73 6f 6d 65",
                option: "utf8",
            }
        }).toString(),
        "QV\u0010\u0004UDWQ");
    }),

    it("XPath expression", () => {
        assert.strictEqual(
            chef.XPathExpression("<contact-info><company>abc</company></contact-info>", {xPath: "contact-info/company"}).toString(),
            "<company>abc</company>");
    }),

    it("Zlib deflate / inflate", () => {
        assert.strictEqual(chef.zlibInflate(chef.zlibDeflate("cut homer wile rooky grits dizen")).toString(), "cut homer wile rooky grits dizen");
    }),

    it("extract EXIF", () => {
        assert.strictEqual(
            chef.extractEXIF(fs.readFileSync("tests/node/sampleData/pic.jpg")).toString(),
            `Found 7 tags.

Orientation: 1
XResolution: 72
YResolution: 72
ResolutionUnit: 2
ColorSpace: 1
ExifImageWidth: 57
ExifImageHeight: 57`);
    }),

    it("Tar", () => {
        const tarred = chef.tar("some file content", {
            filename: "test.txt"
        });
        assert.strictEqual(tarred.type, 7);
        assert.strictEqual(tarred.value.size, 2048);
        assert.strictEqual(tarred.value.data.toString().substr(0, 8), "test.txt");
    }),

    it("Untar", () => {
        const tarred = chef.tar("some file content", {
            filename: "filename.txt",
        });
        const untarred = chef.untar(tarred);
        assert.strictEqual(untarred.type, 8);
        assert.strictEqual(untarred.value.length, 1);
        assert.strictEqual(untarred.value[0].name, "filename.txt");
        assert.strictEqual(untarred.value[0].data.toString(), "some file content");
    }),

    it("Zip", () => {
        const zipped = chef.zip("some file content", {
            filename: "sample.zip",
            comment: "added",
            operaringSystem: "Unix",
        });

        assert.strictEqual(zipped.type, 7);
        assert.ok(zipped.value.data.toString().includes("sample.zip"));
        assert.ok(zipped.value.data.toString().includes("added"));
    }),

    it("Unzip", () => {
        const zipped = chef.zip("some file content", {
            filename: "zipped.zip",
            comment: "zippy",
        });
        const unzipped = chef.unzip(zipped);

        assert.equal(unzipped.type, 8);
        assert.equal(unzipped.value[0].data, "some file content");
        assert.equal(unzipped.value[0].name, "zipped.zip");
    }),

    it("Unzip with password", () => {
        const zipped = chef.zip("some content", {
            password: "abcd",
        });
        const unzipped = chef.unzip(zipped, {
            password: "abcd",
        });

        assert.equal(unzipped.value[0].data, "some content");
    }),

]);


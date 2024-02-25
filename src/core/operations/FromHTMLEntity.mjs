/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * From HTML Entity operation
 */
class FromHTMLEntity extends Operation {
    /**
     * FromHTMLEntity constructor
     */
    constructor() {
        super();

        this.name = "From HTML Entity";
        this.module = "Encodings";
        this.description
            = "Converts HTML entities back to characters<br><br>e.g. <code>&amp;<span>amp;</span></code> becomes <code>&amp;</code>";
        this.infoURL = "https://wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
        this.checks = [
            {
                pattern: "&(?:#\\d{2,3}|#x[\\da-f]{2}|[a-z]{2,6});",
                flags: "i",
                args: []
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const regex = /&(#?x?[a-zA-Z0-9]{1,20});/g;
        let output = "",
            m,
            i = 0;

        while ((m = regex.exec(input))) {
            // Add up to match
            for (; i < m.index;) output += input[i++];

            // Add match
            const bite = entityToByte[m[1]];
            if (bite) {
                output += Utils.chr(bite);
            } else if (!bite && m[1][0] === "#" && m[1].length > 1 && /^#\d{1,6}$/.test(m[1])) {
                // Numeric entity (e.g. &#10;)
                const num = m[1].slice(1, m[1].length);
                output += Utils.chr(parseInt(num, 10));
            } else if (!bite && m[1][0] === "#" && m[1].length > 3 && /^#x[\dA-F]{2,8}$/i.test(m[1])) {
                // Hex entity (e.g. &#x3A;)
                const hex = m[1].slice(2, m[1].length);
                output += Utils.chr(parseInt(hex, 16));
            } else {
                // Not a valid entity, print as normal
                for (; i < regex.lastIndex;) output += input[i++];
            }

            i = regex.lastIndex;
        }
        // Add all after final match
        for (; i < input.length;) output += input[i++];

        return output;
    }
}

/**
 * Lookup table to translate HTML entity codes to their byte values.
 */
const entityToByte = {
    "Tab": 9,
    "NewLine": 10,
    "excl": 33,
    "quot": 34,
    "num": 35,
    "dollar": 36,
    "percnt": 37,
    "amp": 38,
    "apos": 39,
    "lpar": 40,
    "rpar": 41,
    "ast": 42,
    "plus": 43,
    "comma": 44,
    "period": 46,
    "sol": 47,
    "colon": 58,
    "semi": 59,
    "lt": 60,
    "equals": 61,
    "gt": 62,
    "quest": 63,
    "commat": 64,
    "lsqb": 91,
    "bsol": 92,
    "rsqb": 93,
    "Hat": 94,
    "lowbar": 95,
    "grave": 96,
    "lcub": 123,
    "verbar": 124,
    "rcub": 125,
    "nbsp": 160,
    "iexcl": 161,
    "cent": 162,
    "pound": 163,
    "curren": 164,
    "yen": 165,
    "brvbar": 166,
    "sect": 167,
    "uml": 168,
    "copy": 169,
    "ordf": 170,
    "laquo": 171,
    "not": 172,
    "shy": 173,
    "reg": 174,
    "macr": 175,
    "deg": 176,
    "plusmn": 177,
    "sup2": 178,
    "sup3": 179,
    "acute": 180,
    "micro": 181,
    "para": 182,
    "middot": 183,
    "cedil": 184,
    "sup1": 185,
    "ordm": 186,
    "raquo": 187,
    "frac14": 188,
    "frac12": 189,
    "frac34": 190,
    "iquest": 191,
    "Agrave": 192,
    "Aacute": 193,
    "Acirc": 194,
    "Atilde": 195,
    "Auml": 196,
    "Aring": 197,
    "AElig": 198,
    "Ccedil": 199,
    "Egrave": 200,
    "Eacute": 201,
    "Ecirc": 202,
    "Euml": 203,
    "Igrave": 204,
    "Iacute": 205,
    "Icirc": 206,
    "Iuml": 207,
    "ETH": 208,
    "Ntilde": 209,
    "Ograve": 210,
    "Oacute": 211,
    "Ocirc": 212,
    "Otilde": 213,
    "Ouml": 214,
    "times": 215,
    "Oslash": 216,
    "Ugrave": 217,
    "Uacute": 218,
    "Ucirc": 219,
    "Uuml": 220,
    "Yacute": 221,
    "THORN": 222,
    "szlig": 223,
    "agrave": 224,
    "aacute": 225,
    "acirc": 226,
    "atilde": 227,
    "auml": 228,
    "aring": 229,
    "aelig": 230,
    "ccedil": 231,
    "egrave": 232,
    "eacute": 233,
    "ecirc": 234,
    "euml": 235,
    "igrave": 236,
    "iacute": 237,
    "icirc": 238,
    "iuml": 239,
    "eth": 240,
    "ntilde": 241,
    "ograve": 242,
    "oacute": 243,
    "ocirc": 244,
    "otilde": 245,
    "ouml": 246,
    "divide": 247,
    "oslash": 248,
    "ugrave": 249,
    "uacute": 250,
    "ucirc": 251,
    "uuml": 252,
    "yacute": 253,
    "thorn": 254,
    "yuml": 255,
    "Amacr": 256,
    "amacr": 257,
    "Abreve": 258,
    "abreve": 259,
    "Aogon": 260,
    "aogon": 261,
    "Cacute": 262,
    "cacute": 263,
    "Ccirc": 264,
    "ccirc": 265,
    "Cdot": 266,
    "cdot": 267,
    "Ccaron": 268,
    "ccaron": 269,
    "Dcaron": 270,
    "dcaron": 271,
    "Dstrok": 272,
    "dstrok": 273,
    "Emacr": 274,
    "emacr": 275,
    "Edot": 278,
    "edot": 279,
    "Eogon": 280,
    "eogon": 281,
    "Ecaron": 282,
    "ecaron": 283,
    "Gcirc": 284,
    "gcirc": 285,
    "Gbreve": 286,
    "gbreve": 287,
    "Gdot": 288,
    "gdot": 289,
    "Gcedil": 290,
    "Hcirc": 292,
    "hcirc": 293,
    "Hstrok": 294,
    "hstrok": 295,
    "Itilde": 296,
    "itilde": 297,
    "Imacr": 298,
    "imacr": 299,
    "Iogon": 302,
    "iogon": 303,
    "Idot": 304,
    "imath": 305,
    "IJlig": 306,
    "ijlig": 307,
    "Jcirc": 308,
    "jcirc": 309,
    "Kcedil": 310,
    "kcedil": 311,
    "kgreen": 312,
    "Lacute": 313,
    "lacute": 314,
    "Lcedil": 315,
    "lcedil": 316,
    "Lcaron": 317,
    "lcaron": 318,
    "Lmidot": 319,
    "lmidot": 320,
    "Lstrok": 321,
    "lstrok": 322,
    "Nacute": 323,
    "nacute": 324,
    "Ncedil": 325,
    "ncedil": 326,
    "Ncaron": 327,
    "ncaron": 328,
    "napos": 329,
    "ENG": 330,
    "eng": 331,
    "Omacr": 332,
    "omacr": 333,
    "Odblac": 336,
    "odblac": 337,
    "OElig": 338,
    "oelig": 339,
    "Racute": 340,
    "racute": 341,
    "Rcedil": 342,
    "rcedil": 343,
    "Rcaron": 344,
    "rcaron": 345,
    "Sacute": 346,
    "sacute": 347,
    "Scirc": 348,
    "scirc": 349,
    "Scedil": 350,
    "scedil": 351,
    "Scaron": 352,
    "scaron": 353,
    "Tcedil": 354,
    "tcedil": 355,
    "Tcaron": 356,
    "tcaron": 357,
    "Tstrok": 358,
    "tstrok": 359,
    "Utilde": 360,
    "utilde": 361,
    "Umacr": 362,
    "umacr": 363,
    "Ubreve": 364,
    "ubreve": 365,
    "Uring": 366,
    "uring": 367,
    "Udblac": 368,
    "udblac": 369,
    "Uogon": 370,
    "uogon": 371,
    "Wcirc": 372,
    "wcirc": 373,
    "Ycirc": 374,
    "ycirc": 375,
    "Yuml": 376,
    "Zacute": 377,
    "zacute": 378,
    "Zdot": 379,
    "zdot": 380,
    "Zcaron": 381,
    "zcaron": 382,
    "fnof": 402,
    "imped": 437,
    "gacute": 501,
    "jmath": 567,
    "circ": 710,
    "caron": 711,
    "breve": 728,
    "dot": 729,
    "ring": 730,
    "ogon": 731,
    "tilde": 732,
    "dblac": 733,
    "DownBreve": 785,
    "UnderBar": 818,
    "Alpha": 913,
    "Beta": 914,
    "Gamma": 915,
    "Delta": 916,
    "Epsilon": 917,
    "Zeta": 918,
    "Eta": 919,
    "Theta": 920,
    "Iota": 921,
    "Kappa": 922,
    "Lambda": 923,
    "Mu": 924,
    "Nu": 925,
    "Xi": 926,
    "Omicron": 927,
    "Pi": 928,
    "Rho": 929,
    "Sigma": 931,
    "Tau": 932,
    "Upsilon": 933,
    "Phi": 934,
    "Chi": 935,
    "Psi": 936,
    "Omega": 937,
    "alpha": 945,
    "beta": 946,
    "gamma": 947,
    "delta": 948,
    "epsilon": 949,
    "zeta": 950,
    "eta": 951,
    "theta": 952,
    "iota": 953,
    "kappa": 954,
    "lambda": 955,
    "mu": 956,
    "nu": 957,
    "xi": 958,
    "omicron": 959,
    "pi": 960,
    "rho": 961,
    "sigmaf": 962,
    "sigma": 963,
    "tau": 964,
    "upsilon": 965,
    "phi": 966,
    "chi": 967,
    "psi": 968,
    "omega": 969,
    "thetasym": 977,
    "upsih": 978,
    "straightphi": 981,
    "piv": 982,
    "Gammad": 988,
    "gammad": 989,
    "kappav": 1008,
    "rhov": 1009,
    "epsi": 1013,
    "bepsi": 1014,
    "IOcy": 1025,
    "DJcy": 1026,
    "GJcy": 1027,
    "Jukcy": 1028,
    "DScy": 1029,
    "Iukcy": 1030,
    "YIcy": 1031,
    "Jsercy": 1032,
    "LJcy": 1033,
    "NJcy": 1034,
    "TSHcy": 1035,
    "KJcy": 1036,
    "Ubrcy": 1038,
    "DZcy": 1039,
    "Acy": 1040,
    "Bcy": 1041,
    "Vcy": 1042,
    "Gcy": 1043,
    "Dcy": 1044,
    "IEcy": 1045,
    "ZHcy": 1046,
    "Zcy": 1047,
    "Icy": 1048,
    "Jcy": 1049,
    "Kcy": 1050,
    "Lcy": 1051,
    "Mcy": 1052,
    "Ncy": 1053,
    "Ocy": 1054,
    "Pcy": 1055,
    "Rcy": 1056,
    "Scy": 1057,
    "Tcy": 1058,
    "Ucy": 1059,
    "Fcy": 1060,
    "KHcy": 1061,
    "TScy": 1062,
    "CHcy": 1063,
    "SHcy": 1064,
    "SHCHcy": 1065,
    "HARDcy": 1066,
    "Ycy": 1067,
    "SOFTcy": 1068,
    "Ecy": 1069,
    "YUcy": 1070,
    "YAcy": 1071,
    "acy": 1072,
    "bcy": 1073,
    "vcy": 1074,
    "gcy": 1075,
    "dcy": 1076,
    "iecy": 1077,
    "zhcy": 1078,
    "zcy": 1079,
    "icy": 1080,
    "jcy": 1081,
    "kcy": 1082,
    "lcy": 1083,
    "mcy": 1084,
    "ncy": 1085,
    "ocy": 1086,
    "pcy": 1087,
    "rcy": 1088,
    "scy": 1089,
    "tcy": 1090,
    "ucy": 1091,
    "fcy": 1092,
    "khcy": 1093,
    "tscy": 1094,
    "chcy": 1095,
    "shcy": 1096,
    "shchcy": 1097,
    "hardcy": 1098,
    "ycy": 1099,
    "softcy": 1100,
    "ecy": 1101,
    "yucy": 1102,
    "yacy": 1103,
    "iocy": 1105,
    "djcy": 1106,
    "gjcy": 1107,
    "jukcy": 1108,
    "dscy": 1109,
    "iukcy": 1110,
    "yicy": 1111,
    "jsercy": 1112,
    "ljcy": 1113,
    "njcy": 1114,
    "tshcy": 1115,
    "kjcy": 1116,
    "ubrcy": 1118,
    "dzcy": 1119,
    "ensp": 8194,
    "emsp": 8195,
    "emsp13": 8196,
    "emsp14": 8197,
    "numsp": 8199,
    "puncsp": 8200,
    "thinsp": 8201,
    "hairsp": 8202,
    "ZeroWidthSpace": 8203,
    "zwnj": 8204,
    "zwj": 8205,
    "lrm": 8206,
    "rlm": 8207,
    "hyphen": 8208,
    "ndash": 8211,
    "mdash": 8212,
    "horbar": 8213,
    "Verbar": 8214,
    "lsquo": 8216,
    "rsquo": 8217,
    "sbquo": 8218,
    "ldquo": 8220,
    "rdquo": 8221,
    "bdquo": 8222,
    "dagger": 8224,
    "Dagger": 8225,
    "bull": 8226,
    "nldr": 8229,
    "hellip": 8230,
    "permil": 8240,
    "pertenk": 8241,
    "prime": 8242,
    "Prime": 8243,
    "tprime": 8244,
    "bprime": 8245,
    "lsaquo": 8249,
    "rsaquo": 8250,
    "oline": 8254,
    "caret": 8257,
    "hybull": 8259,
    "frasl": 8260,
    "bsemi": 8271,
    "qprime": 8279,
    "MediumSpace": 8287,
    "NoBreak": 8288,
    "ApplyFunction": 8289,
    "InvisibleTimes": 8290,
    "InvisibleComma": 8291,
    "euro": 8364,
    "tdot": 8411,
    "TripleDot": 8411,
    "DotDot": 8412,
    "Copf": 8450,
    "incare": 8453,
    "gscr": 8458,
    "hamilt": 8459,
    "Hfr": 8460,
    "quaternions": 8461,
    "planckh": 8462,
    "planck": 8463,
    "Iscr": 8464,
    "image": 8465,
    "Lscr": 8466,
    "ell": 8467,
    "Nopf": 8469,
    "numero": 8470,
    "copysr": 8471,
    "weierp": 8472,
    "Popf": 8473,
    "rationals": 8474,
    "Rscr": 8475,
    "real": 8476,
    "reals": 8477,
    "rx": 8478,
    "trade": 8482,
    "integers": 8484,
    "ohm": 8486,
    "mho": 8487,
    "Zfr": 8488,
    "iiota": 8489,
    "angst": 8491,
    "bernou": 8492,
    "Cfr": 8493,
    "escr": 8495,
    "Escr": 8496,
    "Fscr": 8497,
    "phmmat": 8499,
    "order": 8500,
    "alefsym": 8501,
    "beth": 8502,
    "gimel": 8503,
    "daleth": 8504,
    "CapitalDifferentialD": 8517,
    "DifferentialD": 8518,
    "ExponentialE": 8519,
    "ImaginaryI": 8520,
    "frac13": 8531,
    "frac23": 8532,
    "frac15": 8533,
    "frac25": 8534,
    "frac35": 8535,
    "frac45": 8536,
    "frac16": 8537,
    "frac56": 8538,
    "frac18": 8539,
    "frac38": 8540,
    "frac58": 8541,
    "frac78": 8542,
    "larr": 8592,
    "uarr": 8593,
    "rarr": 8594,
    "darr": 8595,
    "harr": 8596,
    "varr": 8597,
    "nwarr": 8598,
    "nearr": 8599,
    "searr": 8600,
    "swarr": 8601,
    "nlarr": 8602,
    "nrarr": 8603,
    "rarrw": 8605,
    "Larr": 8606,
    "Uarr": 8607,
    "Rarr": 8608,
    "Darr": 8609,
    "larrtl": 8610,
    "rarrtl": 8611,
    "LeftTeeArrow": 8612,
    "UpTeeArrow": 8613,
    "map": 8614,
    "DownTeeArrow": 8615,
    "larrhk": 8617,
    "rarrhk": 8618,
    "larrlp": 8619,
    "rarrlp": 8620,
    "harrw": 8621,
    "nharr": 8622,
    "lsh": 8624,
    "rsh": 8625,
    "ldsh": 8626,
    "rdsh": 8627,
    "crarr": 8629,
    "cularr": 8630,
    "curarr": 8631,
    "olarr": 8634,
    "orarr": 8635,
    "lharu": 8636,
    "lhard": 8637,
    "uharr": 8638,
    "uharl": 8639,
    "rharu": 8640,
    "rhard": 8641,
    "dharr": 8642,
    "dharl": 8643,
    "rlarr": 8644,
    "udarr": 8645,
    "lrarr": 8646,
    "llarr": 8647,
    "uuarr": 8648,
    "rrarr": 8649,
    "ddarr": 8650,
    "lrhar": 8651,
    "rlhar": 8652,
    "nlArr": 8653,
    "nhArr": 8654,
    "nrArr": 8655,
    "lArr": 8656,
    "uArr": 8657,
    "rArr": 8658,
    "dArr": 8659,
    "hArr": 8660,
    "vArr": 8661,
    "nwArr": 8662,
    "neArr": 8663,
    "seArr": 8664,
    "swArr": 8665,
    "lAarr": 8666,
    "rAarr": 8667,
    "zigrarr": 8669,
    "larrb": 8676,
    "rarrb": 8677,
    "duarr": 8693,
    "loarr": 8701,
    "roarr": 8702,
    "hoarr": 8703,
    "forall": 8704,
    "comp": 8705,
    "part": 8706,
    "exist": 8707,
    "nexist": 8708,
    "empty": 8709,
    "nabla": 8711,
    "isin": 8712,
    "notin": 8713,
    "ni": 8715,
    "notni": 8716,
    "prod": 8719,
    "coprod": 8720,
    "sum": 8721,
    "minus": 8722,
    "mnplus": 8723,
    "plusdo": 8724,
    "setmn": 8726,
    "lowast": 8727,
    "compfn": 8728,
    "radic": 8730,
    "prop": 8733,
    "infin": 8734,
    "angrt": 8735,
    "ang": 8736,
    "angmsd": 8737,
    "angsph": 8738,
    "mid": 8739,
    "nmid": 8740,
    "par": 8741,
    "npar": 8742,
    "and": 8743,
    "or": 8744,
    "cap": 8745,
    "cup": 8746,
    "int": 8747,
    "Int": 8748,
    "tint": 8749,
    "conint": 8750,
    "Conint": 8751,
    "Cconint": 8752,
    "cwint": 8753,
    "cwconint": 8754,
    "awconint": 8755,
    "there4": 8756,
    "becaus": 8757,
    "ratio": 8758,
    "Colon": 8759,
    "minusd": 8760,
    "mDDot": 8762,
    "homtht": 8763,
    "sim": 8764,
    "bsim": 8765,
    "ac": 8766,
    "acd": 8767,
    "wreath": 8768,
    "nsim": 8769,
    "esim": 8770,
    "sime": 8771,
    "nsime": 8772,
    "cong": 8773,
    "simne": 8774,
    "ncong": 8775,
    "asymp": 8776,
    "nap": 8777,
    "ape": 8778,
    "apid": 8779,
    "bcong": 8780,
    "asympeq": 8781,
    "bump": 8782,
    "bumpe": 8783,
    "esdot": 8784,
    "eDot": 8785,
    "efDot": 8786,
    "erDot": 8787,
    "colone": 8788,
    "ecolon": 8789,
    "ecir": 8790,
    "cire": 8791,
    "wedgeq": 8793,
    "veeeq": 8794,
    "trie": 8796,
    "equest": 8799,
    "ne": 8800,
    "equiv": 8801,
    "nequiv": 8802,
    "le": 8804,
    "ge": 8805,
    "lE": 8806,
    "gE": 8807,
    "lnE": 8808,
    "gnE": 8809,
    "Lt": 8810,
    "Gt": 8811,
    "twixt": 8812,
    "NotCupCap": 8813,
    "nlt": 8814,
    "ngt": 8815,
    "nle": 8816,
    "nge": 8817,
    "lsim": 8818,
    "gsim": 8819,
    "nlsim": 8820,
    "ngsim": 8821,
    "lg": 8822,
    "gl": 8823,
    "ntlg": 8824,
    "ntgl": 8825,
    "pr": 8826,
    "sc": 8827,
    "prcue": 8828,
    "sccue": 8829,
    "prsim": 8830,
    "scsim": 8831,
    "npr": 8832,
    "nsc": 8833,
    "sub": 8834,
    "sup": 8835,
    "nsub": 8836,
    "nsup": 8837,
    "sube": 8838,
    "supe": 8839,
    "nsube": 8840,
    "nsupe": 8841,
    "subne": 8842,
    "supne": 8843,
    "cupdot": 8845,
    "uplus": 8846,
    "sqsub": 8847,
    "sqsup": 8848,
    "sqsube": 8849,
    "sqsupe": 8850,
    "sqcap": 8851,
    "sqcup": 8852,
    "oplus": 8853,
    "ominus": 8854,
    "otimes": 8855,
    "osol": 8856,
    "odot": 8857,
    "ocir": 8858,
    "oast": 8859,
    "odash": 8861,
    "plusb": 8862,
    "minusb": 8863,
    "timesb": 8864,
    "sdotb": 8865,
    "vdash": 8866,
    "dashv": 8867,
    "top": 8868,
    "perp": 8869,
    "models": 8871,
    "vDash": 8872,
    "Vdash": 8873,
    "Vvdash": 8874,
    "VDash": 8875,
    "nvdash": 8876,
    "nvDash": 8877,
    "nVdash": 8878,
    "nVDash": 8879,
    "prurel": 8880,
    "vltri": 8882,
    "vrtri": 8883,
    "ltrie": 8884,
    "rtrie": 8885,
    "origof": 8886,
    "imof": 8887,
    "mumap": 8888,
    "hercon": 8889,
    "intcal": 8890,
    "veebar": 8891,
    "barvee": 8893,
    "angrtvb": 8894,
    "lrtri": 8895,
    "xwedge": 8896,
    "xvee": 8897,
    "xcap": 8898,
    "xcup": 8899,
    "diam": 8900,
    "sdot": 8901,
    "sstarf": 8902,
    "divonx": 8903,
    "bowtie": 8904,
    "ltimes": 8905,
    "rtimes": 8906,
    "lthree": 8907,
    "rthree": 8908,
    "bsime": 8909,
    "cuvee": 8910,
    "cuwed": 8911,
    "Sub": 8912,
    "Sup": 8913,
    "Cap": 8914,
    "Cup": 8915,
    "fork": 8916,
    "epar": 8917,
    "ltdot": 8918,
    "gtdot": 8919,
    "Ll": 8920,
    "Gg": 8921,
    "leg": 8922,
    "gel": 8923,
    "cuepr": 8926,
    "cuesc": 8927,
    "nprcue": 8928,
    "nsccue": 8929,
    "nsqsube": 8930,
    "nsqsupe": 8931,
    "lnsim": 8934,
    "gnsim": 8935,
    "prnsim": 8936,
    "scnsim": 8937,
    "nltri": 8938,
    "nrtri": 8939,
    "nltrie": 8940,
    "nrtrie": 8941,
    "vellip": 8942,
    "ctdot": 8943,
    "utdot": 8944,
    "dtdot": 8945,
    "disin": 8946,
    "isinsv": 8947,
    "isins": 8948,
    "isindot": 8949,
    "notinvc": 8950,
    "notinvb": 8951,
    "isinE": 8953,
    "nisd": 8954,
    "xnis": 8955,
    "nis": 8956,
    "notnivc": 8957,
    "notnivb": 8958,
    "barwed": 8965,
    "Barwed": 8966,
    "lceil": 8968,
    "rceil": 8969,
    "lfloor": 8970,
    "rfloor": 8971,
    "drcrop": 8972,
    "dlcrop": 8973,
    "urcrop": 8974,
    "ulcrop": 8975,
    "bnot": 8976,
    "profline": 8978,
    "profsurf": 8979,
    "telrec": 8981,
    "target": 8982,
    "ulcorn": 8988,
    "urcorn": 8989,
    "dlcorn": 8990,
    "drcorn": 8991,
    "frown": 8994,
    "smile": 8995,
    "lang": 9001,
    "rang": 9002,
    "cylcty": 9005,
    "profalar": 9006,
    "topbot": 9014,
    "ovbar": 9021,
    "solbar": 9023,
    "angzarr": 9084,
    "lmoust": 9136,
    "rmoust": 9137,
    "tbrk": 9140,
    "bbrk": 9141,
    "bbrktbrk": 9142,
    "OverParenthesis": 9180,
    "UnderParenthesis": 9181,
    "OverBrace": 9182,
    "UnderBrace": 9183,
    "trpezium": 9186,
    "elinters": 9191,
    "blank": 9251,
    "oS": 9416,
    "boxh": 9472,
    "boxv": 9474,
    "boxdr": 9484,
    "boxdl": 9488,
    "boxur": 9492,
    "boxul": 9496,
    "boxvr": 9500,
    "boxvl": 9508,
    "boxhd": 9516,
    "boxhu": 9524,
    "boxvh": 9532,
    "boxH": 9552,
    "boxV": 9553,
    "boxdR": 9554,
    "boxDr": 9555,
    "boxDR": 9556,
    "boxdL": 9557,
    "boxDl": 9558,
    "boxDL": 9559,
    "boxuR": 9560,
    "boxUr": 9561,
    "boxUR": 9562,
    "boxuL": 9563,
    "boxUl": 9564,
    "boxUL": 9565,
    "boxvR": 9566,
    "boxVr": 9567,
    "boxVR": 9568,
    "boxvL": 9569,
    "boxVl": 9570,
    "boxVL": 9571,
    "boxHd": 9572,
    "boxhD": 9573,
    "boxHD": 9574,
    "boxHu": 9575,
    "boxhU": 9576,
    "boxHU": 9577,
    "boxvH": 9578,
    "boxVh": 9579,
    "boxVH": 9580,
    "uhblk": 9600,
    "lhblk": 9604,
    "block": 9608,
    "blk14": 9617,
    "blk12": 9618,
    "blk34": 9619,
    "squ": 9633,
    "squf": 9642,
    "EmptyVerySmallSquare": 9643,
    "rect": 9645,
    "marker": 9646,
    "fltns": 9649,
    "xutri": 9651,
    "utrif": 9652,
    "utri": 9653,
    "rtrif": 9656,
    "rtri": 9657,
    "xdtri": 9661,
    "dtrif": 9662,
    "dtri": 9663,
    "ltrif": 9666,
    "ltri": 9667,
    "loz": 9674,
    "cir": 9675,
    "tridot": 9708,
    "xcirc": 9711,
    "ultri": 9720,
    "urtri": 9721,
    "lltri": 9722,
    "EmptySmallSquare": 9723,
    "FilledSmallSquare": 9724,
    "starf": 9733,
    "bigstar": 9733,
    "star": 9734,
    "phone": 9742,
    "female": 9792,
    "male": 9794,
    "spades": 9824,
    "clubs": 9827,
    "hearts": 9829,
    "diams": 9830,
    "sung": 9834,
    "flat": 9837,
    "natur": 9838,
    "sharp": 9839,
    "check": 10003,
    "cross": 10007,
    "malt": 10016,
    "sext": 10038,
    "VerticalSeparator": 10072,
    "lbbrk": 10098,
    "rbbrk": 10099,
    "lobrk": 10214,
    "robrk": 10215,
    "Lang": 10218,
    "Rang": 10219,
    "loang": 10220,
    "roang": 10221,
    "xlarr": 10229,
    "xrarr": 10230,
    "xharr": 10231,
    "xlArr": 10232,
    "xrArr": 10233,
    "xhArr": 10234,
    "xmap": 10236,
    "dzigrarr": 10239,
    "nvlArr": 10498,
    "nvrArr": 10499,
    "nvHarr": 10500,
    "Map": 10501,
    "lbarr": 10508,
    "rbarr": 10509,
    "lBarr": 10510,
    "rBarr": 10511,
    "RBarr": 10512,
    "DDotrahd": 10513,
    "UpArrowBar": 10514,
    "DownArrowBar": 10515,
    "Rarrtl": 10518,
    "latail": 10521,
    "ratail": 10522,
    "lAtail": 10523,
    "rAtail": 10524,
    "larrfs": 10525,
    "rarrfs": 10526,
    "larrbfs": 10527,
    "rarrbfs": 10528,
    "nwarhk": 10531,
    "nearhk": 10532,
    "searhk": 10533,
    "swarhk": 10534,
    "nwnear": 10535,
    "nesear": 10536,
    "seswar": 10537,
    "swnwar": 10538,
    "rarrc": 10547,
    "cudarrr": 10549,
    "ldca": 10550,
    "rdca": 10551,
    "cudarrl": 10552,
    "larrpl": 10553,
    "curarrm": 10556,
    "cularrp": 10557,
    "rarrpl": 10565,
    "harrcir": 10568,
    "Uarrocir": 10569,
    "lurdshar": 10570,
    "ldrushar": 10571,
    "LeftRightVector": 10574,
    "RightUpDownVector": 10575,
    "DownLeftRightVector": 10576,
    "LeftUpDownVector": 10577,
    "LeftVectorBar": 10578,
    "RightVectorBar": 10579,
    "RightUpVectorBar": 10580,
    "RightDownVectorBar": 10581,
    "DownLeftVectorBar": 10582,
    "DownRightVectorBar": 10583,
    "LeftUpVectorBar": 10584,
    "LeftDownVectorBar": 10585,
    "LeftTeeVector": 10586,
    "RightTeeVector": 10587,
    "RightUpTeeVector": 10588,
    "RightDownTeeVector": 10589,
    "DownLeftTeeVector": 10590,
    "DownRightTeeVector": 10591,
    "LeftUpTeeVector": 10592,
    "LeftDownTeeVector": 10593,
    "lHar": 10594,
    "uHar": 10595,
    "rHar": 10596,
    "dHar": 10597,
    "luruhar": 10598,
    "ldrdhar": 10599,
    "ruluhar": 10600,
    "rdldhar": 10601,
    "lharul": 10602,
    "llhard": 10603,
    "rharul": 10604,
    "lrhard": 10605,
    "udhar": 10606,
    "duhar": 10607,
    "RoundImplies": 10608,
    "erarr": 10609,
    "simrarr": 10610,
    "larrsim": 10611,
    "rarrsim": 10612,
    "rarrap": 10613,
    "ltlarr": 10614,
    "gtrarr": 10616,
    "subrarr": 10617,
    "suplarr": 10619,
    "lfisht": 10620,
    "rfisht": 10621,
    "ufisht": 10622,
    "dfisht": 10623,
    "lopar": 10629,
    "ropar": 10630,
    "lbrke": 10635,
    "rbrke": 10636,
    "lbrkslu": 10637,
    "rbrksld": 10638,
    "lbrksld": 10639,
    "rbrkslu": 10640,
    "langd": 10641,
    "rangd": 10642,
    "lparlt": 10643,
    "rpargt": 10644,
    "gtlPar": 10645,
    "ltrPar": 10646,
    "vzigzag": 10650,
    "vangrt": 10652,
    "angrtvbd": 10653,
    "ange": 10660,
    "range": 10661,
    "dwangle": 10662,
    "uwangle": 10663,
    "angmsdaa": 10664,
    "angmsdab": 10665,
    "angmsdac": 10666,
    "angmsdad": 10667,
    "angmsdae": 10668,
    "angmsdaf": 10669,
    "angmsdag": 10670,
    "angmsdah": 10671,
    "bemptyv": 10672,
    "demptyv": 10673,
    "cemptyv": 10674,
    "raemptyv": 10675,
    "laemptyv": 10676,
    "ohbar": 10677,
    "omid": 10678,
    "opar": 10679,
    "operp": 10681,
    "olcross": 10683,
    "odsold": 10684,
    "olcir": 10686,
    "ofcir": 10687,
    "olt": 10688,
    "ogt": 10689,
    "cirscir": 10690,
    "cirE": 10691,
    "solb": 10692,
    "bsolb": 10693,
    "boxbox": 10697,
    "trisb": 10701,
    "rtriltri": 10702,
    "LeftTriangleBar": 10703,
    "RightTriangleBar": 10704,
    "race": 10714,
    "iinfin": 10716,
    "infintie": 10717,
    "nvinfin": 10718,
    "eparsl": 10723,
    "smeparsl": 10724,
    "eqvparsl": 10725,
    "lozf": 10731,
    "RuleDelayed": 10740,
    "dsol": 10742,
    "xodot": 10752,
    "xoplus": 10753,
    "xotime": 10754,
    "xuplus": 10756,
    "xsqcup": 10758,
    "qint": 10764,
    "fpartint": 10765,
    "cirfnint": 10768,
    "awint": 10769,
    "rppolint": 10770,
    "scpolint": 10771,
    "npolint": 10772,
    "pointint": 10773,
    "quatint": 10774,
    "intlarhk": 10775,
    "pluscir": 10786,
    "plusacir": 10787,
    "simplus": 10788,
    "plusdu": 10789,
    "plussim": 10790,
    "plustwo": 10791,
    "mcomma": 10793,
    "minusdu": 10794,
    "loplus": 10797,
    "roplus": 10798,
    "Cross": 10799,
    "timesd": 10800,
    "timesbar": 10801,
    "smashp": 10803,
    "lotimes": 10804,
    "rotimes": 10805,
    "otimesas": 10806,
    "Otimes": 10807,
    "odiv": 10808,
    "triplus": 10809,
    "triminus": 10810,
    "tritime": 10811,
    "iprod": 10812,
    "amalg": 10815,
    "capdot": 10816,
    "ncup": 10818,
    "ncap": 10819,
    "capand": 10820,
    "cupor": 10821,
    "cupcap": 10822,
    "capcup": 10823,
    "cupbrcap": 10824,
    "capbrcup": 10825,
    "cupcup": 10826,
    "capcap": 10827,
    "ccups": 10828,
    "ccaps": 10829,
    "ccupssm": 10832,
    "And": 10835,
    "Or": 10836,
    "andand": 10837,
    "oror": 10838,
    "orslope": 10839,
    "andslope": 10840,
    "andv": 10842,
    "orv": 10843,
    "andd": 10844,
    "ord": 10845,
    "wedbar": 10847,
    "sdote": 10854,
    "simdot": 10858,
    "congdot": 10861,
    "easter": 10862,
    "apacir": 10863,
    "apE": 10864,
    "eplus": 10865,
    "pluse": 10866,
    "Esim": 10867,
    "Colone": 10868,
    "Equal": 10869,
    "eDDot": 10871,
    "equivDD": 10872,
    "ltcir": 10873,
    "gtcir": 10874,
    "ltquest": 10875,
    "gtquest": 10876,
    "les": 10877,
    "ges": 10878,
    "lesdot": 10879,
    "gesdot": 10880,
    "lesdoto": 10881,
    "gesdoto": 10882,
    "lesdotor": 10883,
    "gesdotol": 10884,
    "lap": 10885,
    "gap": 10886,
    "lne": 10887,
    "gne": 10888,
    "lnap": 10889,
    "gnap": 10890,
    "lEg": 10891,
    "gEl": 10892,
    "lsime": 10893,
    "gsime": 10894,
    "lsimg": 10895,
    "gsiml": 10896,
    "lgE": 10897,
    "glE": 10898,
    "lesges": 10899,
    "gesles": 10900,
    "els": 10901,
    "egs": 10902,
    "elsdot": 10903,
    "egsdot": 10904,
    "el": 10905,
    "eg": 10906,
    "siml": 10909,
    "simg": 10910,
    "simlE": 10911,
    "simgE": 10912,
    "LessLess": 10913,
    "GreaterGreater": 10914,
    "glj": 10916,
    "gla": 10917,
    "ltcc": 10918,
    "gtcc": 10919,
    "lescc": 10920,
    "gescc": 10921,
    "smt": 10922,
    "lat": 10923,
    "smte": 10924,
    "late": 10925,
    "bumpE": 10926,
    "pre": 10927,
    "sce": 10928,
    "prE": 10931,
    "scE": 10932,
    "prnE": 10933,
    "scnE": 10934,
    "prap": 10935,
    "scap": 10936,
    "prnap": 10937,
    "scnap": 10938,
    "Pr": 10939,
    "Sc": 10940,
    "subdot": 10941,
    "supdot": 10942,
    "subplus": 10943,
    "supplus": 10944,
    "submult": 10945,
    "supmult": 10946,
    "subedot": 10947,
    "supedot": 10948,
    "subE": 10949,
    "supE": 10950,
    "subsim": 10951,
    "supsim": 10952,
    "subnE": 10955,
    "supnE": 10956,
    "csub": 10959,
    "csup": 10960,
    "csube": 10961,
    "csupe": 10962,
    "subsup": 10963,
    "supsub": 10964,
    "subsub": 10965,
    "supsup": 10966,
    "suphsub": 10967,
    "supdsub": 10968,
    "forkv": 10969,
    "topfork": 10970,
    "mlcp": 10971,
    "Dashv": 10980,
    "Vdashl": 10982,
    "Barv": 10983,
    "vBar": 10984,
    "vBarv": 10985,
    "Vbar": 10987,
    "Not": 10988,
    "bNot": 10989,
    "rnmid": 10990,
    "cirmid": 10991,
    "midcir": 10992,
    "topcir": 10993,
    "nhpar": 10994,
    "parsim": 10995,
    "parsl": 11005,
    "fflig": 64256,
    "filig": 64257,
    "fllig": 64258,
    "ffilig": 64259,
    "ffllig": 64260,
    "Ascr": 119964,
    "Cscr": 119966,
    "Dscr": 119967,
    "Gscr": 119970,
    "Jscr": 119973,
    "Kscr": 119974,
    "Nscr": 119977,
    "Oscr": 119978,
    "Pscr": 119979,
    "Qscr": 119980,
    "Sscr": 119982,
    "Tscr": 119983,
    "Uscr": 119984,
    "Vscr": 119985,
    "Wscr": 119986,
    "Xscr": 119987,
    "Yscr": 119988,
    "Zscr": 119989,
    "ascr": 119990,
    "bscr": 119991,
    "cscr": 119992,
    "dscr": 119993,
    "fscr": 119995,
    "hscr": 119997,
    "iscr": 119998,
    "jscr": 119999,
    "kscr": 120000,
    "lscr": 120001,
    "mscr": 120002,
    "nscr": 120003,
    "pscr": 120005,
    "qscr": 120006,
    "rscr": 120007,
    "sscr": 120008,
    "tscr": 120009,
    "uscr": 120010,
    "vscr": 120011,
    "wscr": 120012,
    "xscr": 120013,
    "yscr": 120014,
    "zscr": 120015,
    "Afr": 120068,
    "Bfr": 120069,
    "Dfr": 120071,
    "Efr": 120072,
    "Ffr": 120073,
    "Gfr": 120074,
    "Jfr": 120077,
    "Kfr": 120078,
    "Lfr": 120079,
    "Mfr": 120080,
    "Nfr": 120081,
    "Ofr": 120082,
    "Pfr": 120083,
    "Qfr": 120084,
    "Sfr": 120086,
    "Tfr": 120087,
    "Ufr": 120088,
    "Vfr": 120089,
    "Wfr": 120090,
    "Xfr": 120091,
    "Yfr": 120092,
    "afr": 120094,
    "bfr": 120095,
    "cfr": 120096,
    "dfr": 120097,
    "efr": 120098,
    "ffr": 120099,
    "gfr": 120100,
    "hfr": 120101,
    "ifr": 120102,
    "jfr": 120103,
    "kfr": 120104,
    "lfr": 120105,
    "mfr": 120106,
    "nfr": 120107,
    "ofr": 120108,
    "pfr": 120109,
    "qfr": 120110,
    "rfr": 120111,
    "sfr": 120112,
    "tfr": 120113,
    "ufr": 120114,
    "vfr": 120115,
    "wfr": 120116,
    "xfr": 120117,
    "yfr": 120118,
    "zfr": 120119,
    "Aopf": 120120,
    "Bopf": 120121,
    "Dopf": 120123,
    "Eopf": 120124,
    "Fopf": 120125,
    "Gopf": 120126,
    "Iopf": 120128,
    "Jopf": 120129,
    "Kopf": 120130,
    "Lopf": 120131,
    "Mopf": 120132,
    "Oopf": 120134,
    "Sopf": 120138,
    "Topf": 120139,
    "Uopf": 120140,
    "Vopf": 120141,
    "Wopf": 120142,
    "Xopf": 120143,
    "Yopf": 120144,
    "aopf": 120146,
    "bopf": 120147,
    "copf": 120148,
    "dopf": 120149,
    "eopf": 120150,
    "fopf": 120151,
    "gopf": 120152,
    "hopf": 120153,
    "iopf": 120154,
    "jopf": 120155,
    "kopf": 120156,
    "lopf": 120157,
    "mopf": 120158,
    "nopf": 120159,
    "oopf": 120160,
    "popf": 120161,
    "qopf": 120162,
    "ropf": 120163,
    "sopf": 120164,
    "topf": 120165,
    "uopf": 120166,
    "vopf": 120167,
    "wopf": 120168,
    "xopf": 120169,
    "yopf": 120170,
    "zopf": 120171
};

export default FromHTMLEntity;

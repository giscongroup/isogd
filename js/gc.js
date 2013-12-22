/* 
 * Copyright (c) 2012, ZAO "SevKavTISIZ"
 * vitaliy.gis@gmail.com
 */
(function (_win, _doc) {
    var _wml = {},
        _ng = _win.angular,
        _ = _win._,
        _css,
        _env,
        _tools,
        _deepCopy,
        _base64,
        _sha256,
        _parseXML,
        _joinObject,
        _extend,
        _isArray,
        _isTouch,
        _isRetina,
        _pixelsPerCm = 37.795275591,

        prefix,
        promise,

        GUID,
        _preloadImg;

    //устанавливаем функцию для анимирования графики
    _win.requestAnimationFrame = (function () {
        return  _win.requestAnimationFrame ||
            _win.webkitRequestAnimationFrame ||
            _win.mozRequestAnimationFrame ||
            _win.oRequestAnimationFrame ||
            _win.msRequestAnimationFrame ||
            function (callback) {
                _win.setTimeout(callback, 1000 / 60);
            };
    })();


    /*
     * GUID generation
     * */

    GUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /*
     * Browser's environment parametrs
     * like as touch support or css prefix
     * Use: wml.env
     */

    /*detect touch events*/
    _isTouch = !!('ontouchstart' in _win) || !!('onmsgesturechange' in _win);

    /*detect retina display*/
    _isRetina = _win.devicePixelRatio >= 2;

    /*detect css prefix*/
    prefix = (function () {
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                )[1],
            dom = ('webkit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
//        return {
//            dom: dom,
//            lowercase: pre,
//            css: '-' + pre + '-',
//            js: pre[0].toUpperCase() + pre.substr(1)
//        };
        return dom;

    })();

    _env = (function () {
        var
            mod = {};
        mod.retina = _isRetina;
        mod.devicePixelRatio = typeof _win.devicePixelRatio === 'number' ? _win.devicePixelRatio : 1;
        mod.isTouch = _isTouch;
        mod.prefix = prefix;
        mod.pxPerCm = _pixelsPerCm;
        mod.webgl = !!_win.WebGLRenderingContext && !!_doc.createElement('canvas').getContext("webgl");


        return mod;
    })();

    /*
     * checkIsArray
     * */

    _isArray = (function () {
        var ts = Object.prototype.toString;
        return function (obj) {
            return ts.call(obj) === '[object Array]';
        };
    })();

    /*
     * Other Tools block
     */

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function copyObjectProps(obj) {
        var key, newObj = {};
        for (key in obj)
            if (obj.hasOwnProperty(key) === true)
                newObj[key] = obj[key];
        return newObj;
    }

    _joinObject = function (obj, separator, keyToValue) {
        var
            res = '',
            first = true,
            sep = separator === undefined ? '&' : separator,
            keyToVal = keyToValue === undefined ? '=' : keyToValue;

        if (obj === undefined) {
            throw new Error('Nothing to parse');
        }


        _.each(obj, function (val, key) {
            if (first !== true) {
                res += sep;

            }
            if (val !== undefined)
                res += key + keyToVal + val.toString();
            first = false;
        });

        return res;
    }

    _extend = function (obj, extender) {
        if (extender !== undefined && typeof extender === 'object')

            _.each(extender, function (val, key) {
                if (obj.hasOwnProperty(key) === true) {
                    obj[key] = val;
                }
            });
        return obj;
    };

    _tools = (function () {
        var
            mod = {};
        mod.validateEmail = validateEmail;
        mod.copyObjectProps = copyObjectProps;
        mod.joinObject = _joinObject;
        mod.extend = _extend;
        return mod;

    })();

    /*
     * Recursive copy of all object properties
     *
     * */

    _deepCopy = function (parent, child) {
        var key;

        if (parent === undefined)
            return;

        if (child === undefined)
            child = _isArray(parent) === true ? [] : {};

        for (key in parent) {
            if (parent.hasOwnProperty(key) && key.indexOf('$$') !== 0) {

                if (typeof parent[key] === 'object' && parent[key] !== null) {
                    child[key] = _isArray(parent[key]) === true ? [] : {};
                    _deepCopy(parent[key], child[key]);
                }
                else
                    child[key] = parent[key];
            }
        }
        return child;
    };

    /**
     *
     *  Base64 encode / decode
     *  http://www.webtoolkit.info/
     *
     **/
    _base64 = {

// private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = this._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

// public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = this._utf8_decode(output);

            return output;

        },

// private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

// private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    }

    _sha256 = (function () {
        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
        /*  SHA-256 implementation in JavaScript | (c) Chris Veness 2002-2010 | www.movable-type.co.uk    */
        /*   - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                             */
        /*         http://csrc.nist.gov/groups/ST/toolkit/examples.html                                   */
        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

        var Sha256 = {};  // Sha256 namespace

        /**
         * Generates SHA-256 hash of string
         *
         * @param {String} msg                String to be hashed
         * @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash
         * @returns {String}                  Hash of msg as hex character string
         */
        Sha256.hash = function (msg, utf8encode) {
            utf8encode = (typeof utf8encode == 'undefined') ? true : utf8encode;

            // convert string to UTF-8, as SHA only deals with byte-streams
            if (utf8encode) msg = Utf8.encode(msg);

            // constants [§4.2.2]
            var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
                0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
                0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
                0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
                0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
                0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
                0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
                0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
            // initial hash value [§5.3.1]
            var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

            // PREPROCESSING

            msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

            // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
            var l = msg.length / 4 + 2;  // length (in 32-bit integers) of msg + ‘1’ + appended length
            var N = Math.ceil(l / 16);   // number of 16-integer-blocks required to hold 'l' ints
            var M = new Array(N);

            for (var i = 0; i < N; i++) {
                M[i] = new Array(16);
                for (var j = 0; j < 16; j++) {  // encode 4 chars per integer, big-endian encoding
                    M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                        (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
                } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
            }
            // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
            // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
            // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
            M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
            M[N - 1][14] = Math.floor(M[N - 1][14])
            M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;


            // HASH COMPUTATION [§6.1.2]

            var W = new Array(64);
            var a, b, c, d, e, f, g, h;
            for (var i = 0; i < N; i++) {

                // 1 - prepare message schedule 'W'
                for (var t = 0; t < 16; t++) W[t] = M[i][t];
                for (var t = 16; t < 64; t++) W[t] = (Sha256.sigma1(W[t - 2]) + W[t - 7] + Sha256.sigma0(W[t - 15]) + W[t - 16]) & 0xffffffff;

                // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
                a = H[0];
                b = H[1];
                c = H[2];
                d = H[3];
                e = H[4];
                f = H[5];
                g = H[6];
                h = H[7];

                // 3 - main loop (note 'addition modulo 2^32')
                for (var t = 0; t < 64; t++) {
                    var T1 = h + Sha256.Sigma1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
                    var T2 = Sha256.Sigma0(a) + Sha256.Maj(a, b, c);
                    h = g;
                    g = f;
                    f = e;
                    e = (d + T1) & 0xffffffff;
                    d = c;
                    c = b;
                    b = a;
                    a = (T1 + T2) & 0xffffffff;
                }
                // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
                H[0] = (H[0] + a) & 0xffffffff;
                H[1] = (H[1] + b) & 0xffffffff;
                H[2] = (H[2] + c) & 0xffffffff;
                H[3] = (H[3] + d) & 0xffffffff;
                H[4] = (H[4] + e) & 0xffffffff;
                H[5] = (H[5] + f) & 0xffffffff;
                H[6] = (H[6] + g) & 0xffffffff;
                H[7] = (H[7] + h) & 0xffffffff;
            }

            return Sha256.toHexStr(H[0]) + Sha256.toHexStr(H[1]) + Sha256.toHexStr(H[2]) + Sha256.toHexStr(H[3]) +
                Sha256.toHexStr(H[4]) + Sha256.toHexStr(H[5]) + Sha256.toHexStr(H[6]) + Sha256.toHexStr(H[7]);
        }

        Sha256.ROTR = function (n, x) {
            return (x >>> n) | (x << (32 - n));
        }
        Sha256.Sigma0 = function (x) {
            return Sha256.ROTR(2, x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x);
        }
        Sha256.Sigma1 = function (x) {
            return Sha256.ROTR(6, x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x);
        }
        Sha256.sigma0 = function (x) {
            return Sha256.ROTR(7, x) ^ Sha256.ROTR(18, x) ^ (x >>> 3);
        }
        Sha256.sigma1 = function (x) {
            return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x >>> 10);
        }
        Sha256.Ch = function (x, y, z) {
            return (x & y) ^ (~x & z);
        }
        Sha256.Maj = function (x, y, z) {
            return (x & y) ^ (x & z) ^ (y & z);
        }

//
// hexadecimal representation of a number
//   (note toString(16) is implementation-dependant, and
//   in IE returns signed numbers when used on full words)
//
        Sha256.toHexStr = function (n) {
            var s = "", v;
            for (var i = 7; i >= 0; i--) {
                v = (n >>> (i * 4)) & 0xf;
                s += v.toString(16);
            }
            return s;
        }


        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
        /*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
        /*              single-byte character encoding (c) Chris Veness 2002-2010                         */
        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

        var Utf8 = {};  // Utf8 namespace

        /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
        Utf8.encode = function (strUni) {
            // use regular expressions & String.replace callback function for better efficiency
            // than procedural approaches
            var strUtf = strUni.replace(
                /[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
                function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
                }
            );
            strUtf = strUtf.replace(
                /[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
                function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
                }
            );
            return strUtf;
        }

        /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
        Utf8.decode = function (strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            var strUni = strUtf.replace(
                /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
                function (c) {  // (note parentheses for precence)
                    var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | ( c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                }
            );
            strUni = strUni.replace(
                /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
                function (c) {  // (note parentheses for precence)
                    var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                    return String.fromCharCode(cc);
                }
            );
            return strUni;
        }

        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

        return Sha256;
    })();


    /*
     * AngularJS' other events support
     * Use: ng-focus="doSomthing()"
     * Use: ng-focus="doSomthing($event)" //$event - DOM event
     */

    (function () {
        var eventModule = _ng.module('eventModule', []);

        _ng.forEach(['ngFocus:focus', 'ngBlur:blur', 'ngKeydown:keydown', 'ngKeyup:keyup'], function (name) {
            var directive = name.split(':');
            var directiveName = directive[0];
            var eventName = directive[1];
            eventModule.directive(directiveName,
                ['$parse', function ($parse) {
                    return function (scope, element, attr) {
                        var fn = $parse(attr[directiveName]);
                        var opts = $parse(attr[directiveName + 'Opts'])(scope, {});
                        element.bind(eventName, function (event) {
                            scope.$apply(function () {
                                fn(scope, {$event: event});
                            });
                        });
                    };
                }]);
        });
    })();

    /*
     * chains for AngularJS
     */
    (function () {

        var
            chainModule = _ng.module('wml.chain', []),
            pop = [].pop;

        chainModule.factory('$chain', [ '$q', '$timeout', function ($q, $timeout) {
            var
                chain;

            chain = function (errorFn, tick) {

                if (this instanceof chain !== true)
                    return new chain(errorFn, tick);

                this.baseDef = $q.defer();
                this.lastDefer = this.baseDef;
                this.rejected = false;
                this.error = errorFn;
                this.errorArg = undefined;
                this.tick = tick;
            };

            chain.prototype.add = function () {
                var
                    args,
                    def,
                    currentDef,
                    local,
                    fn;

                fn = pop.call(arguments);

                if (typeof fn !== 'function') {
                    throw new Error(fn + ' is not a function');
                }

                args = arguments;
                def = $q.defer();
                local = this;

                def.rejected = function () {
                    return local.rejected;
                };

                currentDef = local.lastDefer;
                local.lastDefer = def;

                if (local.rejected === true)
                    currentDef.reject(local.errorArg);
                else
                    currentDef.promise.then((function (args) {
                        return function () {
                            var executer = function () {
                                "use strict";
                                if (local.rejected === true)
                                    def.reject(local.errorArg);
                                else {
//                                    console.log(fn.name);
                                    fn.apply(def, args);
                                }
                            };

                            if (local.tick === undefined)
                                executer();
                            else
                                $timeout(executer, local.tick)

                        };
                    })(args), local.error);
            };

            chain.prototype.reject = function (err) {
                this.rejected = true;
                this.errorArg = err;
            };
            chain.prototype.start = function (delay) {
                var self = this,
                    startFn = function () {
                        if (self.rejected === true) {
                            self.baseDef.reject();
                        }
                        else
                            self.baseDef.resolve();
                    };

                if (delay === undefined || delay === 0)
                    startFn.call();
                else
                    $timeout(startFn, delay);
            };

            return chain;
        }]);

    })();

    promise = (function () {
        var slice = Array.prototype.slice,
//            fargs = [],
            fns = []
            ;

        return function (fn, farguments, count, timout) {
            var ags = slice.call(arguments, 1),
                farguments = ags.length !== 0 ? ags.shift() : [],
                count = ags.length !== 0 ? ags.shift() : 25,
                timeout = ags.length !== 0 ? ags.shift() : 25,
                i = 0,
                index = _.indexOf(fns, fn),
                run;

            if (index === -1) {
                //var fagsIndex;
                fns.push(fn);
                //fargs.push(farguments);
                //fagsIndex = _.indexOf(fns, fn);
                run = function () {

                    if (fn.apply(this, farguments) === true) {
                        fns.splice(index, 1);
                        //fargs.splice(index, 1);
                        //console.log('promise completed');
                        return;
                    }

                    if (i >= count) {
                        fns.splice(index, 1);
                        //fargs.splice(index, 1);
                        console.log('promise failed: ' + fn.name);
                        return;
                    }


                    _win.setTimeout(function () {
                        run.call(this);
                    }, timeout);


                    i++;
                }

                //run.call(this);
                _win.setTimeout(function () {
                    run.call(this);
                }, timeout);
            }
            else {
                //fargs[index] = farguments;
                //console.log('rejected: ' + fn.name);
            }

        }
    })();

    /*
     * canvas, drawing dashed path
     * */
    (function () {
        var CP = _win.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
        if (CP && CP.lineTo) {
            CP.dashedLineTo = function (x, y, x2, y2, dashArray) {
                if (!dashArray) dashArray = [10, 5];
                if (dashLength == 0) dashLength = 0.001; // Hack for Safari
                var dashCount = dashArray.length;
                this.moveTo(x, y);
                var dx = (x2 - x), dy = (y2 - y);
                var slope = dy / dx;
                var distRemaining = Math.sqrt(dx * dx + dy * dy);
                var dashIndex = 0, draw = true;
                while (distRemaining >= 0.1) {
                    var dashLength = dashArray[dashIndex++ % dashCount];
                    if (dashLength > distRemaining) dashLength = distRemaining;
                    var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
                    if (dx < 0) xStep = -xStep;
                    x += xStep
                    y += slope * xStep;
                    this[draw ? 'lineTo' : 'moveTo'](x, y);
                    distRemaining -= dashLength;
                    draw = !draw;
                }
            }
        }
    })();

    _preloadImg = function (imageSrc, callback) {
        var urls, loadedImages, loadedCount = 0,
            error = undefined,
            checkState = function () {
                if (urls.length === loadedCount && typeof callback === 'function') {
//                    var test = '';
//                    for (var i = 0; i < loadedImages.length; i++)
//                    {
//                        test += i.toString() + ' --- ' + loadedImages[i].src + '\n';
//                    }
//
//                   alert(test);
                    callback(error, loadedImages);
                }


            },
            loadFn = function (ind) {
                loadedImages[ind] = this;
                loadedCount++;
                checkState();
            },
            errFn = function (ind) {
                if (error === undefined)
                    error = [];

                error.push(ind);
                loadedImages[ind] = this;

                loadedCount++;
                checkState();
            };

        if (_wml.isArray(imageSrc) === true)
            urls = imageSrc;
        else if (typeof imageSrc === 'string') {
            urls = [];
            urls.push(imageSrc);
        }

        loadedImages = new Array(urls.length);

        for (var i = 0; i < urls.length; i++) {
            var img = new Image();
            img.onload = (function (ind) {
                var ind = i;
                return function () {
                    loadFn.call(this, ind);
                }
            })(i);
            img.onerror = (function (ind) {
                var ind = i;
                return function () {
                    errFn.call(this, ind);
                }
            })(i);
            img.src = urls[i];
        }
    }


    _wml.promise = promise;
    _wml.css = _css;
    _wml.env = _env;
    _wml.deepCopy = _deepCopy;
    _wml.tools = _tools;
    _wml.Base64 = _base64;
    _wml.sha256 = _sha256;
    _wml.GUID = GUID;
//    _wml.parseXML = _parseXML;
    _wml.isArray = _isArray;
    _wml.preloadImages = _preloadImg;
    _win.wml = _wml;


})
    (window, document);



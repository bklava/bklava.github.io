'use strict';

export default class Utils {

    public static isIOS() {
        return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    }

}


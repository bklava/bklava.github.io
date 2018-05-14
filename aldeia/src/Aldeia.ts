import $ = require('jquery');

import Utils from './Utils'
import Console from './Console'
import QRCodeReader from './QRCodeReader';

import './styles.scss'

$(function () {

    try {
        //XXX debug
        // if (Utils.isIOS()) {
        //     new Console();
        // }

        new QRCodeReader();

    } catch (e) {
        alert(e);
    }

});
/**
 * Created by jarek on 01/04/2017.
 */

import jQuery from 'jquery';

const $ = jQuery;
window.jQuery = window.$ = $;

//let bootstrap = require('bootstrap');

class Main {
  constructor() {
    console.log('constructor Main go!');
    this.name = '';
  }

  setName(name) {
    this.name = name;
    $('#main .name').text(this.name);
  }
}

let main = new Main();
main.setName('world');
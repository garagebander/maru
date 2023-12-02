function Ban() {
  this.at = []; // [x][y] →x ↓y
  this.cnt = 0;
  for (var j = 0; j < Ban.w; j++) {
    this.at[j] = [];
    for (var i = 0; i < Ban.h; i++) {
      this.at[j][i] = 0;
    }
  }
  this.get = function (x, y) {
    return this.at[x][y];
  };
  this.set = function (x, y, v) {
    if (this.at[x][y] === 0) {
      this.cnt++;
    }
    this.at[x][y] = Number(v);
  };
  this.isfull = function () {
    return this.cnt >= Ban.full;
  };
  this.list = function () {
    var str = "";
    for (var i = 0; i < Ban.h; i++) {
      for (var j = 0; j < Ban.w; j++) {
        str += Ban.t[this.at[j][i]] + " ";
      }
      str += "\n";
    }
    mywriteln(str);
  };
  this.getStr = function (a) {
    var str = "";
    for (var i = 0; i < Ban.h; i++) {
      for (var j = 0; j < Ban.w; j++) {
        // str += String(this.at[j][i]);
        str += Ban.tt[a][this.at[j][i]];
      }
    }
    return str;
  };
  this.setAll = function (str) {
    for (var i = 0; i < Ban.h; i++) {
      for (var j = 0; j < Ban.w; j++) {
        this.at[j][i] = Number(str.substr(i * Ban.w + j, 1));
      }
    }
  };
  this.copy = function () {
    var b = new Ban();
    for (var i = 0; i < Ban.h; i++) {
      for (var j = 0; j < Ban.w; j++) {
        if (this.at[j][i]) {
          b.set(j, i, this.at[j][i]);
        }
      }
    }
    return b;
  };
  this.fin = function () {
    var i, j, a, l;
    // hori
    for (i = 0; i < Ban.h; i++) {
      for (j = 0; j <= Ban.w - Ban.l; j++) {
        for (a = 1; a <= 2; a++) {
          for (l = 0; l < Ban.l; l++) {
            // mywriteln("["+i+"]["+(j+l)+"]="+this.at[i][j+l]);
            if (this.at[j + l][i] != a) {
              break;
            }
          }
          if (l >= Ban.l) {
            return a;
          }
        }
      }
    }
    // vert
    for (i = 0; i <= Ban.h - Ban.l; i++) {
      for (j = 0; j < Ban.w; j++) {
        for (a = 1; a <= 2; a++) {
          for (l = 0; l < Ban.l; l++) {
            if (this.at[j][i + l] != a) {
              break;
            }
          }
          if (l >= Ban.l) {
            return a;
          }
        }
      }
    }
    // right down
    for (i = 0; i <= Ban.h - Ban.l; i++) {
      for (j = 0; j <= Ban.w - Ban.l; j++) {
        for (a = 1; a <= 2; a++) {
          for (l = 0; l < Ban.l; l++) {
            if (this.at[j + l][i + l] != a) {
              break;
            }
          }
          if (l >= Ban.l) {
            return a;
          }
        }
      }
    }
    // left down
    for (i = Ban.l - 1; i < Ban.h; i++) {
      for (j = 0; j <= Ban.w - Ban.l; j++) {
        for (a = 1; a <= 2; a++) {
          for (l = 0; l < Ban.l; l++) {
            if (this.at[j + l][i - l] != a) {
              break;
            }
          }
          if (l >= Ban.l) {
            return a;
          }
        }
      }
    }
    return 0;
  };
}

// Evaluate Table <1>が勝ったらプラス評価
function Eval() {
  this.etable = []; // new Array();
  this.min = 0;
  this.max = 0;
  this.init = function () {
    this.etable = []; // new Array();
  };
  this.set = function (str, num) {
    this.etable[str] = tonum(num);
    if (this.min > num) this.min = num;
    if (this.max < num) this.max = num;
  };
  this.get = function (str) {
    return tonum(this.etable[str]);
  };
  this.inc = function (str) {
    this.etable[str] = tonum(this.etable[str]) + 1;
    num = this.etable[str];
    if (this.max < num) this.max = num;
  };
  this.dec = function (str) {
    this.etable[str] = tonum(this.etable[str]) - 1;
    num = this.etable[str];
    if (this.min > num) this.min = num;
  };
  this.level = function () {
    return this.max - this.min;
  };
  this.log = function () {
    var count = 0;
    for (var key in etable) {
      mywriteln(count + ":" + key + "->" + etable[key]);
      count++;
      if (count > 300) break;
    }
  };
}

function com0(b, a) {
  if (b.isfull()) {
    mywriteln("Could not set. It's FULL.");
    return 0;
  }
  for (var f = 0; f < 10000; f++) {
    var s = Math.floor(Math.random() * Ban.w);
    var t = Math.floor(Math.random() * Ban.w);
    if (b.get(s, t) === 0) {
      b.set(s, t, a);
      return b;
    }
  }
  mywriteln("Could not set.");
  return 0;
}

function comsome(b, a) {
  if (0 === Math.floor(Math.random() * 5)) {
    return comrand(b, a);
  } else {
    return com(b, a);
  }
}
function com(b, a) {
  if (b.isfull()) {
    mywriteln("Could not set. It's FULL.");
    return 0;
  }

  // 勝つ場合
  var max = 0;
  var hit = 0;
  var x = -1;
  var y = -1;
  var i, j;
  for (i = 0; i < Ban.h; i++) {
    for (j = 0; j < Ban.w; j++) {
      if (!b.get(j, i)) {
        var bb = b.copy();
        bb.set(j, i, a);
        if (bb.fin()) {
          hit++;
          var on = Math.floor(Math.random() * hit);
          if (on === 0) {
            x = j;
            y = i;
          }
        }
      }
    }
  }
  if (x >= 0) {
    b.set(x, y, a);
    return b;
  }

  max = 0;
  hit = 0;
  x = -1;
  y = -1;
  for (i = 0; i < Ban.h; i++) {
    for (j = 0; j < Ban.w; j++) {
      if (!b.get(j, i)) {
        var bb = b.copy();
        bb.set(j, i, a);
        s = bb.getStr(a);
        // e = tonum(_etable[s]);
        e = tonum(_eval.get(s));
        if (hit === 0 || e > max) {
          max = e;
          hit = 1;
          x = j;
          y = i;
        } else if (e == max) {
          hit++;
          var on = Math.floor(Math.random() * hit);
          if (on === 0) {
            x = j;
            y = i;
          }
        }
      }
    }
  }
  b.set(x, y, a);
  return b;
}

function comrand(b, a) {
  if (b.isfull()) {
    mywriteln("Could not set. It's FULL.");
    return 0;
  }

  // 勝つ場合
  var max = 0;
  var hit = 0;
  var x = -1;
  var y = -1;
  for (var i = 0; i < Ban.h; i++) {
    for (var j = 0; j < Ban.w; j++) {
      if (!b.get(j, i)) {
        var bb = b.copy();
        bb.set(j, i, a);
        if (bb.fin()) {
          hit++;
          var on = Math.floor(Math.random() * hit);
          if (on === 0) {
            x = j;
            y = i;
          }
        }
      }
    }
  }
  if (x >= 0) {
    b.set(x, y, a);
    return b;
  }

  x = Math.floor(Math.random() * Ban.w);
  y = Math.floor(Math.random() * Ban.h);
  for (var lp = 0; lp < 1000; lp++) {
    if (!b.get(x, y)) {
      b.set(x, y, a);
      return b;
    }
    x = Math.floor(Math.random() * Ban.w);
    y = Math.floor(Math.random() * Ban.h);
  }
  return b;
}

var _ban;
var _v1;
var _v2;
// var _etable = []; // new Array();
var _eval = new Eval();
_eval.init();

function init() {
  Ban.w = 3;
  Ban.h = 3;
  Ban.full = Ban.w * Ban.h;
  Ban.l = 3;
  Ban.t = ["・", "O", "X"];
  Ban.tt = [
    ["", "", ""],
    ["・", "O", "X"],
    ["・", "X", "O"],
  ];

  // _etable = []; // new Array();
  _eval.init();

  start();
}

/*
var b = new Ban();
b.list();
b.set(3,2,1);
b.list();
WScript.echo(b.getStr(1));
var c = new Ban();
c.setAll(b.getStr(1));
c.list();
*/

function study() {
  mywriteln("Wait a minutes.");

  for (lp = 0; lp < 10000; lp++) {
    var b = new Ban();
    var v1 = new Array();
    var v2 = new Array();
    var won = 0;
    for (var n = 0; n < 1000; n++) {
      comsome(b, 1);
      v1.push(b.getStr(1));
      v2.push(b.getStr(2));
      won = b.fin();
      if (won) {
        break;
      }
      if (b.isfull()) {
        break;
      }

      comsome(b, 2);
      v1.push(b.getStr(1));
      v2.push(b.getStr(2));
      won = b.fin();
      if (won) {
        break;
      }
      if (b.isfull()) {
        break;
      }
    }

    if (won == 1) {
      for (var key in v1) {
        // _etable[v1[key]] = tonum(_etable[v1[key]]) + 1;
        _eval.inc(table[v1[key]]);
      }
      for (var key in v2) {
        // _etable[v2[key]] = tonum(_etable[v2[key]]) - 1;
        _eval.dec(table[v2[key]]);
      }
    }
    if (won == 2) {
      for (var key in v1) {
        // _etable[v1[key]] = tonum(_etable[v1[key]]) - 1;
        _eval.dec(table[v1[key]]);
      }
      for (var key in v2) {
        // _etable[v2[key]] = tonum(_etable[v2[key]]) + 1;
        _eval.inc(table[v2[key]]);
      }
    }
    // mywriteln("won:" + won);
    // b.list();
  }

  mywriteln("Ready. Level:" + _eval.level());
}

function log_etable() {
  _eva.log();
}

function writetable(ban) {
  document.getElementById("place11").textContent = Ban.tt[1][ban.get(0, 0)];
  document.getElementById("place21").textContent = Ban.tt[1][ban.get(1, 0)];
  document.getElementById("place31").textContent = Ban.tt[1][ban.get(2, 0)];
  document.getElementById("place12").textContent = Ban.tt[1][ban.get(0, 1)];
  document.getElementById("place22").textContent = Ban.tt[1][ban.get(1, 1)];
  document.getElementById("place32").textContent = Ban.tt[1][ban.get(2, 1)];
  document.getElementById("place13").textContent = Ban.tt[1][ban.get(0, 2)];
  document.getElementById("place23").textContent = Ban.tt[1][ban.get(1, 2)];
  document.getElementById("place33").textContent = Ban.tt[1][ban.get(2, 2)];
}

function start() {
  mywrite("Start a game. Level:" + _eval.level());
  _ban = new Ban();

  _v1 = new Array();
  _v2 = new Array();

  writetable(_ban);
}

function man(x, y) {
  var won = 0;

  _ban.set(x, y, 1);
  writetable(_ban);

  _v1.push(_ban.getStr(1));
  _v2.push(_ban.getStr(2));
  won = _ban.fin();
  // mywriteln("eval:" + won);
  if (won) {
    mywriteln("You won!!!");
    return;
  }
  if (_ban.isfull()) {
    mywriteln("Draw.");
    return;
  }

  com(_ban, 2);
  writetable(_ban);

  _v1.push(_ban.getStr(1));
  _v2.push(_ban.getStr(2));
  won = _ban.fin();
  // mywriteln("eval:" + won);
  if (won) {
    mywriteln("I won!!!");
    return;
  }
  if (_ban.isfull()) {
    mywriteln("Draw.");
    return;
  }
}

/* backup
for(var g=0; g<1000; g++){
    var b = new Ban();
    b.list();

    var v1 = new Array();
    var v2 = new Array();
    var won = 0;

    for(var n=0; n<1000; n++){

        var x = myread("x:") - 1;
        if((x<0) || (x>=Ban.w)) break;
        var y = myread("y:") - 1;
        if((y<0) || (y>=Ban.h)) break;
        b.set(x, y, 1);
        v1.push(b.getStr(1));
        v2.push(b.getStr(2));
        b.list();
        won = b.fin();
        mywriteln("eval:" + won);
        if(won){
            mywriteln("You won!!!");
            break;
        }
        if(b.isfull()) {
            mywriteln("Draw.");
            break;
        }

        com(b, 2);
        v1.push(b.getStr(1));
        v2.push(b.getStr(2));
        b.list();
        won = b.fin();
        mywriteln("eval:" + won);
        if(won){
            mywriteln("I won!!!");
            break;
        }
        if(b.isfull()) {
            mywriteln("Draw.");
            break;
        }
    }
    var again = myread("Again? (n->exit):");
    if(again == "n") break;

}
*/

/*
if(won == 1){
    for(var key in v1){
        etable[v1[key]] = tonum(etable[v1[key]]) + 1;
    }
    for(var key in v2){
        etable[v2[key]] = tonum(etable[v2[key]]) - 1;
    }
}
if(won == 2){
    for(var key in v1){
        etable[v1[key]] = tonum(etable[v1[key]]) - 1;
    }
    for(var key in v2){
        etable[v2[key]] = tonum(etable[v2[key]]) + 1;
    }
}

for(var key in etable){
    mywriteln(key + "->" + etable[key]);
}

*/

/*
mywrite("Enter any key.");
var x = myread();
*/

function mywrite(tx) {
  // WScript.StdOut.Write(tx);
  document.getElementById("message").innerText = tx;
}
function mywriteln(tx) {
  // WScript.StdOut.Writeline(tx);
  document.getElementById("message").innerHTML =
    document.getElementById("message").innerHTML + "<br>";
  document.getElementById("message").innerText =
    document.getElementById("message").innerText + tx;
}
function myread() {
  return WScript.StdIn.ReadLine();
}
function myread(prom) {
  mywrite(prom);
  return WScript.StdIn.ReadLine();
}

function tonum(any) {
  if (any) {
    return any;
  } else {
    return 0;
  }
}

// var tx = prompt("x", "");

/*
var obj=WScript.CreateObject("MSScriptControl.ScriptControl");
obj.language="vbscript";
var tx=obj.eval("inputbox(\"Message box prompt\",\"Message Box Title\")");

WScript.echo(tx);


function prompt (title, propopsal){
    var ie = new ActiveXObject("internetexplorer.application");
    ie.Navigate("about:blank");
    response = ie.document.parentWindow.prompt (title, propopsal);
    ie.Quit();
    return response;
}

function MyPrompt(text, value)
{
    // Create Internet Explorer application object.
    var oIE = WScript.CreateObject("InternetExplorer.Application");
    oIE.navigate("about:blank");  // Empty HTML document 
    oIE.Visible = 1;              // Keep Internet Explorer invisible.

    while (oIE.Busy) {}           // Important: Wait until Internet 
                                  // Explorer is ready.
 
    var obj = oIE.Document.Script;       // Get scripting object.
    var input = obj.prompt(text, value); // Open prompt window.
    oIE.Quit();                   // Close Internet Explorer object.
    return input;
}

*/

function dum() {
  var ncmp = function (a, b) {
    return a - b;
  };

  var qsort = function (ary, cmp) {
    function q(ary, head, tail) {
      var pivot = ary[parseInt(head + (tail - head) / 2)];
      var i = head - 1;
      var j = tail + 1;
      while (1) {
        while (cmp(ary[++i], pivot) < 0);
        while (cmp(ary[--j], pivot) > 0);
        if (i >= j) break;
        var tmp = ary[i];
        ary[i] = ary[j];
        ary[j] = tmp;
      }
      if (head < i - 1) q(ary, head, i - 1);
      if (j + 1 < tail) q(ary, j + 1, tail);
      return ary;
    }
    return q(ary, 0, ary.length - 1);
  };
  this.quick_sort = function (ary) {
    qsort(ary, ncmp);
  };
}

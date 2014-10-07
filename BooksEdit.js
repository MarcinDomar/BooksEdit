/**
 * 
 */
var initData;
var myAjax = new AjaxObj();
 var refreshTimer=setInterval(checkChangesInDB, 30000);
myAjax.sendRequest(new InitRequestObj());


function isDefined(x) {
    var undefined;
    return x !== undefined;

}

function getDbidCtrl(control) {
    parent_ = control.parentElement;
    while (parent_.className !== 'bookDiv')
	parent_ = parent_.parentElement;
    return parent_;
}

function onDeleteBt() {
    parent_ = this.parentElement;
    ctrls = parent_.firstChild.getElementsByClassName('updateCtrs');
    for (i = 0; i < ctrls.length; i++)
	ctrls[i].disabled = !ctrls[i].disabled;
    div = parent_.getElementsByClassName('uL1')[0];
    if (this.className == 'toDelete') {
	div.removeChild(document.getElementById("img" + parent_.id));
	this.className = 'toUpdate';
	this.value = 'Usuń Książkę';
	div.style.height = 'auto';
	this.className = 'Bt_Update';
    } else {
	this.className = 'toDelete';
	this.value = 'Anuluj usuwanie książki';
	img = document.createElement('img');
	img.src = 'res//cross.png';
	img.id = "img" + parent_.id;
	acHeight = div.offsetHeight * 0.8;
	div.appendChild(img);
	hig = (acHeight - div.style.paddingTop - div.style.paddingBottom
		- div.style.marginTop - div.style.marginBottom);
	img.width = img.naturalWidth * hig / img.naturalHeight;
	img.height = hig;
	img.style.position = 'relative';
	img.style.top = -(acHeight * 0.9) + 'px';
	div.style.height = acHeight + 'px';
    }
}

function AppendChildTag(parent, name, classname) {
    tag = document.createElement(name);
    if (isDefined(classname))
	tag.className = classname;
    parent.appendChild(tag);
    return tag;
}

function addInputEl(parentElement, tagname, type, desc, title, value,
	loseFocusFun) {

    rowDiv = AppendChildTag(parentElement, 'div', 'rowUp');
    var child = AppendChildTag(rowDiv, 'div');
    child.innerText = desc;

    child = AppendChildTag(rowDiv, tagname, 'updateCtrs');
    child.setAttribute('type', type);
    child.setAttribute('name', title);
    // child.setAttribute('value', value);
    child.value = value;
    child.onfocusout = loseFocusFun;

    return child;
}

function onLoseFocusYear() {
    if (isNaN(this.value))
	insertClassN(this, 'wrongData');
    else if (this.value < 1700 || this.value > (new Date()).getFullYear())
	insertClassN(this, 'wrongData');
    else {
	deleteClassN(this, 'wrongData');
	checkChangesAndMark.call(this);
    }
}

function onLoseFocusYearAddNew(btn) {
    if (isNaN(btn.value))
	insertClassN(btn, 'wrongData');
    else if (btn.value < 1700 || btn.value > (new Date()).getFullYear()) {
	insertClassN(btn, 'wrongData');
    } else {
	deleteClassN(btn, 'wrongData');
    }
}

function checkChangesAndMark() {
    book = getDbBook(getDbidCtrl(this).id);
    if (book[this.getAttribute('name')] == this.value)
	deleteClassN(this, 'dataChanged');
    else
	insertClassN(this, 'dataChanged');
}

function onLoseFocuseTextInputAddNew(ctrl) {
    value = ctrl.value.trim();
    if (value.length > 0) {
	deleteClassN(ctrl, 'wrongData');
    } else
	insertClassN(ctrl, 'wrongData');
}

function onLoseFocusTextInput() {
    value = this.value.trim();
    if (value.length > 0) {
	deleteClassN(this, 'wrongData');
	checkChangesAndMark.call(this);
    } else
	insertClassN(this, 'wrongData');
}

function getDbBook(id) {
    for ( var i = 0, iLen = initData.rows.length; i < iLen; i++) {

	if (initData.rows[i].id == id)
	    return initData.rows[i];
    }
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function insertClassN(ctrl, className) {
    if (!hasClass(ctrl, className))
	ctrl.className = ctrl.className + ' ' + className;
}

function deleteClassN(ctrl, className) {
    array = ctrl.className.split(' ');

    if (array[1] == className)
	array.pop();
    ctrl.className = array.join(' ');
}

function GetComunicationObj(action, timestemp) {
    this.timestemp = timestemp;
    this.action = action;
}

function isPermissonForUpdate() {

    booksCtrls = document.getElementById('booksFolder');
    errors = booksCtrls.getElementsByClassName("wrongData");
    for (i = 0; i < errors.length; i++) {
	if (!isCtrlBelongToToDelete(errors[i]))
	    break;
    }
    if (i == 0
	    && errors.length == 0
	    && (booksCtrls.getElementsByClassName('toDelete').length > 0 || booksCtrls
		    .getElementsByClassName('dataChanged').length > 0))
	return true;
    else
	return i == errors.length;
}
function checkChangesInDB() {
    if (myAjax.intervalFromCom() >= 60)// 3min
	myAjax.sendRequest(new CheckForDbChangesObj());
}

function addNewBook() {
    if (document.getElementById('nowyrecord').getElementsByClassName(
	    'wrongData').length == 0) {
	myAjax.sendRequest(new AddBookRequestObj());
    }
}

function onSaveChanges() {
    if (isPermissonForUpdate())
	myAjax.sendRequest(new SaverObj());

}

function AjaxObj() {
    var dtStart = new Date();
    var dtEnd = new Date();
    this.intervalFromCom = function() {
	if (this.isBusy())
	    return -1;
	else {
	    var dt = new Date();
	    return (dt.getTime() - dtEnd.getTime()) / 1000;
	}
    };
    this.isBusy = function() {
	return (dtEnd.getTime() - dtStart.getTime()) <= 0;
    };

    this.sendRequest = function(sender) {
	if (this.readyState == 1)
	    dtStart = new Date();
	this.request = new XMLHttpRequest();
	this.request.InterestedOfState = sender;
	this.request.open("POST", "servData.php", true);
	this.request.setRequestHeader("Content-Type",
		"application/json; charset=iso-8859-2");

	this.request.onreadystatechange = function() {
	    // wait(2);
	    if (this.readyState == 4 && this.status == 200) {
		dtEnd = new Date();
		if (this.responseText != null) {
		    this.InterestedOfState.thanksForData(JSON
			    .parse(this.responseText));
		} else if (ifDefined(this.InterestedOfState.NoDataError))
		    this.InterestedOfState.noDataError();
	    } else if (this.status != 200)
		dtEnd = new Date();

	    this.InterestedOfState.inform(this.readyState, this.status);
	};
	this.request.send(JSON.stringify(sender.dataPack));
    };

};

function isCtrlBelongToToDelete(ctrl) {
    return getDbidCtrl(ctrl).childNodes[1].className == 'toDelete';
}
function turnCtrlsFromTagId(id, className, enable) {
    ctrls = document.getElementById(id).getElementsByClassName(className);
    for (i = 0; i < ctrls.length; i++) {
	ctrls[i].disabled = !enable;
    }
}

function CheckForDbChangesObj() {
    this.dataPack = new GetComunicationObj('Refresh', initData.timestemp); // getElementsByTagName()
    this.stateHandler = new TemplateStateHendler(function() {
	;
    }, function() {
	;
    }, 'Dociąganie zmian w księgozborze');

    this.inform = function(state, status) {
	this.stateHandler.stateRecived(state, status);
    };

    this.thanksForData = function(data) {
	upadeteCtlrsLatestChanges(data);
    };

    return this;

}

function SaverObj() {
    this.dataPack = new GetComunicationObj('SaveChanges', initData.timestemp); // getElementsByTagName()
    this.stateHandler = new TemplateStateHendler(function() {
	turnCtrlsFromTagId('nowyrecord', 'addctrl', false);
	turnCtrlsFromTagId('booksFolder', 'updateCtrs', false);
    }, function() {
	turnCtrlsFromTagId('nowyrecord', 'addctrl', true);
	turnCtrlsFromTagId('booksFolder', 'updateCtrs', true);
    }, 'Zapisywanie wprowadzonych zmian w katalogu ksiązek');

    this.inform = function(state, status) {
	this.stateHandler.stateRecived(state, status);
    };

    this.thanksForData = function(data) {
	upadeteCtlrsLatestChanges(data);
    };

    elemsToUp = new Array();
    bookFolder = document.getElementById('booksFolder');
    elems = bookFolder.getElementsByClassName('dataChanged');
    for (i = 0; i < elems.length; i++) {
	if (!isCtrlBelongToToDelete(elems[i])) {
	    elemsToUp.push(new Pair(getDbidCtrl(elems[i]).id, elems[i]
		    .getAttribute('name'), elems[i].value));
	}
    }
    elemsToUp.sort(function(a, b) {
	return a.id - b.id;
    });
    rows = [];
    if (elemsToUp.length > 0) {
	rows.push(new Boo(elemsToUp[0]));
	for (i = 1; i < elemsToUp.length; i++) {
	    last = rows[rows.length - 1];
	    if (last.id == elemsToUp[i].id)
		last.add(elemsToUp[i]);
	    else
		rows.push(new Boo(elemsToUp[i]));
	}
    }
    this.dataPack.toUpdate = rows;
    this.dataPack.toDelete = [];
    delCtrls = booksCtrls.getElementsByClassName('toDelete');
    for (i = 0; i < delCtrls.length; i++)
	this.dataPack.toDelete.push(getDbidCtrl(delCtrls[i]).id);

    return this;

    function Boo(ent) {
	this.id = ent.id;
	this.fields = {};
	this.fields[ent.colName] = ent.value;

	this.add = function(ent) {
	    this.fields[ent.colName] = ent.value;
	};
	return this;

    }

    function Pair(l, col, v) {
	this.id = l;
	this.value = v;
	this.colName = col;
	return this;
    }
    ;

}

function AddBookRequestObj() {
    this.dataPack = new GetComunicationObj('AddNew', initData.timestemp); // getElementsByTagName()
    this.stateHandler = new TemplateStateHendler(function() {
	turnCtrlsFromTagId('nowyrecord', 'addctrl', false);
    }, function() {
	turnCtrlsFromTagId('nowyrecord', 'addctrl', true);
    }, 'Dodawanie nowej pozycji książkowej');

    this.inform = function(state, status) {
	this.stateHandler.stateRecived(state, status);
    };

    this.thanksForData = function(data) {
	upadeteCtlrsLatestChanges(data);
    };

    elements = document.getElementById("nowyrecord").getElementsByClassName(
	    "addctrl");
    this.dataPack.newRec = {};
    for (i = 0; i < elements.length; i++) {
	el = elements[i];
	if (el.type != "button") {
	    this.dataPack.newRec[el.name] = el.value;
	    this.dataPack.newRec[el.name] = el.value;
	}

    }
    return this;

}

function binaryIndexOf(el, comFun, minIndex) {

    if (minIndex === undefined) {
	if (this.length == 0)
	    return ~0;
	minIndex = 0;
    }

    w = comFun(el, this[minIndex]);
    if (w < 0)
	return ~minIndex;
    else if (w == 0)
	return minIndex;

    w = comFun(el, this[this.length - 1]);

    if (w == 0)
	return this.length - 1;
    else if (w > 0)
	return ~this.length;
    else {

	var maxIndex = this.length - 1;
	var currentIndex;

	while (minIndex + 1 < maxIndex) {
	    currentIndex = (minIndex + maxIndex) / 2 | 0;
	    w = comFun(el, this[currentIndex]);
	    if (w > 0) {
		minIndex = currentIndex;
	    } else {
		maxIndex = currentIndex;
	    }
	}
	return (comFun(el, this[maxIndex]) == 0) ? maxIndex : ~maxIndex;
    }
}

function upadeteCtlrsLatestChanges(data) {
    initData.timestemp = data.timestemp;
    index = 0;
    indexDiv = 0;
    tempObj = {};
    booksCtrls = document.getElementById('booksFolder');
    bookDivs = booksCtrls.getElementsByClassName('bookDiv');
    compFun = function(e1, e2) {
	return e1.id - e2.id;
    };
    for (i = 0; i < data.deletedIds.length; i++) {
	tempObj.id = data.deletedIds[i];
	index = binaryIndexOf.call(initData.rows, tempObj, compFun, index);
	indexDiv = binaryIndexOf.call(bookDivs, tempObj, compFun, indexDiv);
	if (index >= 0) {
	    initData.rows.slice(index, 1);
	    booksCtrls.removeChild(bookDivs[indexDiv]);
	}
    }
    bookDivs = booksCtrls.getElementsByClassName('bookDiv');
    indexDiv = 0;
    index = 0;
    for (i = 0; i < data.rows.length; i++) {
	tempObj.id = data.rows[i].id;
	index = binaryIndexOf.call(initData.rows, tempObj, compFun, index);
	if (index < 0) {
	    index = ~index;
	    newBookDiv = getDivToUpdateBook(data.rows[i]);
	    if (index == initData.rows.length) {
		initData.rows.push(data.rows[i]);
		booksCtrls.appendChild(newBookDiv);

	    } else {
		indexDiv = ~(binaryIndexOf.call(bookDivs, tempObj, compFun,
			indexDiv));
		initData.rows.slice(index, 1, data.rows[i]);
		booksCtrls.insertBefore(bookDivs[indexDiv],
			getDivToUpdateBook(data.rows[i]));
	    }
	} else {
	    initData.rows[index] = data.rows[i];
	    indexDiv = binaryIndexOf.call(bookDivs, tempObj, compFun, indexDiv);
	    ctrls = bookDivs[indexDiv].getElementsByClassName('updateCtrs');
	    for (j = 0; j < ctrls.length; j++) {
		deleteClassN(ctrls[j], 'wrongData');
		deleteClassN(ctrls[j], 'dataChanged');
		ctrls[j].value = data.rows[i][ctrls[j].getAttribute('name')];
	    }
	    initData.rows[index] = data.rows[i];
	}

    }
}

function wait(sec) {
    var d = new Date();
    var n = d.getTime();
    var wz = new Date(n + 1000 * sec);

    while (d != wz) {
	d = new Date();
    }
}

function TemplateStateHendler(beginFun, endFun, actionTitle) {
    var animObj=new AnimDivObj();
    this.endFun = endFun;
    this.beginFun = beginFun;
    this.actionTitle = actionTitle;
    this.destroyInformer = function(messError) {
	document.getElementById('informer').style.visibility = 'collapse';
	clearInterval(this.timer);
	if (messError !== undefined)
	    alert(messError);
    };
    this.timer;
    this.initInformer = function(mess) {

	informer = document.getElementById('informer')
	informer.style.visibility = 'visible';
	informer.style.position = 'absolute';

	document.getElementById('actName').innerHTML = this.actionTitle;
	document.getElementById('messState').innerHTML = mess;
	this.timer=window.setInterval(function(){ animObj.animate();}, 50);
    };
    this.turnButtons = function(enable) {
	document.getElementById('updateBooksBt').disabled = !enable;
	document.getElementById('addRec').disabled = !enable;

    };
    this.informUser = function(mess) {
	document.getElementById('messState').innerHTML = mess;
    };

    this.stateRecived = function(state, status) {
	if (state == 1) {
	    this.turnButtons(false);
	    this.beginFun();
	    this.initInformer('Nawiązuje połączenie z bazą');
	} else if (state == 2) {
	    if (status == 200)
		this.informUser('Strona polączyła sie z bazą proszę czekać ');
	    else {
		this.endFun();
		this.trunButtons(true);
		this.destroyInformer("Numer błędu: " + status);
	    }
	} else if (state == 3) {
	    if (status == 200)
		this
			.informUser('Otrzymuje najnowsze dane  o książkach  bazą proszę czekać ');
	    else {
		this.endFun();
		this.trunButtons(true);
		this.destroyInformer("Numer błędu: " + status);
	    }
	} else if (state == 4) {
	    this.endFun();

	    this.turnButtons(true);

	    if (status == 200)
		this.destroyInformer();
	    else
		this.destroyInformer("Numer błędu: " + status);
	}
    };

    return this;
}

function AnimDivObj() {
    this.div_ = document.getElementById('informer');
    
    this.a = 0.5;
    this.dir = 0;
    this.t = 0;
    
    this.animate = function() {
	s1 = document.documentElement.scrollTop;
	s3 = s1+document.documentElement.clientHeight- this.div_.offsetHeight;
	s2 = s1+ (document.documentElement.clientHeight- this.div_.offsetHeight)/ 2|0;
	this.t++;
	this.div_.style.left = ((document.documentElement.clientWidth - this.div_.clientWidth) / 2 | 0)
		+ 'px';
	if (this.dir == 0) {
	    ss = s1 + this.a * (this.t * this.t) / 2;
	    if (ss >= s2) {
		this.dir = 1;
		this.v = this.a * this.t;
		this.t = 0;
	    }
	} else if (this.dir == 1) {
	    a = this.v * this.v / (2 * (s3 - s2));
	    ss = s2 + this.v * this.t - a * this.t * this.t / 2;
	    if (ss <= s2) {
		this.v= this.a*this.t/2
		this.dir = 3;
		this.t = 0;
	    }
	}

	else if (this.dir == 3) {
	    a = this.v * this.v / (2 * (s2 - s1));
	    ss = s2 - this.v * this.t + a * this.t * this.t / 2;
	    if (ss >= s2) {
		this.v= this.a*this.t/2;
		this.dir = 1;
		this.t = 0;
	    }
	}

	this.div_.style.top = (ss | 0) + 'px';
    }
}

function getDivToUpdateBook(book) {
    retDiv = document.createElement('div');
    retDiv.className = 'bookDiv';
    retDiv.id = book.id;
    inputEl = AppendChildTag(retDiv, 'div', 'uL3');
    inputEl = AppendChildTag(inputEl, 'div', 'uL2');
    inputEl = AppendChildTag(inputEl, 'div', 'uL1');

    btn = AppendChildTag(retDiv, 'input', 'Bt_Update');
    btn.setAttribute('type', 'button');
    btn.setAttribute('value', 'Usuń Książkę ');
    btn.onclick = onDeleteBt;

    addInputEl(inputEl, 'input', 'text', 'Tytuł', 'title', book.title,
	    onLoseFocusTextInput);
    addInputEl(inputEl, 'input', 'text', 'Autor', 'author', book.author,
	    onLoseFocusTextInput);
    addInputEl(inputEl, 'input', 'number', 'Rok wydania', 'year', book.year,
	    onLoseFocusYear);

    nameEl = addInputEl(inputEl, 'textarea', 'text', 'Kommentarz', 'comment',
	    book.comment, checkChangesAndMark);
    nameEl.setAttribute('rows', '4');
    return retDiv;
}

function InitRequestObj() {
    this.dataPack = new GetComunicationObj('Init', 0);
    this.stateHandler = new TemplateStateHendler(function() {
	;
    }, function() {
	;
    }, 'Inicjalizacja strony ');

    this.inform = function(state, status) {
	this.stateHandler.stateRecived(state, status);

    };

    this.thanksForData = function(data) {

	initData = data;
	elem = document.getElementById('booksFolder');
	for (i = 0; i < initData.rows.length; i++)
	    elem.appendChild(getDivToUpdateBook(initData.rows[i]));
    };
    return this;
}


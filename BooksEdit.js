/**
 * 
 */
var booksEditObj = new BooksEditObj();

function binaryIndexOf(el, comFun, minIndex) {

    if (minIndex === undefined) {
	if (this.length === 0) {
	    return ~0;
	}
	minIndex = 0;
    }

    var w = comFun(el, this[minIndex]);
    if (w < 0) {
	return ~minIndex;
    } else if (w === 0) {
	return minIndex;
    }

    w = comFun(el, this[this.length - 1]);

    if (w === 0) {
	return this.length - 1;
    } else if (w > 0) {
	return ~this.length;
    } else {

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
	return (comFun(el, this[maxIndex]) === 0) ? maxIndex : ~maxIndex;
    }
}

function BooksEditObj() {

    var config = {
	      CSS:{
	         classes:{
	            wrongData:'wrongData',
	            dataChanged:'dataChanged',
	            bookContainer:'bookDiv',
	            updateInput:'updateCtrs',
	            addInput:'addctrl',
	            labelInput:'rowUp',
	            updateDivL1:'uL3',
	            updateDivL2:'uL2',
	            updateDivL3:'uL1',
	            btBookToDelete:'toDelete',
	            btBookDeleted:'Bt_Update'
	        	
	         },
	         IDs:{
	            booksDiv:'booksFolder',
	            newBookDiv:'nowyrecord',
	            informer:'informer',
	            infoTitle:"actName",
	            messageDiv:'messState',
	            btUpdate:'updateBooksBt',
	            btAddNewBook:'addRec'
	        	
	         }
	      },
	      labels:{
	         title:'Tytuł',
	         author:'Autor',
	         year:'Rok Wydania',
	         comment:'Komentarz',
	         bookToRemove:'Usuń Książkę',
	         bookRemoved:'Anuluj usuwanie kiążki'
	      },
	      actions:{
		  initialization:'Init',
		  addNewBook:'AddNew',
		  saveChanges:'SaveChanges',
		  refresh:'Refresh'
	      }

	   };


    var pageData = new PageDataObj();
    var myAjax = new AjaxObj();
    var refreshTimer = setInterval(checkChangesInDB, 30000);
    myAjax.sendRequest(new InitRequestObj());

    function PageDataObj() {
	return {
	    timestemp : 0,
	    rows : [],
	    getDbBook : function(id, startIndex) {
		return this.rows[binaryIndexOf.call(this.rows, {
		    id : id
		}, function(o1, o2) {
		    return o1.id - o2.id;
		}, startIndex)];
	    }
	};
    }

    function AjaxObj() {
	var dtStart = new Date();
	var dtEnd = new Date();

	var isBusy = function() {
	    return (dtEnd.getTime() - dtStart.getTime()) <= 0;
	};

	var intervalFromCom = function() {
	    if (isBusy()) {
		return -1;
	    } else {
		var dt = new Date();
		return (dt.getTime() - dtEnd.getTime()) / 1000;
	    }
	};
	var sendRequest = function(sender) {
	    if (this.readyState == 1){
		dtStart= new Date();
	    }
	    var request = new XMLHttpRequest();
	    request.open("POST", "servData.php", true);
	    request.setRequestHeader("Content-Type",
		    "application/json; charset=iso-8859-2");

	    sender.inform(0, 0);
	    request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		    dtEnd = new Date();
		    if (this.responseText != null) {
			sender.thanksForData(JSON.parse(this.responseText));
		    } else if (ifDefined(sender.NoDataError))
			sender.noDataError();
		} else if (this.status!==0 && this.status != 200)
		    dtEnd = new Date();

		sender.inform(this.readyState, this.status);
	    };
	    request.send(JSON.stringify(sender.dataPack));
	};
	return {
	    intervalFromCom : intervalFromCom,
	    sendRequest : sendRequest,
	};
    }


    function upadeteCtlrsLatestChanges(data) {
	pageData.timestemp = data.timestemp;
	var index = 0, indexDiv = 0, tempObj = {};
	
	var booksCtrls = document.getElementById(config.CSS.IDs.booksDiv);
	var bookDivs = booksCtrls.getElementsByClassName(config.CSS.classes.bookContainer);
	var compFun = function(e1, e2) {
	    return e1.id - e2.id;
	};
	for ( var i = 0; i < data.deletedIds.length; i++) {
	    tempObj.id = data.deletedIds[i];
	    index = binaryIndexOf.call(pageData.rows, tempObj, compFun, index);
	    indexDiv = binaryIndexOf.call(bookDivs, tempObj, compFun, indexDiv);
	    if (index >= 0) {
		pageData.rows.slice(index, 1);
		booksCtrls.removeChild(bookDivs[indexDiv]);
	    }
	}
	bookDivs = booksCtrls.getElementsByClassName(config.CSS.classes.bookContainer);
	index = indexDiv = 0;
	for ( var i = 0; i < data.rows.length; i++) {
	    tempObj.id = data.rows[i].id;
	    index = binaryIndexOf.call(pageData.rows, tempObj, compFun, index);
	    if (index < 0) {
		index = ~index;
		newBookDiv = getDivToUpdateBook(data.rows[i]);
		if (index == pageData.rows.length) {
		    pageData.rows.push(data.rows[i]);
		    booksCtrls.appendChild(newBookDiv);

		} else {
		    indexDiv = ~(binaryIndexOf.call(bookDivs, tempObj, compFun,
			    indexDiv));
		    pageData.rows.slice(index, 1, data.rows[i]);
		    booksCtrls.insertBefore(bookDivs[indexDiv],
			    getDivToUpdateBook(data.rows[i]));
		}
	    } else {
		pageData.rows[index] = data.rows[i];
		indexDiv = binaryIndexOf.call(bookDivs, tempObj, compFun,
			indexDiv);
		ctrls = bookDivs[indexDiv].getElementsByClassName(config.CSS.classes.updateInput);
		for (j = 0; j < ctrls.length; j++) {
		    deleteClassN(ctrls[j], config.CSS.classes.wrongData);
		    deleteClassN(ctrls[j], config.CSS.classes.dataChanged);
		    ctrls[j].value = data.rows[i][ctrls[j].getAttribute('name')];
		}
		pageData.rows[index] = data.rows[i];
	    }
	}
    }

    function getDbidCtrl(control) {
	var parent_ = control.parentElement;
	while (parent_.className !== config.CSS.classes.bookContainer) {
	    parent_ = parent_.parentElement;
	}
	return parent_;
    }

    function onDeleteBt() {
	var parent_ = this.parentElement, 
	ctrls = parent_.firstChild.getElementsByClassName(config.CSS.classes.updateInput), i, count, 
		div = parent_.getElementsByClassName(config.CSS.classes.updateDivL3)[0];

	for (i = 0, count = ctrls.length; i < count; i++) {
	    ctrls[i].disabled = !ctrls[i].disabled;
	}
	if (this.className === config.CSS.classes.btBookDeleted) {
	    div.removeChild(document.getElementById("img" + parent_.id));
	    this.className = config.CSS.classes.btBookToDelete;
	    this.value = config.labels.bookToRemove;
	    div.style.height = 'auto';
	    this.className = config.CSS.classes.btBookToDelete;
	} else {
	    this.className = config.CSS.classes.btBookDeleted;
	    this.value = config.labels.bookRemoved;
	    var img = document.createElement('img');
	    img.src = 'res//cross.png';
	    img.id = "img" + parent_.id;
	    var acHeight = div.offsetHeight * 0.8;
	    div.appendChild(img);
	    var hig = (acHeight - div.style.paddingTop
		    - div.style.paddingBottom - div.style.marginTop - div.style.marginBottom);
	    img.width = img.naturalWidth * hig / img.naturalHeight;
	    img.height = hig;
	    img.style.position = 'relative';
	    img.style.top = -(acHeight * 0.9) + 'px';
	    div.style.height = acHeight + 'px';
	}
    }

    function appendChildTag(parent, name, classname) {
	var tag = document.createElement(name);
	if (classname !== undefined) {
	    tag.className = classname;
	}
	parent.appendChild(tag);
	return tag;
    }

    function addInputEl(parentElement, tagname, type, desc, title, value,
	    loseFocusFun) {

	var rowDiv = appendChildTag(parentElement, 'div', config.CSS.classes.labelInput);
	var child = appendChildTag(rowDiv, 'div');
	child.innerText = desc;

	child = appendChildTag(rowDiv, tagname, config.CSS.classes.updateInput);
	child.type = type;
	child.name = title;
	child.value = value;
	child.addEventListener('focusout', loseFocusFun);

	return child;
    }

    function hasClass(element, cls) {
	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function insertClassN(ctrl, className) {
	if (!hasClass(ctrl, className)) {
	    ctrl.className = ctrl.className + ' ' + className;
	}
    }

    function deleteClassN(ctrl, className) {
	var array = ctrl.className.split(' ');

	if (array[1] === className) {
	    array.pop();
	}
	ctrl.className = array.join(' ');
    }

    function checkChangesAndMark() {
	var book = pageData.getDbBook(getDbidCtrl(this).id);
	if (book[this.getAttribute('name')] == this.value) {
	    deleteClassN(this, config.CSS.classes.dataChanged);
	} else {
	    insertClassN(this, config.CSS.classes.dataChanged);
	}
    }

    function onLoseFocusYear() {
	if (isNaN(this.value)) {
	    insertClassN(this, config.CSS.classes.wrongData);
	} else if (this.value < 1700 || this.value > (new Date()).getFullYear()) {
	    insertClassN(this, config.CSS.classes.wrongData);
	} else {
	    deleteClassN(this, config.CSS.classes.wrongData);
	    checkChangesAndMark.call(this);
	}
    }

    var onLoseFocusYearAddNew = function(btn) {
	if (isNaN(btn.value)) {
	    insertClassN(btn, config.CSS.classes.wrongData);
	} else if (btn.value < 1700 || btn.value > (new Date()).getFullYear()) {
	    insertClassN(btn, config.CSS.classes.wrongData);
	} else {
	    deleteClassN(btn, config.CSS.classes.wrongData);
	}
    }

    var onLoseFocuseTextInputAddNew = function(ctrl) {
	var value = ctrl.value.trim();
	if (value.length > 0) {
	    deleteClassN(ctrl, config.CSS.classes.wrongData);
	} else
	    insertClassN(ctrl, config.CSS.classes.wrongData);
    }

    function onLoseFocusTextInput() {
	this.value = this.value.trim();
	if (this.value.length > 0) {
	    deleteClassN(this, config.CSS.classes.wrongData);
	    checkChangesAndMark.call(this);
	} else
	    insertClassN(this, config.CSS.classes.wrongData);
    }

    function GetComunicationObj(action, timestemp) {
	return {
	    timestemp : timestemp,
	    action : action
	};
    }

    function isPermissonForUpdate() {

	var booksCtrls = document.getElementById(config.CSS.IDs.booksDiv);
	var errors = booksCtrls.getElementsByClassName(config.CSS.classes.wronData);
	for ( var i = 0, count = errors.length; i < count; i++) {
	    if (!isCtrlBelongToToDelete(errors[i]))
		break;
	}
	if (i == 0
		&& errors.length == 0
		&& (booksCtrls.getElementsByClassName(config.CSS.classes.btBookDeleted).length > 0 || booksCtrls
			.getElementsByClassName(config.CSS.classes.dataChanged).length > 0))
	    return true;
	else
	    return i == errors.length;
    }

    function checkChangesInDB() {
	if (myAjax.intervalFromCom() >= 180)// 3min
	    myAjax.sendRequest(new CheckForDbChangesObj());
    }

    var addNewBook = function() {
	if (document.getElementById(config.CSS.IDs.newBookDiv).getElementsByClassName(
		config.CSS.classes.wrongData).length == 0) {
	    myAjax.sendRequest(new AddBookRequestObj());
	}
    }

    onSaveChanges = function() {
	if (isPermissonForUpdate())
	    myAjax.sendRequest(new SaverObj());

    }

    function isCtrlBelongToToDelete(ctrl) {
	return getDbidCtrl(ctrl).childNodes[1].className == config.CSS.classes.btBookDeleted;
    }
    function turnCtrlsFromTagId(id, className, enable) {
	var ctrls = document.getElementById(id).getElementsByClassName(
		className);
	for ( var i = 0, count = ctrls.length; i < count; i++) {
	    ctrls[i].disabled = !enable;
	}
    }

    function CheckForDbChangesObj() {
	var stateHandler = new TemplateStateHendler(function() {
	    ;
	}, function() {
	    ;
	}, 'Dociąganie zmian w księgozborze');

	return {
	    dataPack : new GetComunicationObj(config.actions.refresh, pageData.timestemp),
	    inform : function(state, status) {
		stateHandler.stateRecived(state, status);
	    },
	    thanksForData : function(data) {
		upadeteCtlrsLatestChanges(data, pageData);
	    }
	};

    }

    function SaverObj() {

	function Boo(ent) {
	    var fields={};
	    fields[ent.colName]=ent.value;
	    return {
		id : ent.id,
		fields : fields,
	
		add : function(ent) {
		    this.fields[ent.colName] = ent.value;
		}
	    };
	}

	function Pair(l, col, v) {
	    return {
		id : l,
		value : v,
		colName : col
	    };
	}

	var dataPack = new GetComunicationObj(config.actions.saveChanges, pageData.timestemp); // getElementsByTagName()
	var stateHandler = new TemplateStateHendler(function() {
	    turnCtrlsFromTagId(config.CSS.IDs.newBookDiv, config.CSS.classes.addInput, false);
	    turnCtrlsFromTagId(config.CSS.IDs.booksDiv, config.CSS.classes.updateInput, false);
	}, function() {
	    turnCtrlsFromTagId(config.CSS.IDs.newBookDiv, config.CSS.classes.addInput, true);
	    turnCtrlsFromTagId(config.CSS.IDs.booksDiv, config.CSS.classes.updateInput, true);
	}, 'Zapisywanie wprowadzonych zmian w katalogu ksiązek');

	var elemsToUp = new Array();
	var bookFolder = document.getElementById(config.CSS.IDs.booksDiv);
	var elems = bookFolder.getElementsByClassName(config.CSS.classes.dataChanged);
	for ( var i = 0, count = elems.length; i < count; i++) {
	    if (!isCtrlBelongToToDelete(elems[i])) {
		elemsToUp.push(new Pair(getDbidCtrl(elems[i]).id, elems[i]
			.getAttribute('name'), elems[i].value));
	    }
	}

	var rows = [];
	if (elemsToUp.length > 0) {
	    rows.push(new Boo(elemsToUp[0]));
	    for ( var i = 1, count = elemsToUp.length; i < count; i++) {
		var last = rows[rows.length - 1];
		if (last.id == elemsToUp[i].id)
		    last.add(elemsToUp[i]);
		else
		    rows.push(new Boo(elemsToUp[i]));
	    }
	}
	dataPack.toUpdate = rows;
	dataPack.toDelete = [];

	var delCtrls = bookFolder.getElementsByClassName(config.CSS.classes.btBookDeleted);
	for ( var i = 0; i < delCtrls.length; i++) {
	    dataPack.toDelete.push(getDbidCtrl(delCtrls[i]).id);
	}
	return {
	    dataPack : dataPack,
	    inform : function(state, status) {
		stateHandler.stateRecived(state, status);
	    },
	    thanksForData : function(data) {
		upadeteCtlrsLatestChanges(data);
	    }
	};
    }

    function AddBookRequestObj() {
	var dataPack = new GetComunicationObj(config.actions.addNewBook, pageData.timestemp); // getElementsByTagName()
	var stateHandler = new TemplateStateHendler(function() {
	    turnCtrlsFromTagId(config.CSS.IDs.newBookDiv, config.CSS.classes.addInput, false);
	}, function() {
	    turnCtrlsFromTagId(config.CSS.IDs.newBookDiv, config.CSS.classes.addInput, true);
	}, 'Dodawanie nowej pozycji książkowej');

	var elements = document.getElementById(config.CSS.IDs.newBookDiv).getElementsByClassName(config.CSS.classes.addInput);
	dataPack.newRec = {};
	for ( var i = 0; i < elements.length; i++) {
	    el = elements[i];
	    if (el.type != "button") {
		dataPack.newRec[el.name] = el.value;
		dataPack.newRec[el.name] = el.value;
	    }

	}
	return {
	    dataPack : dataPack,
	    inform : function(state, status) {
		stateHandler.stateRecived(state, status);
	    },
	    thanksForData : function(data) {
		upadeteCtlrsLatestChanges(data, pageData);
	    }
	};

    }

    function TemplateStateHendler(beginFun, endFun, actionTitle) {
	var animObj = new AnimDivObj();
	var timer;

	var destroyInformer = function(messError) {
	    document.getElementById(config.CSS.IDs.informer).style.visibility = 'collapse';
	    clearInterval(timer);
	    if (messError !== undefined)
		alert(messError);
	};

	var initInformer = function(mess) {

	    var informer = document.getElementById(config.CSS.IDs.informer);
	    informer.style.visibility = 'visible';

	    document.getElementById(config.CSS.IDs.infoTitle).innerHTML = actionTitle;
	    document.getElementById(config.CSS.IDs.messageDiv).innerHTML = mess;
	    if (timer === undefined)
		timer = window.setInterval(function() {

		    animObj.animate();
		}, 50);
	};

	var turnButtons = function(enable) {
	    document.getElementById(config.CSS.IDs.btUpdate).disabled = !enable;
	    document.getElementById(config.CSS.IDs.btAddNewBook).disabled = !enable;

	};
	var informUser = function(mess) {
	    document.getElementById(config.CSS.IDs.messageDiv).innerHTML = mess;
	};

	var stateRecived = function(state, status) {
	    console.log("state  "+state , " status  "+ status);
	    if (state == 0) {
		turnButtons(false);
		beginFun();
		initInformer('Nawiązuje połączenie z bazą');
	    } else if (state == 1) {
		;
	    } else if (state == 2) {
		if (status == 200)
		    informUser('Strona polączyła sie z bazą proszę czekać ');
		else {
		    endFun();
		    trunButtons(true);
		    destroyInformer("Numer błędu: " + status);
		}
	    } else if (state == 3) {
		if (status == 200)
		    informUser('Otrzymuje najnowsze dane  o książkach  bazą proszę czekać ');
		else {
		    endFun();
		    trunButtons(true);
		    destroyInformer("Numer błędu: " + status);
		}
	    } else if (state == 4) {
		endFun();

		turnButtons(true);

		if (status == 200)
		    destroyInformer();
		else
		    destroyInformer("Numer błędu: " + status);
	    }
	};

	return {
	    stateRecived : stateRecived
	};
    }

    function AnimDivObj() {
	var div_ = document.getElementById(config.CSS.IDs.informer);
	var a = 1;
	var dir = 0;
	var t = 0;

	return {
	    animate : function() {
		var s1 = document.documentElement.scrollTop > document.body.scrollTop?document.documentElement.scrollTop :document.body.scrollTop;
		var s3 = s1 + document.documentElement.clientHeight
			- div_.clientHeight;
		var s2 = s1
			+ (document.documentElement.clientHeight - div_.clientHeight)
			/ 2 | 0;
		t++;
		var a_;
		div_.style.left = ((document.documentElement.clientWidth - div_.clientWidth) / 2 | 0)
			+ 'px';
		if (dir == 0) {
		    ss = s1 + a * (t * t) / 2;
		    if (ss >= s2) {
			dir = 1;
			v = a * t;
			t = 0;
		    }
		} else if (dir == 1) {
		     a_ = v * v / (2 * (s3 - s2));
		    ss = s2 + v * t - a_ * t * t / 2;
		    if (ss <= s2) {
			v = a * t / 2
			dir = 3;
			t = 0;
		    }
		}

		else if (dir == 3) {
		    a_ = v * v / (2 * (s2 - s1));
		    ss = s2 - v * t + a_ * t * t / 2;
		    if (ss >= s2) {
			v = a * t / 2;
			dir = 1;
			t = 0;
		    }
		}

		div_.style.top = (ss | 0) + 'px';
	    }
	};
    }
    
    function getDivToUpdateBook(book) {
	var retDiv = document.createElement('div');
	retDiv.className = config.CSS.classes.bookContainer;
	retDiv.id = book.id;

	var inputEl = appendChildTag(retDiv, 'div', config.CSS.classes.updateDivL1);
	inputEl = appendChildTag(inputEl, 'div', config.CSS.classes.updateDivL2);
	inputEl = appendChildTag(inputEl, 'div', config.CSS.classes.updateDivL3);

	var btn = appendChildTag(retDiv, 'input', config.CSS.classes.btBookToDelete);
	btn.setAttribute('type', 'button');
	btn.setAttribute('value', config.labels.bookToRemove);
	btn.onclick = onDeleteBt;

	addInputEl(inputEl, 'input', 'text', config.labels.title, 'title', book.title,
		onLoseFocusTextInput);
	addInputEl(inputEl, 'input', 'text', config.labels.author, 'author', book.author,
		onLoseFocusTextInput);
	addInputEl(inputEl, 'input', 'number', config.labels.year, 'year',
		book.year, onLoseFocusYear);

	var nameEl = addInputEl(inputEl, 'textarea', 'text', config.labels.comment,
		'comment', book.comment, checkChangesAndMark);
	nameEl.setAttribute('rows', '4');
	return retDiv;
    }

    function InitRequestObj() {
	var stateHandler = new TemplateStateHendler(function() {
	    ;
	}, function() {
	    ;
	}, 'Inicjalizacja strony '),

	thanksForData = function(data) {
	    var i, count = data.rows.length,
	    elem = document.getElementById(config.CSS.IDs.booksDiv);

	    pageData.timestemp = data.timestemp;
	    pageData.rows = data.rows;
	    for (i = 0; i < count; i++)
		elem.appendChild(getDivToUpdateBook(pageData.rows[i]));
	};

	return {
	    dataPack : new GetComunicationObj(config.actions.initialization, 0),
	    inform : function(state, status) {
		stateHandler.stateRecived(state, status);
	    },
	    thanksForData : thanksForData
	};

    }
    return {
	onLoseFocusYearAddNew : onLoseFocusYearAddNew,
	onLoseFocuseTextInputAddNew : onLoseFocuseTextInputAddNew,
	onSaveChanges : onSaveChanges,
	addNewBook : addNewBook
    };
}
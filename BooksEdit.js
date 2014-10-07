/**
 * 
 */
var initData;
request = new XMLHttpRequest();
console.log('after new XmlHttpRequest()')
if (!request)
	alert("Problem with request");

dataPack = new GetComunicationObj('Init',0);

request.open("POST", "servData.php", true);
request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
request.setRequestHeader("Connection", "close");

request.onreadystatechange = function() {
	console.log(this.status+"  "+this.readyState);
	if (request.readyState == 4) {
		if (request.status = 200) {
			if (request.responseText != null) {
				initData = JSON.parse(request.responseText);
				wypiszRecs();
			} else
				alert("Ajax error No data received");
		} else
			alert("Ajax error: " + request.statusText);
	}
};
console.log('before send');
request.send(JSON.stringify(dataPack));
console.log('after send');
function wypiszRecs() {
	elem = document.getElementById('booksFolder');
	for (i = 0; i < initData.rows.length; i++) {

		book = initData.rows[i];
		disEl = AppendChildTag(elem, 'div', 'bookDiv');
		disEl.id = book.id;
		inputEl = AppendChildTag(disEl, 'div', 'uL3');
		inputEl = AppendChildTag(inputEl, 'div', 'uL2');
		inputEl = AppendChildTag(inputEl, 'div', 'uL1');

		btn = AppendChildTag(disEl, 'input', 'Bt_Update');
		btn.setAttribute('type', 'button');
		btn.setAttribute('value', 'Usuń Książkę ');
		btn.onclick = onDeleteBt;

		addInputEl(inputEl, 'input', 'text', 'Tytuł', 'title', book.title,
				onLoseFocusTextInput);
		addInputEl(inputEl, 'input', 'text', 'Autor', 'author', book.author,
				onLoseFocusTextInput);
		addInputEl(inputEl, 'input', 'number', 'Rok wydania', 'year',
				book.year, onLoseFocusYear);

		nameEl = addInputEl(inputEl, 'textarea', 'text', 'Kommentarz',
				'comment', book.comment, checkChanges);
		nameEl.setAttribute('rows', '4');
	}
}

function isDefined(x) {
	var undefined;
	return x !== undefined;

}

function getDbidCtrl(control) {
	parent_ = control.parentElement;
	while (parent_.className != 'bookDiv')             
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
	if (this.value < 1700 || this.value > (new Date()).getFullYear())
		insertClassN(this, 'wrongData');
	else {
		deleteClassN(this, 'wrongData');
		checkChanges.call(this)
	}
}

function checkChanges() {
	book = getDbBook(getDbidCtrl(this).id);
	if (book[this.getAttribute('name')] == this.value)
		deleteClassN(this, 'dataChanged');
	else
		insertClassN(this, 'dataChanged');
}

function onLoseFocusTextInput() {
	value = this.value.trim();
	if (value.length > 0) {
		deleteClassN(this, 'wrongData');
		checkChanges.call(this);
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

function GetComunicationObj(action,timestemp) {
	this.timestemp=timestemp;
	this.action = action;
}

function isPermissonForUpdate(){

	booksCtrls = document.getElementById('booksFolder');
	errors = booksCtrls.getElementsByClassName("wrongData");
	for (i = 0; i < errors.length; i++) {
		if (errors[i].parentElement.className != 'toDelete')
			break;
	}

	return (i != errors.length)
}
function prepareUpdatePack(){
		elemsToUp = new Array();
		elems = booksCtlr.getElementsByClassName('dataChanged');
		for (i = 0; i < elems.length; i++) {
			if (elems[i].parentElement.className == 'updateCtrs')
				elemsToUp.push(new Pair(getDbidCtrl(elems[i]).id, elems[i]
						.getArrgument('name'), elems[i].value));
		}
		elemsToUp.sort(function(a, b) {
			return a.id - b.id;
		});
		if (elemsToUp.length > 0) {
			rows = [];
			rows.push(new Boo(elemsToUp[0]));
			for (i = 1; i < elemsToUp.length; i++) {
				last = rows[rows.length - 1];
				if (last.id == elemsToUp[i].id)
					last.add(elemsToUp[i]);
				else
					rows.push(elemsToUp[i]);
			}
		}
		deletedIds = [];
		delCtrls = booksCtrls.getElementsByClassName('toDelete');
		for (i = 0; i < delCtrls.length; i++)
			deletedIds.push(getDbidCtrl(delCtrls[i]));
	
		pack= new GetComunicationObj('Update',initData.timestemp);
		pack.deletedIds=deletedIds;
		pack.toUpdateFilds=rows;
		return pack;
	}


function Boo(ent) {
	this.id = ent.id;
	this.colValue = [];
	this.colValue[ent.colName] = ent.value;

	this.add = function(ent) {
		this.colValue[ent.colName] = ent.value;
	};
	return this;

}

function Pair(l, col, v) {
	this.id = l;
	this.value = v;
	this.colName = col;
	return this;
}
function addNewBook() {

	dataPack = new GetComunicationObj('AddNew',initData.timestemp); // getElementsByTagName()

	elements = document.getElementById("nowyrecord").getElementsByTagName(
			"input");
	for (i = 0; i < elements.length; i++) {
		el = elements[i];
		if (el.type != "button") {
			dataPack.newRec[el.name] = el.value;
			dataPack.newRec[el.name] = el.value;
		}
	}

	request = new XMLHttpRequest();
	if (!request)
		alert("Problem with request");
	console.log(console, typeof (request));

	request.open("POST", "servData.php", true);
	request.setRequestHeader("Content-Type",
			"application/json; charset=iso-8859-2");
	request.onreadystatechange = function() {
		console.log(this, this.readyState);
		console.log(this.status);
		if (request.readyState == 4) {
			console.log(this.status);
			if (request.status = 200) {
				if (request.responseText != null) {
					console.log(this.responseText);
					UwzglednijZmiany(request.responseText);
				} else
					alert("Ajax error No data received");
			} else
				alert("Ajax error: " + request.statusText);
		}
	};
	request.send(JSON.stringify(dataPack));

}

function UwzglednijZmiany(odp) {
	document.getElementById('books').innerHTML += odp;
}
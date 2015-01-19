(function ($) {
    var erstFun1 = new ersting(0.5, 2, 0, -1);

    $.easing.inCubic = function (t) {
        return (t * t * t);
    }
    $.easing.outQuartic = function (t) {
        var ts = t * t,
            tc = ts * t;
        return 0.600000000000001 * tc * ts + -4.1475 * ts * ts + 9.095 * tc + -9.095 * ts + 4.5475 * t;
    }
    $.easing.openBook = function (t) {
        var ts = t * t,
            tc = ts * t;
        return 7.9 * tc * ts + -15.1 * ts * ts + 9.8 * tc + -2.5 * ts + 0.9 * t;

    }
    $.easing.plump = function (t) {
        var ts = t * t,
            tc = ts * t;
        return 38.745 * tc * ts + -69.59 * ts * ts + 31.995 * tc + -0.2 * ts + 0.05 * t;
    }
    function ersting(p2x, p2y, p3x, p3y) {
        var ay = 1, by = 0, cy = 0, ax = 1, bx = 0, cx = 0;
        if (p2y != 0) {
            ay += 3 * p2y;
            by += -6 * p2y;
            cy += 3 * p2y;
        }
        if (p3y != 0) {
            ay += -3 * p3y;
            by += 3 * p3y;
        }

        if (p2x != 0) {
            ax += 3 * p2x;
            bx += -6 * p2x;
            cx += 3 * p2x;
        }
        if (p3x != 0) {
            ax += -3 * p3x;
            bx += 3 * p3x;
        }

        var p = cx / ax - bx * bx / (3 * ax * ax), q_ = 2 * bx * bx * bx / (27 * ax * ax * ax) - cx * bx / (3 * ax * ax), b3a = bx / (3 * ax), p3_27 = p * p * p
            / 27, r = Math.sqrt(-p3_27), pom = 2 * Math.sqrt(-p / 3), PI2_3 = 2 * Math.PI / 3, PI4_3 = 4 * Math.PI / 3;

        return {
            fx: function (x, y, z, z_) {
                var t = wielomian3(-x),

                    t2 = t * t, ret = t2 * by + (t2 * t) * ay + t * cy
                return ret;
            }
        };

        function wielomian3(d) {

            var q = d / ax + q_, D = q * q / 4 + p3_27, x0, ret = {};

            if (D > 0) {
                var pD = Math.sqrt(D), pom1 = (-q / 2 - pD), v = (pom1 < 0) ? -Math.pow(-pom1, 0.33333) : Math.pow(pom1, 0.33333), pom2 = (-q / 2 + pD), u = (pom2 < 0)
                    ? -Math.pow(-pom2, 0.33333)
                    : Math.pow(pom2, 0.33333);

                ret.x1 = x0 = v + u - b3a;
            }
            else if (D === 0) {
                ret.x2 = ret.x1 = Math.pow(q / 2, 0.33333);
                ret.x1 -= b3a;
                if (ret.x1 >= 0 && ret.x1 <= 1) {
                    x0 = ret.x1;
                }
                else {
                    x0 = ret.x2 = -2 * ret.x2 - b3a;
                }

            }
            else if (D < 0) {
                var angle = Math.acos((-q / 2) / r) / 3;

                ret.x3 = pom * Math.cos(angle + PI4_3) - b3a;
                if (ret.x3 >= 0 && ret.x3 <= 1) {
                    x0 = ret.x3;
                }
                else {
                    ret.x2 = pom * Math.cos(angle + PI2_3) - b3a;
                    if (ret.x2 >= 0 && ret.x2 <= 1) {
                        x0 = ret.x2;
                    }
                    else {
                        x0 = ret.x1 == pom * Math.cos(angle / 3) - b3a;
                    }
                }
            }
            return x0;
        }
    }

})(jQuery);
$(document)
    .ready(
    function () {
        var booksObj = {
                books: getBooks(),
                getDbBook: function (id, startIndex) {
                    return this.books[this.index(id, startIndex)];
                },
                index: function (id, startIndex) {
                    return binaryIndexOf.call(this.books, {
                        id: id
                    }, function (o1, o2) {
                        return o1.id - o2.id;
                    }, startIndex);

                },
                getLastBook: function () {
                    return this.books[this.books.length - 1];
                },
                removeBooks: function (ids/*sorted*/) {
                    var ind = 0;
                    for (var i = 0; i < ids.length; i++) {
                        ind = this.index(ids[i], ind);
                        if (ind >= 0) {
                            this.books.splice(ind, 1);
                        }
                    }
                },
                insert: function (ind, book) {
                    this.books.splice(ind, 0, book);
                }
            },
            $emptyBook = $('#' + config['CSS']['IDs']['emptyBook']),
            editBook = new EditBookCtrl(),
            wrongDataDivBookCtrl = new WrongDataDivBookCtrl(booksObj.getLastBook().id);

        //edit book info
        $('#' + config['CSS']['IDs']['booksFolder']).on('click', '.' + config['CSS']['classes']['smallBt'] + ':nth-child(2)', function () {
        
        	var $parent = $(this).parents('.' + config['CSS']['classes']['bookContainer']),
                $cross = $parent.find('.' + config['CSS']['classes']['cross']), $this = $(this);
            $cross.css('transform-origin', "right top 0");

            var offBook = getWinCordElementCenter($parent), offButton = getWinCordElementCenter($this), angle, a11, a12, n;

            if (!$.isNumeric($parent[0].id)) {
                var p = $parent.offset();
                $emptyBook.promise().done(function () {
                    $emptyBook.addClass(config['CSS']['classes']['newBook']);
                    $emptyBook.show().offset($parent.offset());
                    $parent.css('visibility', 'hidden').find('.' + config['CSS']['classes']['bookButtons']);
                    writeBookFromBook($emptyBook.find('#' + config['CSS']['IDs']['emptyTop']), $parent);
                    throwAwayBook($parent.height(), $parent.width(), $emptyBook.position());
                    $parent.animate({width: 0, height: 0}, {
                        duration: 'slow', easing: 'inCubic', complete: function () {
                            $parent.remove();
                            $parent.remove();
                        }
                    });
                    wrongDataDivBookCtrl.removeBook($parent);
                });

            } else {
                var $bookCurtain = $cross.find(':first-child'),
                    PiPi = -2 * Math.PI, Pi3_2 = -3 * Math.PI / 2
                var $crossX = $cross.find(':nth-child(2)'), fnStep = function (now, fx) {
                    var angle = PiPi * now,
                        a11 = Math.cos(angle) * now,
                        a12 = -Math.sin(angle) * now;

                    if (angle < Pi3_2) {
                        $bookCurtain.css('height', ((angle - Pi3_2) / Pi3_2 * 300) + '%');
                    }
                    else {
                        $bookCurtain.css('height', '0');
                    }
                    $(this).css('transform', 'matrix(' + a11 + ',' + (-a12) + ',' + a12 + ',' + a11 + ',0,0)');
                };

                $crossX.promise().done(function () {
                    if ($cross.is(':visible')) {
                        var disX = offBook.left - offButton.left, disY = offBook.top - offButton.top;
                        $crossX.css({borderSpacing: 0, transformOrigin: "right -50px 0"}).animate({
                            borderSpacing: 1
                        }, {
                            step: function (now, fx) {
                                fnStep.call(this, (1 - now));
                            },
                            duration: 1000,
                            easing: 'plump'

                        }).queue(function (next) {
                            $cross.hide();
                            next();
                        });
                        $this.siblings().show();
                        wrongDataDivBookCtrl.checkBookAddOrRem($parent);

                    }
                    else {
                        var disX = offBook.left - offButton.left, disY = offBook.top - offButton.top;
                        $cross.show();
                        $this.siblings().hide();
                        $crossX.css({borderSpacing: 0, transformOrigin: "right -50px 0"}).animate({
                            borderSpacing: 1
                        }, {

                            step: fnStep,
                            duration: 1000,
                            easing: 'plump'
                        });
                        wrongDataDivBookCtrl.removeBook($parent);
                    }
                });
            }

        });

        //delete book
        $('#' + config['CSS']['IDs']['booksFolder']).on('click', '.' + config['CSS']['classes']['smallBt'] + ':nth-child(1)', function () {
            var $parent = $(this).parent();
            while (!$parent.hasClass(config['CSS']['classes']['bookContainer'])) {
                $parent = $parent.parent();
            }
            var ind = booksObj.index($parent[0].id);
            editBook.openBookToEdit($parent, ind < 0 ? undefined : booksObj.books[ind]);
        });

        function writeBookFromBook($bookTarget, $bookSource) {
            var cnDataChanged = config['CSS']['classes']['dataChanged'], cnWrongData = config['CSS']['classes']['wrongData'], classes = cnDataChanged + ' ' + cnWrongData;
            for (var col in config['columnsDesc']) {
                var className = '.book-' + col,
                    $source = $bookSource.find(className), classToAdd = ($source.hasClass(cnWrongData)) ? cnWrongData : ($source.hasClass(cnDataChanged)) ? cnDataChanged : '',
                    value = ( $source.is('div')) ? $source.text() : $source.val(), target = $bookTarget.find(className);
                $bookTarget.find(className).removeClass(classes).addClass(classToAdd).each(function () {
                    var $this = $(this);
                    if ($this.is('div')) {
                        $this.text(value);
                    } else {
                        $this.val(value);
                    }
                });
            }
        }

        function getBooks() {
            var books = [],
                colNames = config['columnsDesc'];

            $('.' + config['CSS']['classes']['bookContainer']).slice(0, -2).each(function (index) {
                var book = {};
                book.id = this.id;
                $this = $(this)
                for (col in colNames) {
                    book[col] = $this.find('.book-' + col).text();
                }
                books.push(book);

            })
            return books;
        }

        function throwAwayBook(height, width, fixedPosition, onComplete) {
            var tC = height / 10, wHeight = $(window).height(), wWidth = $(window).width(),
                tx = ((width + fixedPosition.left) > wWidth - fixedPosition.left ) ? -width - fixedPosition.left : wWidth - fixedPosition.left,
                ty = (height + fixedPosition.top > wHeight - fixedPosition.top) ? -height - fixedPosition.top : wHeight - fixedPosition.top,
                PiPi = -2 * Math.PI;
            $emptyBook.css({
                borderSpacing: 0,
                display: 'block',
                'transform-origin': '50% 50% 0'
            }).animate({borderSpacing: 1}, {
                    step: function (now, fx) {
                        var angle = PiPi * now,
                            cosA = Math.cos(angle), sinA = Math.sin(angle),
                            a11 = cosA * (1 - now),
                            a12 = sinA * (1 - now);
                        $(this).css('transform', 'matrix(' + a11 + ',' + a12 + ',' + (-a12) + ',' + a11 + ',' + (-tC * sinA + tx * now) + ',' + (cosA * tC - tC + ty * now) + ')');//(-280*n)+','+(316*n) +')');
                    },
                    complete: function () {
                        $emptyBook.hide().css('transform', 'none').removeClass(config['CSS']['classes']['newBook']);
                        $emptyBook.find('.'+config['CSS']['classes']['wrongData']).removeClass(config['CSS']['classes']['wrongData']);
                        if ($.isFunction(onComplete)) {
                            onComplete();
                        }
                    },
                    duration: 1600,
                    easing: 'outQuartic'
                }
            );

        }

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
            }
            else if (w === 0) {
                return minIndex;
            }

            w = comFun(el, this[this.length - 1]);

            if (w === 0) {
                return this.length - 1;
            }
            else if (w > 0) {
                return ~this.length;
            }
            else {

                var maxIndex = this.length - 1;
                var currentIndex;

                while (minIndex + 1 < maxIndex) {
                    currentIndex = (minIndex + maxIndex) / 2 | 0;
                    w = comFun(el, this[currentIndex]);
                    if (w > 0) {
                        minIndex = currentIndex;
                    }
                    else {
                        maxIndex = currentIndex;
                    }
                }
                return (comFun(el, this[maxIndex]) === 0) ? maxIndex : ~maxIndex;
            }
        }

        function EditBookCtrl() {

            var $sourceEl, bookData, $closeBt = $emptyBook.find('.' + config['CSS']['classes']['smallBt'] + ':eq(1)');
            $emptyTop = $emptyBook.find('#emptyTop'), $emptyLeft = $emptyBook.find('#emptyLeft'), $emptyRight = $emptyLeft.prev();
            var cnDataChanged = config['CSS']['classes']['dataChanged'], cnWrongData = config['CSS']['classes']['wrongData'];
            $emptyTop.css('transform-origin', "left top 0");
            $emptyTop.css('transform', "rotateY(0deg)");

            var changesCtrl= new ChangesCtrl();
          
            $emptyBook.find('.' + config['CSS']['classes']['book-input']).focusout(function () {
                var $this = $(this);
                var s = this.value;
                colName = this.className.match(/\s*book-(\w+)/)[1];
                if (colName !== 'comment' && s === '') {
                    $this.removeClass(cnDataChanged).addClass(cnWrongData);
                }
                else if (colName == 'year' && (s < 1800 || s > (new Date()).getFullYear())) {
                    $this.removeClass(cnDataChanged).addClass(cnWrongData);
                }
                else if (bookData !== undefined && s != bookData[colName]) {
                    $this.removeClass(cnWrongData).addClass(cnDataChanged);
                }
                else {
                    $this.removeClass(cnWrongData).removeClass(cnDataChanged);
                }
            });

            $('#' + config['CSS']['IDs']['btAddNewBook']).click(function () {
                $sourceEl = undefined;
                bookData = undefined;
                var $buttons = $('#' + config['CSS']['IDs']['ctrlPanel']);
                for (var col in config['columnsDesc']) {
                    $emptyBook.find('.book-' + col).each(function (index, el) {
                        if ($(el).is('div')) {
                            $(el).text('');
                        }
                        else {
                            el.value = '';
                        }
                    }).trigger('focusout');
                }
                var off = $(this).offset(), offTop = off.top - $(document).scrollTop();

                var btSaveChanges = $buttons.find('#' + config['CSS']['IDs']['btSaveChanges'])[0], 
                btAddNewBook = this, 
                disabledBtSaveChanges = btSaveChanges.disabled;
               
                btAddNewBook.disabled = btSaveChanges.disabled = true;

                $emptyBook.addClass(config['CSS']['classes']['newBook']);
                $emptyBook.css({
                    bottom: window.innerHeight - offTop,
                    top: 'auto',
                    left: off.left,
                    display: 'block'
                }).slideUp(0).slideDown({
                    duration: 'slow',
                    complete: function () {
                        $emptyBook.css({'top': offTop - $emptyBook.height(), bottom: 'auto'});
                        $buttons.hide('fast');
                        btAddNewBook.disabled = false;
                        btSaveChanges.disabled = this.disabled = disabledBtSaveChanges;
                    }
                });
                animOpen1();
            });

            var openBookToEdit = function ($sourceEl_, book) {
                $sourceEl = $sourceEl_;
                bookData = book;
                if (bookData === undefined) {
                    $emptyBook.addClass(config['CSS']['classes']['newBook']);
                }
                writeBookFromBook($emptyBook, $sourceEl_);


                $('#' + config['CSS']['IDs']['ctrlPanel']).hide('fast');
                $emptyBook.show().offset($sourceEl.offset());
                $sourceEl.css('visibility', 'hidden');
                animOpen1();
            }

            function animOpen1() {

                $('.' + config['CSS']['classes']['bookButtons']).not($emptyBook.find('.' + config['CSS']['classes']['bookButtons'])).css('visibility', 'hidden');
                $('#curtain').show();
                $emptyBook.promise().done(function () {
                    var height = $emptyBook.show().height();
                    var $win = $(window), x = ($win.width() - 2 * $emptyBook.outerWidth()) / 2 + $emptyBook.width(), y = ($win.height() - height) / 2;

                    $animEl = $emptyTop;
                    $emptyBook.animate({
                        left: x,
                        top: y
                    }, {
                        duration: 'slow',
                        easing: 'outQuartic',
                        complete: function () {
                            $(this).css({
                                left: '50%',
                                top: '50%'
                            });
                            $(this).css('transform', 'translate(-14%,-50%)');
                        }
                    }).queue(function (next) {
                        animOpen2();
                        next();
                    });
                });
            }

            function animOpen2() {
                var flag = false;
                $emptyTop.css('borderSpacing', 0).animate({
                    borderSpacing: 1
                }, {
                    step: function (now, fx) {
                        var angle = -Math.PI * now;

                        if (flag == false && angle < -Math.PI / 2) {
                            flag = true;
                            $animEl[0].style.visibility = 'hidden';
                            $animEl = $emptyLeft;
                            $animEl[0].style.visibility = 'visible';
                        }

                        $animEl.css('transform', 'rotateY(' + angle + 'rad)');
                    },
                    duration: 600,
                    easing: 'openBook'
                }).queue(function (next) {
                    $animEl.css('overflow', 'visible')
                        .prev().find('>').css('visibility', 'hidden');
					$animEl.find('.'+config['CSS']['classes']['book-input']+':first').focus();
                    $closeBt.show('fast');
                    $('#buttons').show('fast');
                    next();
                });
            };

            $closeBt.click(animClose);

            function animClose() {

                $emptyRight.find('>').css('visibility', 'visible');
                writeBookFromBook($emptyBook, $emptyLeft)

                var flag = false, $animEl = $emptyLeft;
                $closeBt.hide('fast');
                $('#buttons').hide('fast');

                $animEl.css('overflow', 'hidden');
                $emptyTop.css('borderSpacing', 0).animate({
                    borderSpacing: 1
                }, {
                    step: function (now, fx) {
                        angle = -Math.PI * (1 - now);
                        if (flag == false && angle > -Math.PI / 2) {
                            flag = true;
                            $animEl.css('visibility', 'hidden');
                            $animEl = $emptyTop;
                            $animEl.css('visibility', 'visible');
                        }
                        $animEl.css('transform', 'rotateY(' + angle + 'rad)');
                    },
                    duration: 600,
                    easing: 'openBook'
                }).queue(
                    function (next) {
                        var $win = $(window), classToRem = cnDataChanged + ' ' + cnWrongData,
                            initStyle = {
                                transform: 'none',
                                left: (($win.width() - 2 * $emptyBook.outerWidth()) / 2 + $emptyBook.width()),
                                top: ($win.height() - $emptyBook.outerHeight()) / 2
                            };
                        for (var col in config['columnsDesc']) {
                            $emptyBook.find('.book-' + col).removeClass(classToRem);
                        }
                        if ($sourceEl === undefined) {
                            $emptyBook.css(initStyle);
                            throwAwayBook($emptyBook.height(), $emptyBook.width(), $emptyBook.position(), onCompleteAnimClose);
                        } else {
                            var off = $sourceEl.offset(),
                                endAnimStyle = {
                                    left: off.left - $win.scrollLeft(),
                                    top: off.top - $win.scrollTop()
                                };
                            $emptyBook
                                .css(initStyle)
                                .animate(endAnimStyle
                                , {
                                    duration: 'fast',
                                    easing: 'outQuartic',
                                    complete: function () {
                                        $emptyBook.hide().removeClass(config['CSS']['classes']['newBook']);
                                        if ($sourceEl !== undefined) {
                                            $sourceEl.css('visibility', 'visible');
                                        }
                                        onCompleteAnimClose();
                                    }
                                });
                        }
                        next();

                        function onCompleteAnimClose() {
                            $('.' + config['CSS']['classes']['bookButtons']).not($emptyBook.find('.' + config['CSS']['classes']['bookButtons'])).each(
                                function (index, el) {
                                    el.style.visibility = 'visible';
                                });
                            $('#' + config['CSS']['IDs']['ctrlPanel']).show('fast')
                            $('#curtain').hide();
                        }
                    });

            }

            $('#' + config['CSS']['IDs']['editButtons'] + '>input:nth-child(1)').click(function () {
                if ($sourceEl === undefined) {
                    var s = config['CSS']['IDs']['newBook'],
                        $newBook = $('#' + s), $tempNewBook = $newBook.clone(), prev = $newBook.prev(), nr = 0;

                    if (prev.length > 0) {
                        var pattern = new RegExp(s + '-(\\d+)');
                        ret = pattern.exec('' + prev[0].id);
                        if (ret && ret.length > 0) {
                            nr = parseInt(ret[1]) + 1;
                        }
                    }
                    $newBook[0].id = s + '-' + nr;
                    $sourceEl = $newBook.css({
                        visibility: 'hidden',
                        display: 'block',
                        width: 0,
                        height: 0
                    }).after($tempNewBook).addClass(config['CSS']['classes']['newBook']);
                    var $win = $(window), $body = $('body');
                    fn = function () {
                        var top = $win.scrollTop(), maxScrollTop = $body[0].scrollHeight - $win.outerHeight();
                        if (top < maxScrollTop) {
                            $win.scrollTop(maxScrollTop);
                        }
                    };
                    $sourceEl.animate({width: '80mm', height: 414}, {
                        duration: 600,
                        easing: "inCubic",
                        complete: function () {
                            $sourceEl.css('height', 'initial');
                            fn();
                        },
                        step: fn
                    });
                }

                animClose();
                writeBookFromBook($sourceEl, $emptyTop);
                wrongDataDivBookCtrl.checkBookAddOrRem($sourceEl);
            });

            return {
                openBookToEdit: openBookToEdit
            };
        }

        function WrongDataDivBookCtrl(lastBookId) {
            lastBookId += 1;
            var wrongBooks = [],
                pattern = new RegExp(config['CSS']['IDs']['newBook'] + '-(\\d+)'),
                btSaveChanges = $('#' + config['CSS']['IDs']['btSaveChanges'])[0],

                checkBookAddOrRem = function ($divBook) {
                    var b = $divBook.find('.' + config['CSS']['classes']['wrongData']).length > 0,
                        ind = binaryIndexOf.call(wrongBooks, $divBook[0], compDivBooks)
                    if (b && ind < 0) {
                        wrongBooks.splice(~ind, 0, $divBook[0]);
                        btSaveChanges.disabled = true;
                    } else if (!b && ind >= 0) {
                        wrongBooks.splice(ind, 1);
                        if (wrongBooks.length == 0) {
                            btSaveChanges.disabled = false;
                        }
                    }
                },
                removeBook = function ($divBook) {
                    var ind = binaryIndexOf.call(wrongBooks, $divBook[0], compDivBooks);
                    if (ind >= 0) {
                        wrongBooks.splice(ind, 1);
                        if (wrongBooks.length == 0) {
                            btSaveChanges.disabled = false;
                        }
                    }

                },
                setLastBookId = function (newLastBookId) {
                    lastBookId = newLastBookId + 1;
                };
            //           btSaveChanges.disabled=true;
            function compDivBooks(divBook1, divBook2) {
                var ret, nr1 = (ret = pattern.exec('' + divBook1.id)) ? lastBookId + ret[1] : divBook1.id,
                    nr2 = (ret = pattern.exec('' + divBook2.id)) ? lastBookId + ret[1] : divBook2.id;
                return nr1 - nr2;
            }

            return {setLastBookId: setLastBookId, checkBookAddOrRem: checkBookAddOrRem, removeBook: removeBook}
        }


        function getWinCordElementCenter($element) {
            var offset = $element.offset();
            offset.left += $element.width() / 2 - $(window).scrollLeft();
            offset.top += $element.height() / 2 - $(window).scrollTop();
            return offset;
        }

        function ChangesCtrl() {
            var lastMod = new Date().getTime();
            var finishedMod = lastMod+1,
                pendulum = new Pendulum($('#pendulum'));
               refreshTimer = setInterval(function () {
                        if (lastMod < finishedMod && ((new Date()).getTime() - finishedMod) > 30000) {
                            refreshFromServer();
                        }
                    }, 500
                );
            $('#' + config['CSS']['IDs']['btSaveChanges']).click(function () {
                var action = GetComunicationObj(config['actions']['saveChanges']),
                action = $.extend(action, getChanges());
                pendulum.$el.text('Offline. Saving changes.')
			    showPendulum();
		//doAjax(action);
            });
			
			   function refreshFromServer() {
                var action = GetComunicationObj(config['actions']['refresh']);
                showPendulum(); 
                //doAjax(action);
                
				
            }
			function showPendulum()
			{
				$buttons1=$('.'+config ['CSS'] ['classes'] ['smallBt']+':visible').css("visibility","hidden"),
				$buttons2=$('.'+config ['CSS'] ['classes'] ['bigBt']+':visible').css("visibility","hidden");
               	pendulum.startAnimate(10000,function(){
					$buttons1.css("visibility","visible");
                    $buttons2.css("visibility","visible");
					finishedMod=new Date().getTime();
				});
			}
           
            function doAjax(actionObj){
                $buttons1=$('.'+config ['CSS'] ['classes'] ['bookButtons']+':visible').css("visibility","hidden"),
                $buttons2=$('#'+config['CSS']['IDs']['ctrlPanel']).css("visibility","hidden");
                pendulum.startAnimate(30000);
                $.ajax({
                    type:"POST",
                    url: 'BooksEdit.php',
                    dataType: 'json',
                    data: actionObj,
                    timeout: 20000
                }).done(response).fail(function (jqXHR) {$('body').append(jqXHR.responseText);
                }).always(function () {
                    pendulum.stopAnimate();
                    $buttons1.css("visibility","visible");
                    $buttons2.css("visibility","visible");
                });
            };

            function GetComunicationObj(action) {
                return {
                    timestemp: $('#' + config['CSS']['IDs']['booksFolder']).data('timestemp'),
                    action: action
                };
            }

         
            function response(data) {
                $('#' + config['CSS']['IDs']['booksFolder']).data('timestemp', data.timestemp);
                var $toDel,book;
                $toDel = $('#' + data.deletedIds.join(',#')).css({overflow:'hidden',visibility:'hidden'}).animate({height: 0, width: 0}, {duration: 'slow'});
                var $allBooksDiv = $('#' + config['CSS']['IDs']['booksFolder'] + '>div.' + config['CSS']['classes']['bookContainer'] + ":visible"), booksLength = booksObj.books.length,
                    $newBooksDiv = $allBooksDiv.slice(booksLength, $allBooksDiv.length), $oldBooksDiv = $allBooksDiv.slice(0, booksLength);
                var $newBook = $('#' + config['CSS']['IDs']['newBook']), tempNewBook;

                var index = 0, indexDiv = 0, added = 0, onNewAdded = 0, tempObj = {};
                index = indexDiv = 0;
                for (var i = 0; i < data.rows.length; i++) {
                    tempObj.id = data.rows[i].id;
                    book=data.rows[i];
                    index = booksObj.index(tempObj.id, index);
                    if (index < 0) {
                        index = ~index;
                        if (index - added < $oldBooksDiv.length) {
                            tempNewBook = $newBook.clone();
                            $(oldBooksDiv[index - added]).before(tempNewBook);
                            added += 1;
                        }
                        else if ($newBooksDiv.length > onNewAdded) {
                            tempNewBook = $newBooksDiv[onNewAdded ];
                            onNewAdded += 1;
                        }
                        else {
                            tempNewBook = $newBook.clone();
                            $newBook.before(tempNewBook);
                        }
                        booksObj.insert(index, book);
                        $(tempNewBook).show();
                        bookToHtml(book,tempNewBook);
                    }
                    else {
                        booksObj.books[index] = book;
                        bookToHtml(book, $oldBooksDiv[index - added])
                    }
                
                }
                    $toDel.promise().done(function () {
                        this.remove();
                    })
                    booksObj.removeBooks(data.deletedIds);
                    finishedMod=new Date().getTime();
            }

            function getChanges() {
                var s='#' + config['CSS']['IDs']['booksFolder'] + '>div.' + config['CSS']['classes']['bookContainer'] + ":visible";
                var $allBooksDiv = $('#' + config['CSS']['IDs']['booksFolder'] + '>div.' + config['CSS']['classes']['bookContainer'] + ":visible"), booksLength = booksObj.books.length,
                    $newBooksDiv = $allBooksDiv.slice(booksLength, $allBooksDiv.length), $oldBooksDiv = $allBooksDiv.slice(0, booksLength);
                var retObj = {toRemove: [], toUpdate: [], toAdd: []}

                $oldBooksDiv.each(function (index) {
                    var $this = $(this), $changes;
                    if ($this.find('div.' + config['CSS']['classes']['cross'] + ':visible').length > 0) {
                        retObj.toRemove.push(this.id);
                    } else if (($changes = $this.find('.' + config['CSS']['classes']['dataChanged'])).length > 0) {
                        var bookChanged = {id: this.id, fields: {}};
                        $changes.each(function (ind) {
                            bookChanged.fields[this.className.match(/\s*book-(\w+)\s*/)[1]] = $(this).text();
                        })
                        retObj.toUpdate.push(bookChanged)
                    }
                });

                $newBooksDiv.each(function (ind) {
                    var columns = {};
                    for (var col in config['columnsDesc']) {
                        columns[col] = $(this).find('.book-' + col).text();
                    }
                    retObj.toAdd.push(columns);
                });
            return retObj;
            }
            
        }

        function bookToHtml(book, target) {
            var toDelClasses = config['CSS']['classes']['wrongData'] + ' ' + config['CSS']['classes']['dataChanged'],$target=$(target);
            $target.removeClass(config['CSS']['classes']['newBook']);
            $target[0].id = book.id;
            for (var col in config['columnsDesc']) {
                $target.find('.book-' + col).removeClass(toDelClasses).text(book[col]);

            }
        }

        function Pendulum($el, params_) {
            var v = 0.001,
                calcForSpeed = true,
                k = 0,
                offY = 0,
                p2,
                offX = 0,
                a,
                wHeight,
                elWidth2,
                tStart = new Date().getTime(),
                offGrad = 0,
                s_k,
				onComplete,
                backgroundL = "linear-gradient(to right,green -60%,  yellow ",
                backgroundR = "%, green 160%)",
                cssAnimStyle = {
                    left: 0,
                    top: 0,
                    position: 'fixed'
                }, default_ = {
                    longLine: 500,
                    backgroundDark: 'green',
                    backgroundLight: 'rgba(255, 255, 0, 0.45)',
                    distanceLeft: -60,
                    distanceRight: 160,
                    hvShadow: 10,
                    spreadShadow: 20,
                    colorShadow: 'black'
                }, options, timer, shadowR,timerOut;

            var initParams = function (params) {
                options = $.extend(default_, params);
                if (options.speed !== undefined) {
                    v = options.speed / 1000;
                }
                else if (options.acceleration !== undefined) {
                    a = options.acceleration / 1000000;
                    calcForSpeed = false;
                }

                backgroundL = "linear-gradient(to right," + options.backgroundDark + " " + options.distanceLeft + "%,  " + options.backgroundLight + " ";
                backgroundR = "%," + options.backgroundDark + " " + options.distanceRight + "%)";
                shadowR = "px " + options.hvShadow + "px " + options.spreadShadow + "px " + options.colorShadow;
                init();
            }

            $(window).resize(init);

            initParams(params_);

            function init() {
                var $window = $(window);
                wHeight = $window.height();

                var $body = $('body');
                var w = $window.innerWidth();
                var width = $window.innerWidth() - $el.outerWidth(),
                    height = wHeight - $el.height(),
                    h = 0,
                    w2 = width / 2;

                if (w2 >= options.longLine) {
                    if (height >= options.longLine) {
                        k = Math.PI / 2;
                        h = options.longLine;
                    } else {
                        k = Math.acos((options.longLine - height) / options.longLine);
                        h = height;
                    }
                }
                else {
                    k = Math.asin(w2 / options.longLine);
                    if (options.longLine - Math.cos(k) * options.longLine > height) {
                        k = Math.acos((options.longLine - height) / options.longLine);
                        h = height;
                    } else {
                        h = options.longLine - Math.cos(k) * options.longLine;
                    }
                }
                offY = -options.longLine + h + (height - h) / 2 | 2;
                offX = w2;

                if (calcForSpeed) {
                    p2 = 4 * k / v;
                    a = 2 * v / p2;
                }
                else {
                    p2 = Math.sqrt(2 * k / a)
                    v = a * p2;
                    p2 *= 2;
                    console.log("v :" + v + " a " + a + " period:" + p2 + " ange " + k);
                }

                elWidth2 = $el.width() / 2;
            }

            var startAnimate = function (animTime,onComp) {
                onComplete=onComp;
               
                if (animTime !== undefined) {
                    if( timerOut !==undefined){
                        clearInterval(timerOut)
                    }
                    timerOut=setTimeout(function (){timeOut=undefined;stopAnimate();}, animTime);
                }
				$el.css('visibility', 'visible');
                init()

                timer = setInterval(animate, 15)

            };
            var stopAnimate = function () {
                if (timer !== undefined) {
					if( onComplete !== undefined)
						onComplete();
				   $el.css('visibility','hidden');
                    clearInterval(timer);
                    timer = undefined;
					
                }

            }

            var animate = function () {

                var now = new Date().getTime(),
                    t = (now - tStart) % (2 * p2), s,
                    x = 0;

                if (t > p2) {
                    t -= p2 | 0;
                    s = v * t - a * t * t / 2;
                    if (s < 0) s += k;
                    x = Math.sin(s) * options.longLine;
                    s_k = -(s / k)
                }
                else {
                    s = v * t - a * t * t / 2;
                    if (s < 0) s += k;
                    x = -Math.sin(s) * options.longLine;
                    s_k = (s / k)
                }
                y = Math.cos(s) * options.longLine;
                cssAnimStyle.left = offX + x;
                cssAnimStyle.background = backgroundL + (50 + 45 * s_k | 0) + backgroundR;
                cssAnimStyle.top = offY + Math.cos(s) * options.longLine | 0;
                cssAnimStyle.boxShadow = (-options.hvShadow * s_k) + shadowR;
                $el.css(cssAnimStyle);

            }
            return {startAnimate: startAnimate, stopAnimate: stopAnimate, chageParams: initParams,$el:$el};
        }


    });/**
 * 
 */

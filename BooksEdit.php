<?php
 $config = array (
		'CSS' => array (
				'classes' => array (
						"smallBt" => 'smallBt',
						'bigBt' => 'bigBt',
						'wrongData' => 'wrongData',
						'dataChanged' => 'dataChanged',
						'bookContainer' => 'bookDiv',
						'labelInput' => 'rowUp',
						'L1' => 'L3',
						'L2' => 'L2',
						'L3' => 'L1',
						'book-input' => 'bookInput',
						'bookButtons' => 'book-buttons',
						'cross' => 'cross',
						'newBook' => 'newBook' 
				),
				'IDs' => array (
						'booksFolder' => 'booksFolder',
						'newBookDiv' => 'nowyrecord',
						'informer' => 'informer',
						'infoTitle' => "actName",
						'messageDiv' => 'messState',
						'btSaveChanges' => 'btSaveChanges',
						'btAddNewBook' => 'addRec',
						'book-editForm' => 'book-editForm',
						'ctrlPanel' => 'ctrlPanel',
						'editButtons' => 'buttons',
						'newBook' => 'newBook',
						'emptyBook' => 'emptyBook',
						'emptyLeft' => 'emptyLeft',
						'emptyTop' => 'emptyTop',
						'emptyRight' => 'emptyRigth' 
				) 
		),
		'columnsDesc' => array (
				'title' => 'Title', // 'Tytuł',
				'author' => 'Auhtor', // Autor',
				'year' => 'Year', // 'Rok Wydania',
				'comment' => 'Comment' 
		), // 'Komentarz'
		'actions' => array (
				'initialization' => 'Init',
				'addNewBook' => 'AddNew',
				'saveChanges' => 'SaveChanges',
				'refresh' => 'Refresh' 
		) 
);
$config_json = json_encode ( $config );
require_once 'servData.php';
try {
	$ser = new ServData ();
} catch ( Exception $ex ) {
}

$ajax = isset ( $_SERVER ['HTTP_X_REQUESTED_WITH'] ) && $_SERVER ['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
if (! $ajax) {
	$actbooks = $ser->getAll ();
	echo <<<EOT
<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="Stylesheet" type="text/css" href="mystyle.css" />
	<script src="jQuery-1.11.1.js"></script>
	<script>
EOT;
	
	echo "config=" . $config_json . ";";
	
	echo <<<EOT
	</script>
	<script src="BooksEdit.js"></script>
	<title>MYSQL books table editor</title>
</head>
<body>
	<h1>Books</h1>
EOT;
	
	$booksFactory = new FactoryBookHtml ( $config );
	
	echo '<div id="' . $config ['CSS'] ['IDs'] ['booksFolder'] . '"   data-timestemp="' . $actbooks->timestemp . '">';
	
	for($i = 0, $count = count ( $actbooks->rows ); $i < $count; $i ++) {
		echo $booksFactory->buildHtmlBook ( $actbooks->rows [$i] );
	}
	$emptyBook = new Book ();
	$emptyBook->id = 'newBook';
	$emptyBook->modifiedDate = 0;
	echo $booksFactory->buildHtmlBook ( $emptyBook );
	echo "<div id='curtain'> </div>";
	echo "</div>";
	echo $booksFactory->buildEmptyBook ();
	echo "		<div id='" . $config ['CSS'] ['IDs'] ['ctrlPanel'] . "'>";
	echo "			<div>";
	echo "				<button id='" . $config ['CSS'] ['IDs'] ['btAddNewBook'] . "' class='" . $config ['CSS'] ['classes'] ['bigBt'] . "'>Add new book	</button>";
	echo "				<button id='" . $config ['CSS'] ['IDs'] ['btSaveChanges'] . "'	class='" . $config ['CSS'] ['classes'] ['bigBt'] . "'>Save changes</button>";
	echo " 			</div>";
	echo "		</div>";
	echo "	<div id='pendulum' style='visibility: hidden; position: fixed;'></div>";
	echo "</body>";
	echo "</html>";
} else {
	
//	sleep ( 20 );
	try {
		$forKlient = $ser->makeAction ( $_POST );
	} catch ( Exception $ex ) {
		$forKlient = new ActBooks ( $ex->getMessage () );
	}
	
	$str = json_encode ( $forKlient );
	header ( 'Content-Type: application/json' );
	echo $str;
}
class FactoryBookHtml {
	public function __construct($config) {
		$this->config = $config;
	}
	public function buildHtmlBook($book) {
		return '<div class="' . $this->config ['CSS'] ['classes'] ['bookContainer'] . '" id="' . $book->{'id'} . '" data-timestemp="' . $book->modifiedDate . '">' . "<div class='" .
				 $this->config ['CSS'] ['classes'] ['bookButtons'] . "'>" . "<input type='button' class='" . $this->config ['CSS'] ['classes'] ['smallBt'] . "' value='E' />" .
				 "<input type='button' class='" . $this->config ['CSS'] ['classes'] ['smallBt'] . "' value='X'/></div>" . "<div class='" . $this->config ['CSS'] ['classes'] ['L1'] .
				 "'>" . "<div class='" . $this->config ['CSS'] ['classes'] ['L2'] . "'>" . "<div class='" . $this->config ['CSS'] ['classes'] ['L3'] . "'>" . "<div class='book-" .
				 "author" . "' title='" . $this->config ['columnsDesc'] ['author'] . "'>" . $book->{'author'} . "</div>" . "<div class='book-" . "title" . "' title='" .
				 $this->config ['columnsDesc'] ['title'] . "'>" . $book->{'title'} . "</div>" . "<div class='book-" . "comment" . "' title='" .
				 $this->config ['columnsDesc'] ['comment'] . "'>" . $book->{'comment'} . "</div>" . "<div class='book-" . "year" . "' title='" .
				 $this->config ['columnsDesc'] ['year'] . "'>" . $book->{'year'} . "</div>" . "</div>" . "<div class='" . $this->config ['CSS'] ['classes'] ['cross'] .
				 "'><div></div><div>X</div></div>" . "</div>" . "</div>" . "</div>";
	}
	public function buildEmptyBook() {
		return "<div class='" . $this->config ['CSS'] ['classes'] ['bookContainer'] . "' id='emptyBook'>" . "<div class='" . $this->config ['CSS'] ['classes'] ['bookButtons'] . "'>" .
				 "<input type='button' class='" . $this->config ['CSS'] ['classes'] ['smallBt'] . "' value='X' style='visibility:hidden'/>" . "<input type='button' class='" .
				 $this->config ['CSS'] ['classes'] ['smallBt'] . "' value='X'/></div>" . "<div class='" . $this->config ['CSS'] ['classes'] ['L1'] . "'>" . "<div class='" .
				 $this->config ['CSS'] ['classes'] ['L2'] . "'>" . "<div id='emptyRight' class='" . $this->config ['CSS'] ['classes'] ['L3'] . "'>" .
				 $this->buildBookCtrl ( 'rightform' ) . "</div>" . "<div id='emptyLeft' class='" . $this->config ['CSS'] ['classes'] ['L3'] . "'>" .
				 $this->buildBookCtrl ( 'leftform' ) . "</div>" . "<div id='emptyTop' class='" . $this->config ['CSS'] ['classes'] ['L3'] . "'>" . 

				"<div class='book-" . "author" . "' title='" . $this->config ['columnsDesc'] ['author'] . "'></div>" . "<div class='book-" . "title" . "' title='" .
				 $this->config ['columnsDesc'] ['title'] . "'></div>" . "<div class='book-" . "comment" . "' title='" . $this->config ['columnsDesc'] ['comment'] . "'></div>" .
				 "<div class='book-" . "year" . "' title='" . $this->config ['columnsDesc'] ['year'] . "'></div>" . "</div>" . "</div>" . "</div>" . "<div id='buttons'>" .
				 "<input class='" . $this->config ['CSS'] ['classes'] ['bigBt'] . "' type='button' value='Ok'/>" . "<input class='" . $this->config ['CSS'] ['classes'] ['bigBt'] .
				 "' type='button' value='Cancel'/>" . "</div>" . 

				"</div>";
	}
	private function buildBookCtrl($id) {
		return "<div id='" . $id . "'>" . "<div>" . "<label> " . $this->config ['columnsDesc'] ['author'] . "</label>" . "<input type='text' class='book-" . "author " .
				 $this->config ['CSS'] ['classes'] ['book-input'] . "'/>" . "</div><div>" . "<label>" . $this->config ['columnsDesc'] ['title'] . "</label>" .
				 "<input type ='text' class='book-" . "title " . $this->config ['CSS'] ['classes'] ['book-input'] . "'/>" . "</div><div>" . "<label>" .
				 $this->config ['columnsDesc'] ['year'] . "</label>" . "<input type='number' class='book-" . "year " . $this->config ['CSS'] ['classes'] ['book-input'] . "'/>" .
				 "</div><div>" . "<label>" . $this->config ['columnsDesc'] ['comment'] . "</label>" . "<textarea class='book-" . "comment " .
				 $this->config ['CSS'] ['classes'] ['book-input'] . "' rows='5'></textarea>" . "</div>" . "</div>";
	}
}
?>


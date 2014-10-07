<?php

$db_hostname = 'localhost';
$db_database = 'booksinfo';
$db_username = 'mar';
$db_password = '123';


$jsonO = json_decode(file_get_contents("php://input"));
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);
//sleep();
if ($connection->connect_error)
    $actBook = new ActBooks($connection->connect_error);
else {
    
    if ($jsonO->action == 'AddNew') {
        $query = "INSERT INTO books (author, title,  year, comment,modifiedDate) VALUES" . "('" . $jsonO->newRec->author . "','" . $jsonO->newRec->title . "','" . $jsonO->newRec->year . "','" . $jsonO->newRec->comment . "',NOW())";
        
        $result = $connection->query($query);
        
        if ($result)
            $actBooks = GetBooks($connection, getTimestemp($connection), $jsonO->timestemp);
        else
            $actBooks = new ActBooks(mysqli_error($connection));
    } elseif ($jsonO->action == 'Init') {
        $actBooks = GetBooks($connection, getTimestemp($connection), null);
    } elseif ($jsonO->action == 'SaveChanges') {
        $timestemp = getTimestemp($connection);
        $count = count($jsonO->toUpdate);
        $result=1;
        for ($i = 0; $i < $count&& $result; $i ++) {
            $up = array();
            if(isset($jsonO->toUpdate[$i]->fields->year) ) {
                $up[]='year = '.$jsonO->toUpdate[$i]->fields->year;
                unset($jsonO->toUpdate[$i]->fields->year);
            }
            foreach ($jsonO->toUpdate[$i]->fields as $name => $value)
                $up[] = $name . "= '" . $value."'";
            $query = "UPDATE books SET " . join(",", $up) . ", modifiedDate = FROM_UNIXTIME(" . $timestemp . ") WHERE id = " . $jsonO->toUpdate[$i]->id;
            $result = $connection->query($query);
        }
        if ($i==0 || $result) {
            $count = count($jsonO->toDelete);
            $result=1;
            for ($i = 0; $i < $count&& $result; $i ++) {
                $query = "UPDATE books SET isDeleted=1, modifiedDate = FROM_UNIXTIME(" . $timestemp . ") WHERE id = " . $jsonO->toDelete[$i];
                $result=$connection->query($query);
            }
        }
        if($i==0||$result)
            $actBooks = GetBooks($connection, $timestemp, $jsonO->timestemp);
        else 
            $actBooks = new ActBooks(mysqli_error($connection));
            
    }
    elseif( $jsonO->action=='Refresh') {
        $actBooks = GetBooks($connection, getTimestemp($connection), $jsonO->timestemp);
    }
    $connection->close();
    $str = json_encode($actBooks);
    header('Content-Type: application/json');
    echo $str;
}



function getRecsFromResult($result, &$aBooks)
{
    $rows = $result->num_rows;
    for ($j = 0; $j < $rows; ++ $j) {
        $result->data_seek($j);
        $row = $result->fetch_array(MYSQL_ASSOC);
        $book = new Book();
        $book->author = $row['author'];
        $book->title = $row['title'];
        $book->comment = $row['comment'];
        $book->id = $row['id'];
        $book->year = $row['year'];
        $aBooks[] = $book;
    }
}

function getTimestemp($connection)
{
    $query = "SELECT UNIX_TIMESTAMP()";
    $result = $connection->query($query);
    $result->data_seek(0);
    $ret=$result->fetch_array(MYSQLI_NUM)[0];
     
    return $ret;
}

function getBooks($connection,$newTimestemp ,$oldTimestemp)
{

    $actBooks = new ActBooks(null);
    $actBooks->timestemp = $newTimestemp;
     
    if ($oldTimestemp == null)
        $query = "SELECT * FROM books WHERE isDeleted = 0 ORDER BY id";
    else
        $query = "SELECT * FROM books WHERE isDeleted = 0 AND modifiedDate > FROM_UNIXTIME(" . $oldTimestemp . ")  ORDER BY id";

    $result = $connection->query($query);
    if(!$result)
        $err=mysqli_error($connection);
    getRecsFromResult($result, $actBooks->rows);
    $result->close();

    if ($oldTimestemp != null) {
        $query = "SELECT id FROM books WHERE isDeleted = 1 AND modifiedDate > FROM_UNIXTIME(" . $oldTimestemp . ") ORDER BY id";
        $result = $connection->query($query);
        if(!$result)
            $err=mysqli_error($connection);

        $rows = $result->num_rows;
        for ($j = 0; $j < $rows; ++ $j) {
            $result->data_seek($j);
            $row = $result->fetch_array(MYSQLI_NUM);
            $actBooks->deletedIds[] = $row[0];
        }
        $result->close();
    }
    return $actBooks;
}

class ActBooks
{

    public $errInfo;

    public $timestemp, $rows = array(), $deletedIds = array();

    function __construct($error)
    {
        $this->errInfo = new ServerErr();
        if ($error != null) {
            $this->errInfo->nr = 1;
            $this->errInfo->errMessage = $error;
        }
    }
}

class Book
{
    public $title, $author, $year, $comment, $id;
}

class ServerErr
{
    public $nr = 0, $errMessage="";
}

?>
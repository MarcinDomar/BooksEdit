<?php
$jsonO = json_decode(file_get_contents("php://input"));
 sleep(10);

try {
    $ser=new ServData();
    $forKlient=$ser->makeAction($jsonO);
       
}

catch(Exception $ex)
{
    $forKlient= new ActBooks($ex->getMessage());
}
 
 $str = json_encode($forKlient);
 header('Content-Type: application/json');
 echo $str;
 

class ServData
{

    const DB_HOSTNAME = 'localhost';

    const DB_DATABASE = 'booksinfo';

    const DB_USERNAME = 'mar';

    const DB_PASSWORD = '123';

    private $connection = null;

    function __construct()
    {
        $this->connection = new mysqli(ServData::DB_HOSTNAME, ServData::DB_USERNAME, ServData::DB_PASSWORD, ServData::DB_DATABASE);
    }
    function __destruct(){
        $this->connection->close();        
    }
    public function makeAction($klientData)
    {
        if ($klientData->action == 'AddNew') {
            $this->AddNewBook($klientData->newRec);
        } elseif ($klientData->action == 'SaveChanges') {
            $this->SaveChanges($klientData->toUpdate, $klientData->toDelete);
        }
        
        if ($klientData->action == 'Init') {
            $actBooks = $this->GetBooks(  null);
        }
        else {
            $actBooks = $this->GetBooks(  $klientData->timestemp);
        }
        return $actBooks;    
    }

    private function addNewBook($newRec)
    {
        $this->connection->begin_transaction();
        $query = "INSERT INTO books (author, title,  year, comment,modifiedDate) VALUES" . "('" . $newRec->author . "','" . $newRec->title . "','" . $newRec->year . "','" . $newRec->comment . "',NOW())";
        $result = $this->connection->query($query);
        
        if (! $result) {
            $this->connection->rollback();
            throw new Exception("Problem z dodawaniem nowej książki: " . $connection->connect_error);
        } else {
            $this->connection->commit();
        }
    }

    private function saveChanges($toUpdate, $toRemove)
    {
        try {
            $timestemp = $this->getTimestemp();
            $count = count($toUpdate);
            $result = 1;
            $this->connection->begin_transaction();
            
            for ($i = 0; $i < $count && $result; $i ++) {
                $up = array();
                if (isset($toUpdate[$i]->fields->year)) {
                    $up[] = 'year = ' . $toUpdate[$i]->fields->year;
                    unset($toUpdate[$i]->fields->year);
                }
                foreach ($toUpdate[$i]->fields as $name => $value)
                    $up[] = $name . "= '" . $value . "'";
                $query = "UPDATE books SET " . join(",", $up) . ", modifiedDate = FROM_UNIXTIME(" . $timestemp . ") WHERE id = " . $toUpdate[$i]->id;
                $result = $this->connection->query($query);
            }
            if ($i == 0 || $result) {
                $count = count($toRemove);
                $result = 1;
                for ($i = 0; $i < $count && $result; $i ++) {
                    $query = "UPDATE books SET isDeleted=1, modifiedDate = FROM_UNIXTIME(" . $timestemp . ") WHERE id = " . $toRemove[$i];
                    $result = $this->connection->query($query);
                }
            }
            $this->connection->commit();
        } catch (Exception $e) {
            $this->connection->rollback();
            throw new Exception("Problem z zapisywaniem zmian : " . $connection->connect_error);
        }
    }
    private function getRecsFromResult($result, &$aBooks)
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

    private function getTimestemp()
    {
        $query = "SELECT UNIX_TIMESTAMP()";
        $result = $this->connection->query($query);
        $result->data_seek(0);
        $ret = $result->fetch_array(MYSQLI_NUM)[0];
        
        return $ret;
    }

    private function getBooks($oldTimestemp)
    {
        $actBooks = new ActBooks(null);
        $actBooks->timestemp = $this->getTimestemp();
        
        if ($oldTimestemp == null)
            $query = "SELECT * FROM books WHERE isDeleted = 0 ORDER BY id";
        else
            $query = "SELECT * FROM books WHERE isDeleted = 0 AND modifiedDate > FROM_UNIXTIME(" . $oldTimestemp . ")  ORDER BY id";
        
        $result = $this->connection->query($query);
        if (! $result)
            throw new Exception("Problem z zapiswyanie zmian : " . $this->connection->connect_error);
        $this->getRecsFromResult($result, $actBooks->rows);
        $result->close();
        
        if ($oldTimestemp != null) {
            $query = "SELECT id FROM books WHERE isDeleted = 1 AND modifiedDate > FROM_UNIXTIME(" . $oldTimestemp . ") ORDER BY id";
            $result = $this->connection->query($query);
            if (! $result)
                throw new Exception("Problem z zapiswyanie zmian : " . $this->connection->connect_error);
            
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

    public $nr = 0, $errMessage = "";
}

?>
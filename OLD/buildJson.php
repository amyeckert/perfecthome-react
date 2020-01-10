<?php
	
    $file = "data.json";  //name and location of json file. 

    $fh = fopen($file, 'a');  //'a' will append the data to the end of the file.

    $newData = $_POST; //put POST data from ajax request in a variable
    print_r($_POST);

    fwrite($fh, json_encode($newData, JSON_PRETTY_PRINT));  //write the data with fwrite.

	echo json_encode($newData);
    fclose($fh);  //close the file
?>


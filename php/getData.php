<?php
	error_reporting(E_ALL);

	$db = new mysqli("localhost", "root", "root", "reddit") or die(mysqli_error($db));

	$query_string = "SELECT created_utc, score, domain, ups, downs, thumbnail FROM data ORDER BY created_utc DESC";

	$result = $db->query($query_string) or die(mysqli_error($db));

	$response = array();

	$counter = 0;

	while($row = $result->fetch_assoc()){
		$response["data"][$counter]["created_utc"] = $row["created_utc"];
		$response["data"][$counter]["score"] 	   = $row["score"];
		$response["data"][$counter]["domain"]	   = $row["domain"];
		$response["data"][$counter]["ups"]	   	   = $row["ups"];
		$response["data"][$counter]["downs"]	   = $row["downs"];
		//Parse proper image link if present
		$response["data"][$counter]["thumbnail"]   = $row["thumbnail"];
		$counter++;
	}

	//Fetch min and max values for normalization
	$result = $db->query("SELECT MIN(created_utc), MAX(created_utc), MIN(score), MAX(score) FROM data");
	$result = $result->fetch_assoc();

	$response["minTime"]  = $result["MIN(created_utc)"];
	$response["maxTime"]  = $result["MAX(created_utc)"];
	$response["minScore"] = $result["MIN(score)"];
	$response["maxScore"] = $result["MAX(score)"];

	$db->close();

	//Return the data
	echo json_encode($response);
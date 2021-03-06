<?php
	/*
		David Weber
		This script fetches the data from the DB, temporally ordered, and returns it as JSON
	*/

	//error_reporting(E_ALL);

	$db = new mysqli("localhost", "root", "", "reddit") or die(mysqli_error($db));

	//Fetch data based on time
	$query_string = "SELECT title, author, created_utc, score, domain, ups, downs, thumbnail, url, num_comments FROM data ORDER BY created_utc DESC";

	$result = $db->query($query_string) or die(mysqli_error($db));

	$response = array();

	$counter = 0;

	/* Write results to array */

	while($row = $result->fetch_assoc()){
		$response["data"][$counter]["title"]        = htmlentities($row["title"], ENT_QUOTES);
		$response["data"][$counter]["created_utc"]  = $row["created_utc"];
		$response["data"][$counter]["author"]       = $row["author"];
		$response["data"][$counter]["score"] 	    = $row["score"];
		$response["data"][$counter]["domain"]	    = $row["domain"];
		$response["data"][$counter]["ups"]	   	    = $row["ups"];
		$response["data"][$counter]["downs"]	    = $row["downs"];
		$response["data"][$counter]["num_comments"] = $row["num_comments"];

		//Parse proper image link if present
		$response["data"][$counter]["thumbnail"]    = $row["thumbnail"];
		$counter++;
	}

	//Fetch min and max values for normalization
	$result = $db->query("SELECT MIN(ups), MAX(ups),MIN(downs), MAX(downs), MIN(created_utc), MAX(created_utc), MIN(score), MAX(score), MIN(num_comments), MAX(num_comments) FROM data");
	$result = $result->fetch_assoc();

	$response["minComments"]  = $result["MIN(num_comments)"];
	$response["maxComments"]  = $result["MAX(num_comments)"];
	$response["minUps"]  = $result["MIN(ups)"];
	$response["maxUps"]  = $result["MAX(ups)"];
	$response["minDowns"]  = $result["MIN(downs)"];
	$response["maxDowns"]  = $result["MAX(downs)"];
	$response["minTime"]  = $result["MIN(created_utc)"];
	$response["maxTime"]  = $result["MAX(created_utc)"];
	$response["minScore"] = $result["MIN(score)"];
	$response["maxScore"] = $result["MAX(score)"];

	$db->close();

	//Return the data
	echo json_encode($response);
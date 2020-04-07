package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	"github.com/cheggaaa/pb"
)

// GameResult :
type GameResult struct {
	Data []struct {
		ID    string `json:"id"`
		Names struct {
			International string      `json:"international"`
			Japanese      interface{} `json:"japanese"`
		} `json:"names"`
		Abbreviation string `json:"abbreviation"`
		Weblink      string `json:"weblink"`
	} `json:"data"`
	Pagination struct {
		Offset int `json:"offset"`
		Max    int `json:"max"`
		Size   int `json:"size"`
		Links  []struct {
			Rel string `json:"rel"`
			URI string `json:"uri"`
		} `json:"links"`
	} `json:"pagination"`
}

func main() {
	for i := 0; i <= 18; i++ {
		fmt.Printf("----------%d/18----------\n", i)

		values := url.Values{}
		values.Add("_bulk", "yes")
		values.Add("max", "1000")
		values.Add("offset", fmt.Sprint(i*1000))
		url := "https://www.speedrun.com/api/v1/games"
		jsonStr, err := httpGet(values, url)
		if err != nil {
			fmt.Println(err)
			return
		}

		var result GameResult
		err = json.Unmarshal([]byte(*jsonStr), &result)
		if err != nil {
			fmt.Println(err)
			return
		}
		fmt.Printf("offset: %d\n", result.Pagination.Offset)
		bar := pb.StartNew(result.Pagination.Size)

		for _, data := range result.Data {
			// fmt.Printf("%s:%s ", data.ID, data.Names.International)
			insertGameToDB(data.ID, data.Names.International)
			bar.Increment()
		}
		bar.FinishPrint("")
		time.Sleep(time.Second)
	}
}

func insertGameToDB(ID string, Names string) {
	jsonStr := `{"game_id":"` + ID + `","game_title":"` + Names + `"}`
	url := "http://192.168.99.100:8080/v1/games"
	_, err := httpPost(url, jsonStr)
	if err != nil {
		fmt.Println(err)
		return
	}
	// fmt.Printf("%q\n\n", ret)
}

func httpGet(values url.Values, url string) (*string, error) {
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	request.URL.RawQuery = values.Encode()

	// リクエスト送信
	client := new(http.Client)
	resp, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	bodyStr := string(body)

	return &bodyStr, nil
}

func httpPost(url string, jsonStr string) ([]byte, error) {

	req, err := http.NewRequest(
		"POST",
		url,
		bytes.NewBuffer([]byte(jsonStr)),
	)
	if err != nil {
		return nil, err
	}

	// Content-Type 設定
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return body, err
}

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"
)

// RunsResult :
type RunsResult struct {
	Data []struct {
		ID     string `json:"id"`
		Game   string `json:"game"`
		Status struct {
			Status     string `json:"status"`
			Examiner   string `json:"examiner"`
			VerifyDate string `json:"verify-date"`
		} `json:"status"`
		Date      string      `json:"date"`
		Submitted time.Time   `json:"submitted"`
		Splits    interface{} `json:"splits"`
	} `json:"data"`
}

// Runs :
type Runs struct {
	RunID      string `json:"run_id"`
	VerifyDate string `json:"verify_date"`
}

// Game :
type Game struct {
	GameID          string `json:"game_id"`
	GameTitle       string `json:"game_title"`
	ActivePlayerNum int    `json:"active_player_num"`
	LastUpdated     string `json:"last_updated"`
}

func main() {
	// API_HOST := os.Getenv("API_HOST")
	SET_LAST_UPDATED := os.Getenv("SET_LAST_UPDATED")
	SLEEP_SECONDS, err := strconv.Atoi(os.Getenv("SLEEP_SECONDS"))
	if err != nil {
		fmt.Println("SLEEP_SECONDS must be int!")
		log.Fatal()
	}
	PAGE_MAX, err := strconv.Atoi(os.Getenv("PAGE_MAX"))
	if err != nil {
		fmt.Println("PAGE_MAX must be int!")
		log.Fatal()
	}

	// API_HOST := "http://192.168.99.100:8080"
	// SLEEP_SECONDS := 3
	// PAGE_MAX := 20
	// SET_LAST_UPDATED := "2000-04-11T12:55:08Z"

	memo := map[string]string{}

	for pageCounter := 0; ; pageCounter++ { //更新を全て取得するまで回す
		fmt.Println("-----------------------------")
		offset := pageCounter * PAGE_MAX
		fmt.Printf("Offset: %d\n", offset)
		runResult, err := getLatestRecords(PAGE_MAX, offset) //speedrun.comのAPI叩いて最新の記録を取得する
		fmt.Printf("Result: ")
		if err != nil {
			fmt.Printf("fail!\n")
			fmt.Println(err)
			log.Fatal()
		}
		fmt.Printf("success!\n")
		fmt.Println("results: ")
		for index, runData := range runResult.Data {
			fmt.Printf("   %d: \n", index)

			fmt.Printf("      runID: %s\n", runData.ID)
			fmt.Printf("      gameID: %s\n", runData.Game)
			fmt.Printf("      verifyDate: %s\n", runData.Status.VerifyDate)

			//DBにrunIDを追加する
			fmt.Print("      insertRunID: ")
			ok, err := insertRunIDAndVerifyDate(runData.ID, runData.Status.VerifyDate)
			if err != nil {
				fmt.Println("error!")
				fmt.Println(err)
				log.Fatal()
			}
			if !ok {
				//既にDBに追加済み=全て見終わったのでプログラム終了
				fmt.Println("Exists!")
				if _, ok := memo[runData.ID]; ok {
					//ただし, 同じ周回の中で既に登録したIDはoffsetのズレで重複する可能性があるので無視
					continue
				}
				return
			}
			fmt.Println("Success!")
			memo[runData.ID] = "done" //登録済みのIDをmapにセットする

			//gameのlast_updatedをSET_LAST_UPDATEDに設定してクローラに拾ってもらえるようにする
			fmt.Print("      setLastUpdated: ")
			err = setGamesLastUpdated(runData.Game, SET_LAST_UPDATED)
			if err != nil {
				fmt.Println("error!")
				fmt.Println(err)
				log.Fatal()
			}
			fmt.Println("success!")
		}
		time.Sleep(time.Second * time.Duration(SLEEP_SECONDS))
	}
}

func setGamesLastUpdated(gameID string, lastUpdated string) error {
	API_HOST := os.Getenv("API_HOST")
	apiURL := fmt.Sprintf("%s/v1/games/%s/last_updated", API_HOST, gameID)
	jsonStr := fmt.Sprintf("{\"last_updated\":\"%s\"}", lastUpdated)
	res, err := httpPut(apiURL, jsonStr)
	if err != nil {
		fmt.Println("a")
		return err
	}
	var game Game
	err = json.Unmarshal([]byte(*res), &game)
	if err != nil {
		//game_idが存在しない TODO: DBにgame_idが登録されていない場合の処理を入れる
		fmt.Println("game_id does not exist!!! ")
	}
	if game.GameID == "" {
		//game_idが存在しない TODO: DBにgame_idが登録されていない場合の処理を入れる
		fmt.Println("game_id does not exist!!! ")
	}
	return nil
}

func insertRunIDAndVerifyDate(runID string, verifyDate string) (bool, error) {
	API_HOST := os.Getenv("API_HOST")
	apiURL := fmt.Sprintf("%s/v1/runs", API_HOST)
	insertRun := Runs{RunID: runID, VerifyDate: verifyDate}
	jsonBytes, err := json.Marshal(insertRun)
	if err != nil {
		return false, err
	}
	jsonStr := string(jsonBytes)
	res, err := httpPost(apiURL, jsonStr)
	if err != nil {
		return false, err
	}
	var runResult Runs
	err = json.Unmarshal([]byte(*res), &runResult)
	if err != nil {
		return false, nil //unmarshal出来ない=DBに存在する
	}
	if runResult.RunID == "" {
		return false, nil //DBにrun_idが存在
	}

	return true, nil //追加成功
}

func getLatestRecords(max int, offset int) (*RunsResult, error) {
	apiURL := fmt.Sprintf("https://www.speedrun.com/api/v1/runs")
	values := url.Values{}
	values.Add("status", "verified")
	values.Add("orderby", "verify-date")
	values.Add("direction", "desc")
	values.Add("max", strconv.Itoa(max))
	values.Add("offset", strconv.Itoa(offset))
	res, err := httpGet(values, apiURL)
	if err != nil {
		return nil, err
	}
	var runsResult RunsResult
	err = json.Unmarshal([]byte(*res), &runsResult)
	if err != nil {
		return nil, err
	}
	return &runsResult, nil
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

	// fmt.Println(bodyStr)

	return &bodyStr, nil
}

func httpPost(url string, jsonStr string) (*string, error) {

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
	bodyStr := string(body)
	return &bodyStr, err
}

func httpPut(url string, jsonStr string) (*string, error) {

	req, err := http.NewRequest(
		"PUT",
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
	bodyStr := string(body)
	return &bodyStr, err
}

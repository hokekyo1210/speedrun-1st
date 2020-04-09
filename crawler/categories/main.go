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

	"math/rand"
)

// Game :
type Game struct {
	GameID          string `json:"game_id"`
	GameTitle       string `json:"game_title"`
	ActivePlayerNum int    `json:"active_player_num"`
	LastUpdated     string `json:"last_updated"`
}

// CategoryResult :
type CategoryResult struct {
	Data []struct {
		ID      string `json:"id"`
		Name    string `json:"name"`
		Weblink string `json:"weblink"`
		Type    string `json:"type"`
		Rules   string `json:"rules"`
		Players struct {
			Type  string `json:"type"`
			Value int    `json:"value"`
		} `json:"players"`
		Miscellaneous bool `json:"miscellaneous"`
		Links         []struct {
			Rel string `json:"rel"`
			URI string `json:"uri"`
		} `json:"links"`
	} `json:"data"`
}

// VariableResult :
type VariableResult struct {
	Data []struct {
		ID       string      `json:"id"`
		Name     string      `json:"name"`
		Category interface{} `json:"category"`
		Scope    struct {
			Type string `json:"type"`
		} `json:"scope"`
		Mandatory   bool `json:"mandatory"`
		UserDefined bool `json:"user-defined"`
		Obsoletes   bool `json:"obsoletes"`
		Values      struct {
			Choices map[string]string `json:"choices"`
		} `json:"values"`
		IsSubcategory bool `json:"is-subcategory"`
	} `json:"data"`
}

// ValueOne :
type ValueOne struct {
	VariableID string
	ValueID    string
	Label      string
}

// RunResult :
type RunResult struct {
	Data struct {
		Weblink   string      `json:"weblink"`
		Game      string      `json:"game"`
		Category  string      `json:"category"`
		Level     interface{} `json:"level"`
		Platform  interface{} `json:"platform"`
		Region    interface{} `json:"region"`
		Emulators interface{} `json:"emulators"`
		VideoOnly bool        `json:"video-only"`
		Timing    string      `json:"timing"`
		Runs      []struct {
			Place int `json:"place"`
			Run   struct {
				ID       string      `json:"id"`
				Weblink  string      `json:"weblink"`
				Game     string      `json:"game"`
				Level    interface{} `json:"level"`
				Category string      `json:"category"`
				Videos   struct {
					Links []struct {
						URI string `json:"uri"`
					} `json:"links"`
				} `json:"videos"`
				Comment string `json:"comment"`
				Status  struct {
					Status     string `json:"status"`
					Examiner   string `json:"examiner"`
					VerifyDate string `json:"verify-date"`
				} `json:"status"`
				Date      string `json:"date"`
				Submitted string `json:"submitted"`
				Times     struct {
					Primary          string      `json:"primary"`
					PrimaryT         float64     `json:"primary_t"`
					Realtime         string      `json:"realtime"`
					RealtimeT        float64     `json:"realtime_t"`
					RealtimeNoloads  interface{} `json:"realtime_noloads"`
					RealtimeNoloadsT float64     `json:"realtime_noloads_t"`
					Ingame           interface{} `json:"ingame"`
					IngameT          float64     `json:"ingame_t"`
				} `json:"times"`
				System struct {
					Platform string `json:"platform"`
					Emulated bool   `json:"emulated"`
					Region   string `json:"region"`
				} `json:"system"`
			} `json:"run"`
		} `json:"runs"`
		Players struct {
			Data []struct {
				Rel   string `json:"rel"`
				ID    string `json:"id"`
				Names struct {
					International string `json:"international"`
				} `json:"names"`
				Name      string `json:"name"`
				Weblink   string `json:"weblink"`
				NameStyle struct {
					Style     string `json:"style"`
					ColorFrom struct {
						Light string `json:"light"`
						Dark  string `json:"dark"`
					} `json:"color-from"`
					ColorTo struct {
						Light string `json:"light"`
						Dark  string `json:"dark"`
					} `json:"color-to"`
				} `json:"name-style"`
				Location struct {
					Country struct {
						Code  string `json:"code"`
						Names struct {
							International string      `json:"international"`
							Japanese      interface{} `json:"japanese"`
						} `json:"names"`
					} `json:"country"`
					Region struct {
						Code  string `json:"code"`
						Names struct {
							International string      `json:"international"`
							Japanese      interface{} `json:"japanese"`
						} `json:"names"`
					} `json:"region"`
				} `json:"location,omitempty"`
				Twitch        interface{} `json:"twitch"`
				Hitbox        interface{} `json:"hitbox"`
				Youtube       interface{} `json:"youtube"`
				Twitter       interface{} `json:"twitter"`
				Speedrunslive interface{} `json:"speedrunslive"`
				Links         []struct {
					Rel string `json:"rel"`
					URI string `json:"uri"`
				} `json:"links"`
			} `json:"data"`
		} `json:"players"`
	} `json:"data"`
}

// Player :
type Player struct {
	PlayerID      string `json:"player_id"`
	PlayerName    string `json:"player_name"`
	CountryName   string `json:"country_name"`
	Twitch        string `json:"twitch"`
	Hitbox        string `json:"hitbox"`
	Youtube       string `json:"youtube"`
	Twitter       string `json:"twitter"`
	Speedrunslive string `json:"speedrunslive"`
	IsGuest       bool   `json:"is_guest"`
}

// Category :
type Category struct {
	CategoryID        string   `json:"category_id"`
	PrimaryCategoryID string   `json:"primary_category_id"`
	GameID            string   `json:"game_id"`
	CategoryName      string   `json:"category_name"`
	SubcategoryName   string   `json:"subcategory_name"`
	BestPlayersID     []string `json:"best_players_id"`
	BestTime          string   `json:"best_time"`
	BestDate          string   `json:"best_date"`
	BestVideoLink     string   `json:"best_video_link"`
	BestComment       string   `json:"best_comment"`
	LastUpdated       string   `json:"last_updated"`
}

func main() {
	rand.Seed(time.Now().UnixNano())
	API_HOST := os.Getenv("API_HOST")
	SLEEP_SECONDS, err := strconv.Atoi(os.Getenv("SLEEP_SECONDS"))
	if err != nil {
		fmt.Println("SLEEP_SECONDS must be int!")
		log.Fatal()
	}
	// API_HOST := "http://192.168.99.100:8080"
	// SLEEP_SECONDS := 3

	//last_updatedが最も古いゲームを取得する
	apiURL := fmt.Sprintf("%s/v1/games/oldest", API_HOST)
	res, err := httpGet(url.Values{}, apiURL)
	if err != nil {
		fmt.Println(err)
		log.Fatal()
	}
	var game Game
	err = json.Unmarshal([]byte(*res), &game)
	if err != nil {
		fmt.Println(err)
		log.Fatal()
	}
	if game.GameID == "" {
		fmt.Println("target game_id does not exist!")
		log.Fatal()
	}
	tagertGameID := game.GameID
	// tagertGameID := "m1m8opd2"
	// tagertGameID := "9d3yzw6l" <- guest
	// tagertGameID := "nd2ekj5d" //<- subsubcategory

	//tagerGameIDのゲームのカテゴリ一覧を取得
	categoryURL := fmt.Sprintf("https://www.speedrun.com/api/v1/games/%s/categories", tagertGameID)
	res, err = httpGet(url.Values{}, categoryURL)
	if err != nil {
		fmt.Print(err)
		log.Fatal()
	}
	var categoryResult CategoryResult
	err = json.Unmarshal([]byte(*res), &categoryResult)
	if err != nil {
		fmt.Print(err)
		log.Fatal()
	}

	//カテゴリ毎の1位の記録を取得する
	for _, categoryData := range categoryResult.Data {
		if categoryData.Type == "per-level" {
			//levelの場合は無視する
			continue
		}
		fmt.Println("---------------------")
		fmt.Println("GameTitle: " + fmt.Sprintf("\"%s\"", game.GameTitle))
		fmt.Println("CategoryTitle: " + categoryData.Name)
		fmt.Println("CategoryID: " + categoryData.ID)
		fmt.Println("Links: ")
		for _, link := range categoryData.Links {
			fmt.Print("   " + link.Rel)
			fmt.Print(": ")
			fmt.Println(link.URI)
		}

		subCategories, err := getSubcategories(categoryData.ID)
		if err != nil {
			fmt.Print(err)
			log.Fatal()
		}
		fmt.Println("SubCategories: ")
		fmt.Println("   " + fmt.Sprint(subCategories))

		values := []url.Values{}
		labels := []string{}
		if len(subCategories) == 0 {
			//サブカテゴリ無し
			value := url.Values{}
			value.Add("top", "1")
			value.Add("embed", "players")
			values = append(values, value)
		} else {
			//1つのカテゴリの中にサブカテゴリが存在するので全パターン洗い出し(深さ優先探索)
			n := len(subCategories)
			memo := make([]int, n, n)
			cv := make(chan url.Values, 1)
			cl := make(chan string, 1)
			go dfs(n, 0, memo, subCategories, cv, cl)
			for value := range cv {
				label := <-cl
				values = append(values, value)
				labels = append(labels, label)
			}
		}
		// fmt.Println(values)
		// fmt.Println(labels)

		fmt.Println("Runs: ")
		//speedrun.comから記録を取得してDBに登録する
		for index, value := range values {
			runURL := fmt.Sprintf(
				"https://www.speedrun.com/api/v1/leaderboards/%s/category/%s",
				tagertGameID,
				categoryData.ID)

			fmt.Println("   runURL: " + runURL)

			res, err = httpGet(value, runURL)
			if err != nil {
				fmt.Print(err)
				log.Fatal()
			}
			// fmt.Println(*res)
			var runResult RunResult
			err = json.Unmarshal([]byte(*res), &runResult)
			if err != nil {
				fmt.Print(err)
				log.Fatal()
			}
			if len(runResult.Data.Runs) == 0 {
				//走者が1人もいない
				fmt.Println("   No Runners")
				continue
			}

			////バックエンドのAPIを叩いてDBに1位の記録を保存する
			subCategoryName := ""
			if len(subCategories) != 0 {
				subCategoryName = labels[index]
				fmt.Println("   SubCategory: " + subCategoryName)
			}

			//走者リストを取得する
			playerList := getPlayerListFromRunResult(runResult)

			//categoryをDBに登録
			res, err := insertRunResultToCategoryDB(runResult, categoryData.Name, subCategoryName, playerList)
			if err != nil {
				fmt.Print(err)
				log.Fatal()
			}
			fmt.Println("   categoryResult: " + fmt.Sprintf("%-40.40s", *res))

			//playerをDBに登録
			resList, err := insertRunResultToPlayerDB(runResult, playerList)
			if err != nil {
				fmt.Print(err)
				log.Fatal()
			}
			for _, resStr := range resList {
				fmt.Println("   playerResult: " + fmt.Sprintf("%-40.40s", resStr))
			}
			time.Sleep(time.Second * time.Duration(SLEEP_SECONDS))
		}
		time.Sleep(time.Second * time.Duration(SLEEP_SECONDS))
	}
}

func getPlayerListFromRunResult(runResult RunResult) []Player {
	ret := []Player{}
	for _, player := range runResult.Data.Players.Data {
		if player.Rel == "guest" {
			//guestの場合は処理がかなり変わる
			//IDとかは本家には無いのでこっちで生成する
			playerID := RandString1(8)
			playerName := player.Name
			ret = append(ret, Player{PlayerID: playerID, PlayerName: playerName, IsGuest: true})
			continue
		}
		playerID := player.ID
		playerName := player.Names.International
		countryName := player.Location.Country.Names.International
		var twitch, hitbox, youtube, twitter, speedrunslive map[string]interface{}
		var ok bool

		if twitch, ok = player.Twitch.(map[string]interface{}); !ok {
			twitch = map[string]interface{}{"uri": ""}
		}
		if hitbox, ok = player.Hitbox.(map[string]interface{}); !ok {
			hitbox = map[string]interface{}{"uri": ""}
		}
		if youtube, ok = player.Youtube.(map[string]interface{}); !ok {
			youtube = map[string]interface{}{"uri": ""}
		}
		if twitter, ok = player.Twitter.(map[string]interface{}); !ok {
			twitter = map[string]interface{}{"uri": ""}
		}
		if speedrunslive, ok = player.Speedrunslive.(map[string]interface{}); !ok {
			speedrunslive = map[string]interface{}{"uri": ""}
		}
		ret = append(ret, Player{PlayerID: playerID, PlayerName: playerName, CountryName: countryName, Twitch: twitch["uri"].(string), Hitbox: hitbox["uri"].(string), Youtube: youtube["uri"].(string), Twitter: twitter["uri"].(string), Speedrunslive: speedrunslive["uri"].(string)})
	}
	return ret
}

func insertRunResultToCategoryDB(runResult RunResult, categoryName string, subcategoryName string, playerList []Player) (*string, error) {
	bestPlayersID := []string{}
	//bestPlayerが複数の場合があるので, 配列に入れる
	for _, player := range playerList {
		bestPlayersID = append(bestPlayersID, player.PlayerID)
	}
	bestTime := strconv.FormatFloat(runResult.Data.Runs[0].Run.Times.RealtimeT, 'f', 4, 64)
	bestDate := runResult.Data.Runs[0].Run.Submitted
	bestComment := runResult.Data.Runs[0].Run.Comment
	bestVideoLink := ""
	if len(runResult.Data.Runs[0].Run.Videos.Links) != 0 {
		bestVideoLink = runResult.Data.Runs[0].Run.Videos.Links[0].URI
	}
	category := Category{PrimaryCategoryID: runResult.Data.Category,
		GameID:          runResult.Data.Game,
		CategoryName:    categoryName,
		SubcategoryName: subcategoryName,
		BestPlayersID:   bestPlayersID,
		BestTime:        bestTime,
		BestDate:        bestDate,
		BestComment:     bestComment,
		BestVideoLink:   bestVideoLink}
	jsonBytes, err := json.Marshal(category)
	if err != nil {
		return nil, err
	}
	jsonStr := string(jsonBytes)

	// fmt.Println(jsonStr)
	// return nil, nil

	API_HOST := os.Getenv("API_HOST")
	url := API_HOST + "/v1/categories"
	res, err := httpPost(url, jsonStr)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func insertRunResultToPlayerDB(runResult RunResult, playerList []Player) ([]string, error) {
	resList := []string{}
	for _, player := range playerList {
		jsonBytes, err := json.Marshal(player)
		if err != nil {
			return nil, err
		}
		jsonStr := string(jsonBytes)
		// fmt.Println(jsonStr)

		API_HOST := os.Getenv("API_HOST")
		url := API_HOST + "/v1/players"
		res, err := httpPost(url, jsonStr)
		if err != nil {
			return nil, err
		}
		resList = append(resList, *res)
	}

	return resList, nil
}

func getSubcategories(categoryID string) ([][]ValueOne, error) {
	subcategoriesURL := fmt.Sprintf("https://www.speedrun.com/api/v1/categories/%s/variables", categoryID)
	res, err := httpGet(url.Values{}, subcategoriesURL)
	if err != nil {
		return nil, err
	}
	var variableResult VariableResult
	err = json.Unmarshal([]byte(*res), &variableResult)
	if err != nil {
		return nil, err
	}

	ret := [][]ValueOne{}
	for _, data := range variableResult.Data {
		if data.IsSubcategory == false {
			continue
		}
		retSub := []ValueOne{}
		for key, val := range data.Values.Choices {
			retSub = append(retSub, ValueOne{data.ID, key, val})
		}
		ret = append(ret, retSub)
	}

	return ret, nil
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

var rs1Letters = []rune("abcdefghijklmnopqrstuvwxyz0123456789")

func RandString1(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = rs1Letters[rand.Intn(len(rs1Letters))]
	}
	return string(b)
}

func dfs(n int, depth int, memo []int, subCategories [][]ValueOne, cv chan url.Values, cl chan string) {
	if depth == n {
		//終了処理
		value := url.Values{}
		label := ""
		value.Add("top", "1")
		value.Add("embed", "players")
		for i := 0; i < n; i++ {
			if i != 0 {
				label += "-"
			}
			valueOne := subCategories[i][memo[i]]
			value.Add(fmt.Sprintf("var-%s", valueOne.VariableID), valueOne.ValueID)
			label = label + valueOne.Label
		}
		// fmt.Println("append: " + label)
		cv <- value
		cl <- label
		return
	}
	for index := range subCategories[depth] {
		memo[depth] = index
		dfs(n, depth+1, memo, subCategories, cv, cl)
	}
	if depth == 0 {
		//再帰終了
		close(cv)
		close(cl)
	}
	return
}

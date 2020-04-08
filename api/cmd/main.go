package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"

	"github.com/go-chi/chi"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

func main() {
	//環境変数設定
	POSTGRES_USER := os.Getenv("POSTGRES_USER")
	POSTGRES_PASSWORD := os.Getenv("POSTGRES_PASSWORD")
	POSTGRES_HOST := os.Getenv("POSTGRES_HOST")
	POSTGRES_DATABASE := os.Getenv("POSTGRES_DATABASE")

	//DB接続
	src := fmt.Sprintf("host=%s port=5432 user=%s password=%s dbname=%s sslmode=disable", POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE)
	db, err := sql.Open("postgres", src)
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	router := chi.NewRouter()

	//middleware
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	router.Use(cors.Handler)

	// games
	router.Route("/v1/games", func(r chi.Router) {
		r.Post("/", insertGame(db))
		r.Get("/oldest", getOldestGameAPI(db))
	})

	// categories
	router.Route("/v1/categories", func(r chi.Router) {
		r.Post("/", insertCategory(db))
	})

	// records
	router.Route("/v1/records", func(r chi.Router) {
		r.Get("/", fetchCategories(db))
	})

	// players
	router.Route("/v1/players", func(r chi.Router) {
		r.Post("/", insertPlayer(db))
	})

	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal("ListenAndServe failed.", err)
	}
}

// Game :
type Game struct {
	GameID          string `json:"game_id"`
	GameTitle       string `json:"game_title"`
	ActivePlayerNum int    `json:"active_player_num"`
	LastUpdated     string `json:"last_updated"`
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

// FetchedCategory :
type FetchedCategory struct {
	CategoryID        string   `json:"category_id"`
	PrimaryCategoryID string   `json:"primary_category_id"`
	Game              Game     `json:"game"`
	CategoryName      string   `json:"category_name"`
	SubcategoryName   string   `json:"subcategory_name"`
	BestPlayers       []Player `json:"best_players"`
	BestTime          string   `json:"best_time"`
	BestDate          string   `json:"best_date"`
	BestVideoLink     string   `json:"best_video_link"`
	BestComment       string   `json:"best_comment"`
	LastUpdated       string   `json:"last_updated"`
}

func insertGame(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//リクエストを受け取る
		var game Game
		json.NewDecoder(r.Body).Decode(&game)

		if game.GameID == "" {
			fmt.Fprintf(w, "%s\n", "illegal json!")
			return
		}

		currentTime := time.Now()

		// Gameテーブルに新規レコードを追加
		_, err := db.Exec(`INSERT INTO games VALUES($1, $2, $3, $4)`, game.GameID, game.GameTitle, game.ActivePlayerNum, currentTime)
		if err != nil {
			fmt.Fprintf(w, "%s\n", "game_id already exists.")
			panic(err.Error())
		}
		// res := getGameIDByGameTitle(game.GameTitle, db, w)
		defer Response(game, w)
	}
}

func insertCategory(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//リクエストを受け取る
		var category Category
		json.NewDecoder(r.Body).Decode(&category)
		if category.PrimaryCategoryID == "" {
			fmt.Fprintf(w, "%s\n", "illegal json!")
			return
		}

		//verify
		var categoryID *string
		if category.SubcategoryName == "" {
			categoryID = getCategoryIDByPrimaryCategory(category.PrimaryCategoryID, db)
		} else {
			categoryID = getCategoryIDByPrimaryCategoryAndSubCategory(category.PrimaryCategoryID, category.SubcategoryName, db)
		}
		if categoryID != nil {
			fmt.Fprintf(w, "%s\n", "category_id already exists.")
			return
		}

		currentTime := time.Now()
		// Categoriesテーブルに新規レコードを追加
		_, err := db.Exec(`INSERT INTO categories(primary_category_id, game_id, category_name, subcategory_name, best_players_id, best_time, best_date, best_video_link, best_comment, last_updated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			category.PrimaryCategoryID,
			category.GameID,
			category.CategoryName,
			category.SubcategoryName,
			pq.Array(category.BestPlayersID),
			category.BestTime,
			category.BestDate,
			category.BestVideoLink,
			category.BestComment,
			currentTime)

		if err != nil {
			fmt.Println(err)
			panic(err.Error())
		}
		//gamesテーブルのlast_updatedを更新する
		updateGameLastUpdated(category.GameID, db)
		// res := getGameIDByGameTitle(game.GameTitle, db, w)
		defer Response(category, w)
	}
}

func fetchCategories(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		offset, err := strconv.Atoi(r.FormValue("offset"))
		if err != nil {
			fmt.Fprintf(w, "offset must be int!")
			return
		}
		size, err := strconv.Atoi(r.FormValue("size"))
		if err != nil {
			fmt.Fprintf(w, "size must be int!")
			return
		}

		fetchedCategories, err := getCategoriesOrderByBestDate(size, offset, db, w)
		if err != nil {
			fmt.Fprintf(w, "SQL Error!")
			fmt.Println(err)
			panic(err.Error)
		}
		defer Response(fetchedCategories, w)
	}
}

func insertPlayer(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//リクエストを受け取る
		var player Player
		json.NewDecoder(r.Body).Decode(&player)
		if player.PlayerID == "" {
			fmt.Fprintf(w, "%s\n", "illegal json!")
			return
		}

		// playersテーブルに新規レコードを追加
		_, err := db.Exec(`INSERT INTO players VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
			player.PlayerID,
			player.PlayerName,
			player.CountryName,
			player.Twitch,
			player.Hitbox,
			player.Youtube,
			player.Twitter,
			player.Speedrunslive,
			strconv.FormatBool(player.IsGuest))

		if err != nil {
			fmt.Println(err)
			fmt.Fprintf(w, "%s\n", "player_id already exists.")
			// panic(err.Error())
		}
		defer Response(player, w)
	}
}

func updateGameLastUpdated(gameID string, db *sql.DB) {
	currentTime := time.Now()
	_, err := db.Exec(`UPDATE games SET last_updated = $1 WHERE game_id = $2`, currentTime, gameID)
	if err != nil {
		fmt.Println(err)
		panic(err.Error())
	}
}

func getOldestGameAPI(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		oldestGame, err := getOldestGame(db, w)
		if err != nil {
			fmt.Println(err)
			fmt.Fprintf(w, "%s\n", "game_id does not exists.")
			return
		}
		//gamesテーブルのlast_updatedを更新する
		updateGameLastUpdated(oldestGame.GameID, db)
		defer Response(*oldestGame, w)
	}
}

func getGameIDByGameTitle(gameTitle string, db *sql.DB, w http.ResponseWriter) string {
	query := db.QueryRow(`SELECT game_id FROM games WHERE game_title = ?`, gameTitle)
	var gameID string
	err := query.Scan(&gameID)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Fprintf(w, "%s", "game_id does not exist.")
		}
		panic(err.Error)
	}
	return gameID
}

func getCategoryIDByPrimaryCategory(primaryCategoryID string, db *sql.DB) *string {
	queryStr := fmt.Sprintf("SELECT category_id FROM categories WHERE primary_category_id = '%s'", primaryCategoryID)
	fmt.Println("query: " + queryStr)
	query := db.QueryRow(queryStr)
	var categoryID string
	err := query.Scan(&categoryID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		fmt.Println(err)
		panic(err.Error)
	}
	return &categoryID
}

func getCategoryIDByPrimaryCategoryAndSubCategory(primaryCategoryID string, subcategoryName string, db *sql.DB) *string {
	queryStr := fmt.Sprintf("SELECT category_id FROM categories WHERE primary_category_id = '%s' AND subcategory_name = '%s'", primaryCategoryID, subcategoryName)
	fmt.Println("query: " + queryStr)
	query := db.QueryRow(queryStr)
	var categoryID string
	err := query.Scan(&categoryID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		fmt.Println(err)
		panic(err.Error)
	}
	return &categoryID
}

func getOldestGame(db *sql.DB, w http.ResponseWriter) (*Game, error) {
	query := db.QueryRow(`SELECT * FROM games ORDER BY last_updated ASC LIMIT 1`)
	var game Game
	err := query.Scan(&game.GameID, &game.GameTitle, &game.ActivePlayerNum, &game.LastUpdated)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Fprintf(w, "%s", "game_id does not exist.")
		}
		return nil, err
	}
	return &game, nil
}

func getGameByGameID(gameID string, db *sql.DB) (*Game, error) {
	queryStr := fmt.Sprintf("SELECT * FROM games WHERE game_id = '%s'", gameID)
	query := db.QueryRow(queryStr)
	var game Game
	err := query.Scan(&game.GameID, &game.GameTitle, &game.ActivePlayerNum, &game.LastUpdated)
	if err != nil {
		return nil, err
	}
	return &game, nil
}

func getPlayerByPlayerID(playerID string, db *sql.DB) (*Player, error) {
	queryStr := fmt.Sprintf("SELECT * FROM players WHERE player_id = '%s'", playerID)
	query := db.QueryRow(queryStr)
	var player Player
	err := query.Scan(&player.PlayerID,
		&player.PlayerName,
		&player.CountryName,
		&player.Twitch,
		&player.Hitbox,
		&player.Youtube,
		&player.Twitter,
		&player.Speedrunslive,
		&player.IsGuest)
	if err != nil {
		return nil, err
	}
	return &player, nil
}

func getCategoriesOrderByBestDate(size int, offset int, db *sql.DB, w http.ResponseWriter) ([]FetchedCategory, error) {
	queryStr := fmt.Sprintf("SELECT * FROM categories ORDER BY best_date DESC OFFSET %d LIMIT %d", offset, size)
	rows, err := db.Query(queryStr)
	if err != nil {
		return nil, err
	}
	ret := []FetchedCategory{}
	for rows.Next() {
		fc := FetchedCategory{}
		gameID := ""
		bestPlayersID := []string{}
		err := rows.Scan(&fc.CategoryID,
			&fc.PrimaryCategoryID,
			&gameID,
			&fc.CategoryName,
			&fc.SubcategoryName,
			pq.Array(&bestPlayersID),
			&fc.BestTime,
			&fc.BestDate,
			&fc.BestVideoLink,
			&fc.BestComment,
			&fc.LastUpdated)
		if err != nil {
			// panic(err.Error)
			return nil, err
		}

		game, err := getGameByGameID(gameID, db)
		if err != nil {
			// panic(err.Error)
			return nil, err
		}

		bestPlayers := []Player{}
		for _, playerID := range bestPlayersID {
			player, err := getPlayerByPlayerID(playerID, db)
			if err != nil {
				// panic(err.Error)
				return nil, err
			}
			bestPlayers = append(bestPlayers, *player)
		}
		fc.Game = *game
		fc.BestPlayers = bestPlayers
		ret = append(ret, fc)
	}

	return ret, nil
}

// Response : 構造体resの内容をjsonにしてレスポンス
func Response(res interface{}, w http.ResponseWriter) {
	outjson, err := json.Marshal(res)
	if err != nil {
		panic(err.Error())
	}
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprint(w, string(outjson))
}

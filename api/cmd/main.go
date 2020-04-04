package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"

	"github.com/go-chi/chi"
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
	})

	// categories
	router.Route("/v1/categories", func(r chi.Router) {
		r.Post("/", insertCategory(db))
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
}

// Category :
type Category struct {
	CategoryID      string `json:"category_id"`
	GameID          string `json:"game_id"`
	CategoryName    string `json:"category_name"`
	SubcategoryName string `json:"subcategory_name"`
	CategoryURL     string `json:"category_url"`
	BestPlayerName  string `json:"best_player_name"`
	BestTime        string `json:"best_time"`
	BestDate        string `json:"best_date"`
	BestVideoLink   string `json:"best_video_link"`
}

func insertGame(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//リクエストを受け取る
		var game Game
		json.NewDecoder(r.Body).Decode(&game)

		// Gameテーブルに新規レコードを追加
		_, err := db.Exec(`INSERT INTO games VALUES($1, $2, $3)`, game.GameID, game.GameTitle, game.ActivePlayerNum)
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

		// Categoriesテーブルに新規レコードを追加
		_, err := db.Exec(`INSERT INTO categories VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, category.CategoryID, category.GameID, category.CategoryName, category.SubcategoryName, category.CategoryURL, category.BestPlayerName, category.BestTime, category.BestDate, category.BestVideoLink)
		if err != nil {
			fmt.Fprintf(w, "%s\n", "category_id already exists.")
			panic(err.Error())
		}
		// res := getGameIDByGameTitle(game.GameTitle, db, w)
		defer Response(category, w)
	}
}

func getGameIDByGameTitle(gameTitle string, db *sql.DB, w http.ResponseWriter) string {
	query := db.QueryRow(`SELECT game_id FROM games WHERE game_title = ?`, gameTitle)
	var gameID string
	err := query.Scan(&gameID)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Fprintf(w, "%s\n", "game_id does not exist.")
		}
		panic(err.Error)
	}
	return gameID
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

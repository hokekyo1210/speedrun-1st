DROP TABLE IF EXISTS games;

CREATE TABLE games (
    game_id             CHAR(8)   NOT NULL,
    game_title          TEXT      NOT NULL,
    active_player_num   INTEGER   DEFAULT 0,
    last_updated        TIMESTAMP NOT NULL,
    PRIMARY KEY (game_id)
);

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    category_id         SERIAL      NOT NULL,
    primary_category_id CHAR(8)     NOT NULL,
    game_id             CHAR(8)     NOT NULL,
    category_name       TEXT        NOT NULL,
    subcategory_name    TEXT                ,
    best_players_id    TEXT[]        NOT NULL,
    best_time           DECIMAL     NOT NULL,
    best_date           TIMESTAMP   NOT NULL,
    best_video_link     TEXT        NOT NULL,
    best_comment        TEXT                ,
    last_updated        TIMESTAMP   NOT NULL,
    PRIMARY KEY (category_id)
);

DROP TABLE IF EXISTS players;

CREATE TABLE players (
    player_id         TEXT      NOT NULL,
    player_name      TEXT     NOT NULL,
    country_name    TEXT            ,
    twitch          TEXT            ,
    hitbox          TEXT            ,
    youtube         TEXT            ,
    twitter         TEXT            ,
    speedrunslive   TEXT            ,
    is_guest        BOOLEAN     DEFAULT FALSE,
    PRIMARY KEY (player_id)
);
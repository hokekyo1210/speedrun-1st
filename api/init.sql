DROP TABLE IF EXISTS games;

CREATE TABLE games (
    game_id             CHAR(8)   NOT NULL,
    game_title          TEXT      NOT NULL,
    active_player_num   INTEGER   DEFAULT 0,
    PRIMARY KEY (game_id)
);

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    category_id         CHAR(8)     NOT NULL,
    game_id             CHAR(8)     NOT NULL,
    category_name       TEXT        NOT NULL,
    subcategory_name    TEXT                ,
    category_url        TEXT        NOT NULL,
    best_player_name    TEXT        NOT NULL,
    best_time           TEXT        NOT NULL,
    best_date           TIMESTAMP   NOT NULL,
    best_video_link     TEXT        NOT NULL,
    PRIMARY KEY (category_id)
)
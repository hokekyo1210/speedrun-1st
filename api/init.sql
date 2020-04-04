DROP TABLE IF EXISTS games;

CREATE TABLE games (
    game_id             CHAR(8)   NOT NULL,
    game_title          TEXT      NOT NULL,
    active_player_num   INTEGER   DEFAULT 0,
    PRIMARY KEY (game_id)
);
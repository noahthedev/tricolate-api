CREATE TABLE recipes (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  abstract TEXT,
  coffee INTEGER NOT NULL,
  grind TEXT,
  water INTEGER NOT NULL,
  method TEXT NOT NULL,
  link TEXT
);
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES
('Dan Abramov', 'https://overreacted.io/writing-resilient-components/', 'Writing Resilient Components', 0),
('Martin Fowler', 'https://martinfowler.com/articles/is-quality-worth-cost.html', 'Is High Quality Software Worth the Cost?', 0),
('Robert C. Martin', 'https://blog.cleancoder.com/uncle-bob/2017/03/16/FPvsOO-List-processing.html', 'FP vs. OO List Processing', 0);

const { Client } = require('pg');

const client = new Client({
  user: 'user',
  host: 'localhost',
  database: 'blogdb',
  password: 'password',
  port: 5432,
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT * FROM blogs');

  res.rows.forEach(blog => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
  });

  await client.end();
}

main();

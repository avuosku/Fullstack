const dummy = (blogs) => {
  return 1; // Yksinkertainen dummy-funktio, joka palauttaa aina 1
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0; // Palautetaan 0, jos blogilista on tyhjä
  return blogs.reduce((sum, blog) => sum + blog.likes, 0); // Lasketaan tykkäykset
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null; // Palautetaan null, jos ei ole blogeja
  return blogs.reduce((prev, current) => {
    if (typeof prev.likes !== 'number' || typeof current.likes !== 'number') {
      throw new Error('Invalid data: likes should be a number');
    }
    return prev.likes > current.likes ? prev : current;
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null; // Jos blogilista on tyhjä, palautetaan null
  
  const authorStats = blogs.reduce((acc, blog) => {
    const { author } = blog;
    if (author) {
      acc[author] = (acc[author] || 0) + 1; // Lasketaan blogien määrä kirjoittajalle
    }
    return acc;
  }, {});

  const topAuthor = Object.entries(authorStats).reduce((max, [author, blogsCount]) => {
    if (blogsCount > max.blogs) {
      return { author, blogs: blogsCount };
    }
    return max;
  }, { author: '', blogs: 0 });

  return topAuthor; // Palautetaan kirjoittaja, jolla on eniten blogeja
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null; // Jos blogilista on tyhjä, palautetaan null

  const likeCounts = blogs.reduce((acc, blog) => {
    if (!blog.author || typeof blog.likes !== 'number') {
      throw new Error('Invalid blog data'); // Tarkistetaan, että tykkäykset ovat lukuja
    }
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes; // Lasketaan tykkäykset kirjoittajalle
    return acc;
  }, {});

  const authorWithMostLikes = Object.keys(likeCounts).reduce((a, b) =>
    likeCounts[a] > likeCounts[b] ? a : b
  );

  return {
    author: authorWithMostLikes,
    likes: likeCounts[authorWithMostLikes],
  }; // Palautetaan kirjoittaja, jolla on eniten tykkäyksiä
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

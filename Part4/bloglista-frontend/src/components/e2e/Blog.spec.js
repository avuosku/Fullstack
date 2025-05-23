import { test, expect, request } from '@playwright/test';
import {webkit , chromium, firefox} from 'playwright';

test.beforeEach(async ({ page, request }) => {
  // Nollaa backendin tila (poistaa käyttäjät ja blogit)
  const resetResponse = await request.post('http://localhost:3001/api/testing/reset');

  // Lisää uusi käyttäjä
  const userResponse = await request.post('http://localhost:3001/api/users', {
    data: {
      name: 'Arttu',
      username: 'root',
      password: 'sekret',
      email: 'arttu.vuosku@gmail.com'
    }
  });
  // Mene etusivulle
  await page.goto('http://localhost:5173');
});

test('Login form is shown', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /blogs/i })).toBeVisible();
});

test.describe('Login', () => {
  test('succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: "username" }).fill('root');
    await page.getByRole('textbox', { name: "password" }).fill('sekret');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:5173');
  });

  test('fails with wrong credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: "username" }).fill('wronguser');
    await page.getByRole('textbox', { name: "password" }).fill('wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Wrong credentials')).toBeVisible();
  });
});

test.describe('When logged in', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole('textbox', { name: "username" }).fill('root');
    await page.getByRole('textbox', { name: "password" }).fill('sekret');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:5173');
  });

  test('a new blog can be created', async ({ page }) => {
    await page.click('button:has-text("New Blog")');
    await page.fill('input[name="title"]', 'Playwright Test Blog');
    await page.fill('input[name="author"]', 'Test User');
    await page.fill('input[name="url"]', 'https://example.com');
    await page.click('button:has-text("Save")');

    await expect(
      page.getByRole('heading', { name: 'Playwright Test Blog by Test User' }).first()
    ).toBeVisible();
  });

  test('a blog can be liked', async ({ page }) => {
    const uniqueTitle = `Like Test Blog ${Date.now()}`;

    // Luo blogi
    await page.click('button:has-text("New Blog")');
    await page.fill('input[name="title"]', uniqueTitle);
    await page.fill('input[name="author"]', 'Test User');
    await page.fill('input[name="url"]', 'https://example.com');
    await page.click('button:has-text("Save")');

    // Odotetaan, että blogi ilmestyy näkyviin
    const blogHeading = page.getByRole('heading', { name: `${uniqueTitle} by Test User` });
    await blogHeading.waitFor({ state: 'visible', timeout: 5000 });

    // Etsi blogin yksityiskohtanäkymä
    const blogContainer = blogHeading.locator('..');
    const viewButton = blogContainer.locator('button:has-text("view")');

    // Odotetaan, että "view"-painike on näkyvissä ja klikkaa sitä
    await expect(viewButton).toBeVisible();
    await viewButton.click();

    // Varmista, että blogin yksityiskohtasivun elementit näkyvät
    const blogDetails = page.locator(`h2:has-text("${uniqueTitle}")`);
    await expect(blogDetails).toBeVisible();

    // Klikkaa "Like"-painiketta
    await page.click('button:has-text("Like")');
    const blogText = blogContainer.locator('..');
    // Varmista, että tykkäykset päivittyvät
    await expect(blogText).toHaveText(/1 likes/);
  });

  test('the user who created a blog can delete it', async ({ page }) => {
    const uniqueTitle = `Delete Test Blog ${Date.now()}`;
  
    // Lisää blogi
    await page.click('button:has-text("New Blog")');
    await page.fill('input[name="title"]', uniqueTitle);
    await page.fill('input[name="author"]', 'Test User');
    await page.fill('input[name="url"]', 'https://example.com');
    await page.click('button:has-text("Save")');

    const blogHeading = page.getByRole('heading', { name: `${uniqueTitle} by Test User` });
    await blogHeading.waitFor({ state: 'visible' });
  
    const blogContainer = blogHeading.locator('..');
    const viewButton = blogContainer.locator('button:has-text("view")');
    await viewButton.click();

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await page.click('button:has-text("Remove")');

    // Varmista, että blogia ei enää näy
    await expect(page.locator(`text=${uniqueTitle}`)).toHaveCount(0);
  });

  test('only the creator of a blog sees the delete button', async ({ page, request }) => {
    // Lisää käyttäjä2 (mluukkai)
    const user2Response = await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        email: 'mluukkai@gmail.com',
        password: 'salainen'
      }
    });
    if (!user2Response.ok()) {
      throw new Error('Failed to create user: Matti Luukkainen');
    }

    const uniqueTitle = `Own blog ${Date.now()}`;
  
    // Kirjaudu sisään käyttäjänä user1
    /*
    await page.getByLabel('Username').fill('root');
    await page.getByLabel('Password').fill('sekret');
    await page.getByRole('button', { name: 'Login' }).click();
  */
    // Luo blogi
    await page.click('button:has-text("New Blog")');
    await page.fill('input[name="title"]', uniqueTitle);
    await page.fill('input[name="author"]', 'Test User');
    await page.fill('input[name="url"]', 'https://example.com');
    await page.click('button:has-text("Save")');
    //await page.waitForTimeout(5000);
    await expect(
      page.getByRole('heading', { name: uniqueTitle }).first()
    ).toBeVisible();

    // Kirjaudu ulos
    //await page.getByRole('button', { name: 'Logout' }).click();
    
    const browser = await webkit.launch();
    const context = await browser.newContext();
    const newpage = await context.newPage();
    await newpage.goto('http://localhost:5173');
    // Kirjaudu toisella käyttäjällä
    await newpage.getByLabel('Username').fill('mluukkai');
    await newpage.getByLabel('Password').fill('salainen');
    await newpage.getByRole('button', { name: 'Login' }).click();
    //await newpage.waitForTimeout(3000);
    const blogHeading = newpage.getByRole('heading', { name: `${uniqueTitle} by Test User` });
    await blogHeading.waitFor({ state: 'visible' });
  
    // Varmista, että blogi näkyy ja "view" nappi on näkyvissä
    //const blogHeading = newpage.locator('h1', { hasText: `${uniqueTitle} by Test User` });
    //await blogHeading.waitFor();  // Odota, että otsikko tulee näkyviin
  
    const blogContainer = blogHeading.locator('..');
    const viewButton = blogContainer.locator('button:has-text("view")');
    await viewButton.waitFor();  // Odota, että "view"-nappi on näkyvissä
    await viewButton.click();
  
    // Varmista, ettei "Remove"-nappia näy
    const removeButton = blogContainer.locator('button:has-text("Remove")');
    await expect(removeButton).toHaveCount(0); // Ei "Remove"-nappia
  });
    /*
    // Kirjaudu toisella käyttäjällä
    await page.getByLabel('Username').fill('mluukkai');
    await page.getByLabel('Password').fill('salainen');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(3000);
    // Varmista, että blogi näkyy ja "view" nappi on näkyvissä
    const blogHeading = page.locator('h1', { hasText: `${uniqueTitle} by Test User` });
    await blogHeading.waitFor();  // Odota, että otsikko tulee näkyviin
  
    const blogContainer = blogHeading.locator('..');
    const viewButton = blogContainer.locator('button:has-text("view")');
    await viewButton.waitFor();  // Odota, että "view"-nappi on näkyvissä
    await viewButton.click();
  
    // Varmista, ettei "Remove"-nappia näy
    const removeButton = blogContainer.locator('button:has-text("Remove")');
    await expect(removeButton).toHaveCount(0); // Ei "Remove"-nappia
  });*/
  

  test('blogs are ordered by number of likes, descending', async ({ page }) => {
    const timestamp = Date.now();
    const blogs = [
      { title: `Least Likes ${timestamp}`, likes: 1 },   
      { title: `Second Most ${timestamp}`, likes: 2 },
      { title: `Most Likes ${timestamp}`, likes: 3 }
    ];
  
    // Luo blogit
    for (const blog of blogs) {
      await page.click('button:has-text("New Blog")');
      await page.fill('input[name="title"]', blog.title);
      await page.fill('input[name="author"]', 'Test User');
      await page.fill('input[name="url"]', 'https://example.com');
      await page.click('button:has-text("Save")');
      await expect(page.getByText(`${blog.title} by Test User`)).toBeVisible();
    }
  
    // Lisää tykkäyksiä
    for (const blog of blogs) {
      // Odotetaan, että blogi ilmestyy näkyviin
      const blogHeading = page.getByRole('heading', { name: `${blog.title} by Test User` });
      await blogHeading.waitFor({ state: 'visible', timeout: 5000 });

      // Etsi blogin yksityiskohtanäkymä
      const blogContainer = blogHeading.locator('..');
      const viewButton = blogContainer.locator('button:has-text("view")');

      // Odotetaan, että "view"-painike on näkyvissä ja klikkaa sitä
      await expect(viewButton).toBeVisible();
      await viewButton.click();

      // Varmista, että blogin yksityiskohtasivun elementit näkyvät
      //const blogDetails = page.locator(`h2:has-text("${blog.title}")`);
      //await expect(blogDetails).toBeVisible();
      const likeButton = blogContainer.locator('button:has-text("Like")');
      //await expect(likeButton).toBeVisible(); 
    
      for (let i = 0; i < blog.likes; i++) {
        // Klikkaa "Like"-painiketta
        await page.click('button:has-text("Like")');
        //await likeButton.click();
      }
      await page.click('button:has-text("hide")');
    }
/*
      const blogContainer = page.locator('.blog').filter({ hasText: blog.title });
    
      // Odotetaan varmuuden vuoksi näkyvyyttä
      await expect(blogContainer).toBeVisible();
    
      // Käytetään tekstihakuun perustuvaa lokatoria
      const viewButton = blogContainer.locator('button', { hasText: 'view' });
      await viewButton.waitFor();  // Odota, että "view"-nappi on näkyvissä
      await viewButton.first().click();
    
      const likeButton = blogContainer.locator('button', { hasText: 'like' });
      await expect(likeButton).toBeVisible();
   
        for (let i = 0; i < blog.likes; i++) {
        await likeButton.click();
        await page.waitForTimeout(300);
      }
    }*/
    // Pieni tauko, jotta tykkäykset ehtivät näkyä
    await page.waitForTimeout(1000);
    await page.reload();
    await page.getByRole('textbox', { name: "username" }).fill('root');
    await page.getByRole('textbox', { name: "password" }).fill('sekret');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:5173');
    const blogHeading = page.getByRole('heading', { name: `${blogs[0].title} by Test User`});
    await blogHeading.waitFor({ state: 'visible' });
  
    
    // Ota blogit talteen ja järjestä ne näkyvän järjestyksen mukaan
    /*
    const visibleTitles = await page.locator('.blog').evaluateAll((elements) =>
      elements.map((el) => el.querySelector('h2')?.innerText)
    );*/
    const visibleTitles = await page.$$eval('h2', elements => elements.map(el => el.textContent));
    console.log(visibleTitles);
    expect(visibleTitles).toEqual([
      `${blogs[2].title} by Test User`,
      `${blogs[1].title} by Test User`,
      `${blogs[0].title} by Test User`
    ]);
  });
  
  
  
});

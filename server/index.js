const express = require('express');
const cors = require('cors');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});


app.use(cors());

app.use(express.json());

// Get all blog posts
app.get('/api/posts', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    const posts = response.results.map(page => ({
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || '',
      date: page.last_edited_time || '',
      description: page.properties.Description?.rich_text[0]?.plain_text || '',
      slug: page.properties.Slug?.rich_text[0]?.plain_text || page.id,
    }));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog post
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await notion.pages.retrieve({ page_id: slug });
    const blocks = await notion.blocks.children.list({ block_id: page.id });

    res.json({
      page,
      blocks: blocks.results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
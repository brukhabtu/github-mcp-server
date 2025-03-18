const express = require('express');
const { Octokit } = require('@octokit/rest');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// API Routes

// Get all repositories for authenticated user
app.get('/api/repos', async (req, res) => {
  try {
    const { data } = await octokit.repos.listForAuthenticatedUser();
    res.json(data);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get issues for a repository (serves as tasks for a project)
app.get('/api/repos/:owner/:repo/issues', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'all', labels } = req.query;
    
    const params = {
      owner,
      repo,
      state,
      per_page: 100
    };
    
    if (labels) params.labels = labels;
    
    const { data } = await octokit.issues.listForRepo(params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new issue (task)
app.post('/api/repos/:owner/:repo/issues', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { title, body, labels, assignees } = req.body;
    
    const { data } = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      assignees
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update an issue (task)
app.patch('/api/repos/:owner/:repo/issues/:issue_number', async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.params;
    const { title, body, state, labels, assignees } = req.body;
    
    const { data } = await octokit.issues.update({
      owner,
      repo,
      issue_number: parseInt(issue_number),
      title,
      body,
      state,
      labels,
      assignees
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a comment to an issue
app.post('/api/repos/:owner/:repo/issues/:issue_number/comments', async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.params;
    const { body } = req.body;
    
    const { data } = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: parseInt(issue_number),
      body
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all labels for a repository
app.get('/api/repos/:owner/:repo/labels', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    const { data } = await octokit.issues.listLabelsForRepo({
      owner,
      repo
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching labels:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new label
app.post('/api/repos/:owner/:repo/labels', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { name, color, description } = req.body;
    
    const { data } = await octokit.issues.createLabel({
      owner,
      repo,
      name,
      color,
      description
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error creating label:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all milestone for a repository
app.get('/api/repos/:owner/:repo/milestones', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'open' } = req.query;
    
    const { data } = await octokit.issues.listMilestones({
      owner,
      repo,
      state
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all users who have access to the repository
app.get('/api/repos/:owner/:repo/collaborators', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    const { data } = await octokit.repos.listCollaborators({
      owner,
      repo
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve the main app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`GitHub MCP Server running on port ${PORT}`);
});
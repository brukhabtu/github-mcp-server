# GitHub MCP Server

A Management Control Panel (MCP) server for managing GitHub projects through the GitHub Issues API. This server provides a simple way to manage your GitHub projects, tasks, and team collaboration without needing to use GitHub's Projects feature directly.

## Features

- View all your repositories
- Create, update, and track issues (tasks) across repositories
- Assign issues to team members
- Add comments to issues
- Create and manage labels to categorize tasks
- View repository milestones
- See repository collaborators

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- GitHub Personal Access Token with `repo` scope

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/brukhabtu/github-mcp-server.git
   cd github-mcp-server
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on the example:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file and add your GitHub Personal Access Token:
   ```
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```

   You can generate a token at [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens).
   Make sure to give it the `repo` scope to access private repositories.

5. Start the server:
   ```
   npm start
   # or
   yarn start
   ```

   For development with automatic restart:
   ```
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to access the MCP interface.

## API Endpoints

The server provides the following API endpoints:

### Repositories

- `GET /api/repos` - Get all repositories for the authenticated user

### Issues (Tasks)

- `GET /api/repos/:owner/:repo/issues` - Get all issues for a repository
- `POST /api/repos/:owner/:repo/issues` - Create a new issue
- `PATCH /api/repos/:owner/:repo/issues/:issue_number` - Update an issue
- `POST /api/repos/:owner/:repo/issues/:issue_number/comments` - Add a comment to an issue

### Labels

- `GET /api/repos/:owner/:repo/labels` - Get all labels for a repository
- `POST /api/repos/:owner/:repo/labels` - Create a new label

### Milestones

- `GET /api/repos/:owner/:repo/milestones` - Get all milestones for a repository

### Collaborators

- `GET /api/repos/:owner/:repo/collaborators` - Get all collaborators for a repository

## Frontend Development

To enhance the MCP with a custom frontend, add your HTML, CSS, and JavaScript files to the `public` directory. The server serves static files from this directory.

## Customization

You can customize the server by:

1. Adding more API endpoints in `server.js`
2. Creating a more advanced frontend in the `public` directory
3. Implementing authentication for multi-user access
4. Adding database support for storing project metadata

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

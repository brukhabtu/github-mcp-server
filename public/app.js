// Global state
const state = {
    currentRepo: null,
    currentOwner: null,
    currentIssue: null,
    repositories: [],
    issues: [],
    labels: [],
    collaborators: []
};

// DOM Elements
const elements = {
    reposList: document.getElementById('reposList'),
    reposLink: document.getElementById('reposLink'),
    mainContent: document.getElementById('mainContent'),
    repoContent: document.getElementById('repoContent'),
    repoTitle: document.getElementById('repoTitle'),
    dashboardCards: document.getElementById('dashboardCards'),
    issuesTable: document.getElementById('issuesTable'),
    searchIssues: document.getElementById('searchIssues'),
    searchBtn: document.getElementById('searchBtn'),
    filterState: document.getElementById('filterState'),
    filterLabels: document.getElementById('filterLabels'),
    newIssueBtn: document.getElementById('newIssueBtn'),
    issueModal: new bootstrap.Modal(document.getElementById('issueModal')),
    issueModalTitle: document.getElementById('issueModalTitle'),
    issueForm: document.getElementById('issueForm'),
    issueId: document.getElementById('issueId'),
    issueTitle: document.getElementById('issueTitle'),
    issueBody: document.getElementById('issueBody'),
    issueLabels: document.getElementById('issueLabels'),
    issueAssignees: document.getElementById('issueAssignees'),
    saveIssueBtn: document.getElementById('saveIssueBtn'),
    issueDetailModal: new bootstrap.Modal(document.getElementById('issueDetailModal')),
    issueDetailTitle: document.getElementById('issueDetailTitle'),
    detailStatus: document.getElementById('detailStatus'),
    detailCreated: document.getElementById('detailCreated'),
    detailUpdated: document.getElementById('detailUpdated'),
    detailAssignees: document.getElementById('detailAssignees'),
    detailLabels: document.getElementById('detailLabels'),
    detailBody: document.getElementById('detailBody'),
    editIssueBtn: document.getElementById('editIssueBtn'),
    toggleStateBtn: document.getElementById('toggleStateBtn'),
    commentsList: document.getElementById('commentsList'),
    commentForm: document.getElementById('commentForm'),
    commentBody: document.getElementById('commentBody')
};

// API helpers
const api = {
    async fetchRepositories() {
        try {
            const response = await fetch('/api/repos');
            if (!response.ok) throw new Error('Failed to fetch repositories');
            const data = await response.json();
            state.repositories = data;
            return data;
        } catch (error) {
            console.error('Error fetching repositories:', error);
            showError('Failed to load repositories. Please check your GitHub token.');
            return [];
        }
    },

    async fetchIssues(owner, repo, filters = {}) {
        try {
            let url = `/api/repos/${owner}/${repo}/issues`;
            
            // Add query parameters for filtering
            const params = new URLSearchParams();
            if (filters.state) params.append('state', filters.state);
            if (filters.labels) params.append('labels', filters.labels);
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch issues');
            const data = await response.json();
            state.issues = data;
            return data;
        } catch (error) {
            console.error('Error fetching issues:', error);
            showError('Failed to load issues. Please try again.');
            return [];
        }
    },

    async fetchLabels(owner, repo) {
        try {
            const response = await fetch(`/api/repos/${owner}/${repo}/labels`);
            if (!response.ok) throw new Error('Failed to fetch labels');
            const data = await response.json();
            state.labels = data;
            return data;
        } catch (error) {
            console.error('Error fetching labels:', error);
            return [];
        }
    },

    async fetchCollaborators(owner, repo) {
        try {
            const response = await fetch(`/api/repos/${owner}/${repo}/collaborators`);
            if (!response.ok) throw new Error('Failed to fetch collaborators');
            const data = await response.json();
            state.collaborators = data;
            return data;
        } catch (error) {
            console.error('Error fetching collaborators:', error);
            return [];
        }
    },

    async createIssue(owner, repo, data) {
        try {
            const response = await fetch(`/api/repos/${owner}/${repo}/issues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create issue');
            return await response.json();
        } catch (error) {
            console.error('Error creating issue:', error);
            showError('Failed to create issue. Please try again.');
            return null;
        }
    },

    async updateIssue(owner, repo, issueNumber, data) {
        try {
            const response = await fetch(`/api/repos/${owner}/${repo}/issues/${issueNumber}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update issue');
            return await response.json();
        } catch (error) {
            console.error('Error updating issue:', error);
            showError('Failed to update issue. Please try again.');
            return null;
        }
    },

    async addComment(owner, repo, issueNumber, body) {
        try {
            const response = await fetch(`/api/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ body })
            });
            if (!response.ok) throw new Error('Failed to add comment');
            return await response.json();
        } catch (error) {
            console.error('Error adding comment:', error);
            showError('Failed to add comment. Please try again.');
            return null;
        }
    }
};
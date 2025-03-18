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
    },
    
    async fetchComments(owner, repo, issueNumber) {
        try {
            const response = await fetch(`/api/repos/${owner}/${repo}/issues/${issueNumber}/comments`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }
};

// UI Rendering
const ui = {
    renderRepositories(repositories) {
        elements.reposList.innerHTML = '';
        
        if (repositories.length === 0) {
            elements.reposList.innerHTML = '<li class="nav-item"><div class="repo-item">No repositories found</div></li>';
            return;
        }
        
        repositories.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.className = 'nav-item';
            repoItem.innerHTML = `
                <div class="repo-item" data-owner="${repo.owner.login}" data-repo="${repo.name}">
                    ${repo.name}
                </div>
            `;
            elements.reposList.appendChild(repoItem);
            
            // Add click event to repository item
            const repoItemDiv = repoItem.querySelector('.repo-item');
            repoItemDiv.addEventListener('click', () => {
                // Update active repository
                document.querySelectorAll('.repo-item').forEach(item => {
                    item.classList.remove('active');
                });
                repoItemDiv.classList.add('active');
                
                // Update state
                state.currentOwner = repo.owner.login;
                state.currentRepo = repo.name;
                
                // Load repository data
                loadRepositoryData(state.currentOwner, state.currentRepo);
            });
        });
    },

    renderIssues(issues) {
        elements.issuesTable.innerHTML = '';
        
        if (issues.length === 0) {
            elements.issuesTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No issues found</td>
                </tr>
            `;
            return;
        }
        
        issues.forEach(issue => {
            const row = document.createElement('tr');
            row.className = 'issue-row';
            row.dataset.issueNumber = issue.number;
            
            // Create label badges
            const labelBadges = issue.labels.map(label => {
                const style = label.color ? `background-color: #${label.color}` : '';
                return `<span class="badge" style="${style}">${label.name}</span>`;
            }).join('');
            
            // Format dates
            const createdDate = new Date(issue.created_at).toLocaleDateString();
            
            // Get assignees
            const assignees = issue.assignees.length > 0 
                ? issue.assignees.map(a => a.login).join(', ')
                : 'Unassigned';
            
            row.innerHTML = `
                <td>#${issue.number}</td>
                <td>${issue.title}</td>
                <td>${labelBadges || 'None'}</td>
                <td>${assignees}</td>
                <td><span class="badge ${issue.state === 'open' ? 'status-open' : 'status-closed'}">${issue.state}</span></td>
                <td>${createdDate}</td>
            `;
            
            elements.issuesTable.appendChild(row);
            
            // Add click event to show issue details
            row.addEventListener('click', () => {
                showIssueDetails(issue);
            });
        });
    },

    renderLabelsDropdown(labels) {
        // Clear current options except for the default one
        elements.filterLabels.innerHTML = '<option value="">All Labels</option>';
        elements.issueLabels.innerHTML = '';
        
        labels.forEach(label => {
            // Add to filter dropdown
            const filterOption = document.createElement('option');
            filterOption.value = label.name;
            filterOption.textContent = label.name;
            elements.filterLabels.appendChild(filterOption);
            
            // Add to issue form multiselect
            const labelOption = document.createElement('option');
            labelOption.value = label.name;
            labelOption.textContent = label.name;
            elements.issueLabels.appendChild(labelOption);
        });
    },

    renderCollaboratorsDropdown(collaborators) {
        elements.issueAssignees.innerHTML = '';
        
        collaborators.forEach(collaborator => {
            const option = document.createElement('option');
            option.value = collaborator.login;
            option.textContent = collaborator.login;
            elements.issueAssignees.appendChild(option);
        });
    },

    renderComments(comments) {
        elements.commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            elements.commentsList.innerHTML = '<p class="text-center">No comments yet</p>';
            return;
        }
        
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            
            const dateFormatted = new Date(comment.created_at).toLocaleString();
            
            commentDiv.innerHTML = `
                <div class="comment-header">
                    <img src="${comment.user.avatar_url}" alt="${comment.user.login}" class="avatar">
                    <div>
                        <div class="comment-author">${comment.user.login}</div>
                        <div class="comment-date">${dateFormatted}</div>
                    </div>
                </div>
                <div class="markdown-body">${marked.parse(comment.body || '')}</div>
            `;
            
            elements.commentsList.appendChild(commentDiv);
        });
    }
};

// Helper functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Add the error message to the top of the page
    document.body.insertBefore(errorDiv, document.body.firstChild);
    
    // Remove the error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

async function loadRepositoryData(owner, repo) {
    // Show repository content and hide dashboard
    elements.mainContent.style.display = 'none';
    elements.repoContent.style.display = 'block';
    
    // Update repository title
    elements.repoTitle.textContent = repo;
    
    // Fetch issues, labels, and collaborators
    const issues = await api.fetchIssues(owner, repo);
    const labels = await api.fetchLabels(owner, repo);
    const collaborators = await api.fetchCollaborators(owner, repo);
    
    // Render UI
    ui.renderIssues(issues);
    ui.renderLabelsDropdown(labels);
    ui.renderCollaboratorsDropdown(collaborators);
}

async function showIssueDetails(issue) {
    state.currentIssue = issue;
    
    // Update modal title and content
    elements.issueDetailTitle.textContent = `Issue #${issue.number}: ${issue.title}`;
    elements.detailStatus.textContent = issue.state.charAt(0).toUpperCase() + issue.state.slice(1);
    elements.detailStatus.className = issue.state === 'open' ? 'text-success' : 'text-danger';
    
    elements.detailCreated.textContent = new Date(issue.created_at).toLocaleString();
    elements.detailUpdated.textContent = new Date(issue.updated_at).toLocaleString();
    
    // Assignees
    if (issue.assignees.length > 0) {
        elements.detailAssignees.innerHTML = issue.assignees.map(a => 
            `<span>${a.login}</span>`
        ).join(', ');
    } else {
        elements.detailAssignees.textContent = 'None';
    }
    
    // Labels
    elements.detailLabels.innerHTML = '';
    if (issue.labels.length > 0) {
        issue.labels.forEach(label => {
            const badge = document.createElement('span');
            badge.className = 'badge me-1';
            badge.style.backgroundColor = `#${label.color}`;
            badge.textContent = label.name;
            elements.detailLabels.appendChild(badge);
        });
    } else {
        elements.detailLabels.textContent = 'None';
    }
    
    // Description
    elements.detailBody.innerHTML = marked.parse(issue.body || '');
    
    // Toggle button text based on issue state
    elements.toggleStateBtn.textContent = issue.state === 'open' ? 'Close Issue' : 'Reopen Issue';
    elements.toggleStateBtn.className = `btn ${issue.state === 'open' ? 'btn-outline-danger' : 'btn-outline-success'}`;
    
    // Fetch and render comments
    await fetchIssueComments(issue.number);
    
    // Show the modal
    elements.issueDetailModal.show();
}

async function fetchIssueComments(issueNumber) {
    elements.commentsList.innerHTML = `
        <div class="text-center">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            Loading comments...
        </div>
    `;
    
    try {
        const comments = await api.fetchComments(state.currentOwner, state.currentRepo, issueNumber);
        
        // Also include the issue body as a "comment" from the issue creator
        const issueAsComment = {
            body: state.currentIssue.body,
            user: state.currentIssue.user,
            created_at: state.currentIssue.created_at
        };
        
        ui.renderComments([issueAsComment, ...comments]);
    } catch (error) {
        console.error('Error fetching comments:', error);
        elements.commentsList.innerHTML = '<p class="text-danger">Failed to load comments</p>';
    }
}
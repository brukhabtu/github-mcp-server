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
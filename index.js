const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const toggleButton = document.getElementById('toggleButton');

let currentSearchType = 'user'; // Default search type

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value;
    
    if (currentSearchType === 'user') {
        await searchUsers(query);
    } else {
        await searchRepos(query);
    }
});

toggleButton.addEventListener('click', () => {
    currentSearchType = currentSearchType === 'user' ? 'repo' : 'user';
    toggleButton.innerText = currentSearchType === 'user' ? 'Search Repos' : 'Search Users';
    searchInput.placeholder = currentSearchType === 'user' ? 'Search for users' : 'Search for repos';
    resultsDiv.innerHTML = ''; // Clear results
});

async function searchUsers(query) {
    const response = await fetch(`https://api.github.com/search/users?q=${query}`);
    const data = await response.json();
    displayUsers(data.items);
}

function displayUsers(users) {
    resultsDiv.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user';
        userDiv.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" width="50">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        userDiv.addEventListener('click', () => {
            searchUserRepos(user.login);
        });
        resultsDiv.appendChild(userDiv);
    });
}

async function searchUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos = await response.json();
    displayRepos(repos, username);
}

function displayRepos(repos, username) {
    resultsDiv.innerHTML = `<h2>Repositories for ${username}</h2>`;
    repos.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.className = 'repo';
        repoDiv.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        `;
        resultsDiv.appendChild(repoDiv);
    });
}

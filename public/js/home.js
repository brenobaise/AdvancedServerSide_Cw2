// public/js/home.js
document.addEventListener("DOMContentLoaded", () => {
    const sortBySelect = document.getElementById("sortBy");
    const postList = document.getElementById("postList");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    let currentPage = 1;
    const limit = 5;

    async function loadPosts() {
        const sortBy = sortBySelect.value;
        try {
            const res = await fetch(
                `/api/posts?sortBy=${encodeURIComponent(sortBy)}&page=${currentPage}&limit=${limit}`
            );
            const json = await res.json();
            if (!json.success) {
                postList.innerHTML = `<li>${json.data}</li>`;
                return;
            }

            const posts = json.data; // array of posts
            postList.innerHTML = posts.map(p => `
          <li>
            <h3>${p.title}</h3>
            <p>
              <strong>${p.author}</strong>
              — ${new Date(p.date_posted).toLocaleDateString()}
            </p>
            <p><em>${p.country}</em></p>
            <p>👍 ${p.likes_count || 0}
              ${p.comment_count != null ? `💬 ${p.comment_count}` : ""}
            </p>
          </li>
        `).join("");

            pageInfo.textContent = `Page ${currentPage}`;
        } catch (err) {
            postList.innerHTML = `<li>Error loading posts: ${err.message}</li>`;
        }
    }

    // Initial load
    loadPosts();

    sortBySelect.addEventListener("change", () => {
        currentPage = 1;
        loadPosts();
    });
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadPosts();
        }
    });
    nextBtn.addEventListener("click", () => {
        currentPage++;
        loadPosts();
    });
});

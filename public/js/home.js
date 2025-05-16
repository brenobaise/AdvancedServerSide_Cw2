// public/js/home.js

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("homeContainer");
    const csrfToken = container.dataset.csrfToken;
    const sortBySelect = document.getElementById("sortBy");
    const postList = document.getElementById("postList");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    let currentPage = 1;
    const limit = 5;

    // Fetch and render posts
    async function loadPosts() {
        const sortBy = sortBySelect.value;
        try {
            const res = await fetch(
                `/api/posts?sortBy=${encodeURIComponent(sortBy)}&page=${currentPage}&limit=${limit}`,
                { credentials: "same-origin" }
            );
            const json = await res.json();
            if (!json.success) {
                postList.innerHTML = `<li>${json.data}</li>`;
                return;
            }

            const posts = json.data;
            postList.innerHTML = posts.map(p => `
                <li data-id="${p.id}">
                  <h3><a href="/posts/${p.id}">${p.title}</a></h3>
                  <p>
                    <strong>${p.author}</strong>
                    — ${new Date(p.date_posted).toLocaleDateString()}
                  </p>
                  <p><em>${p.country}</em></p>
                  <div class="reactions">
                    <button class="react-btn like-btn">
                      👍 <span class="likes-count">${p.likes_count || 0}</span>
                    </button>
                    <button class="react-btn dislike-btn">
                      👎 <span class="dislikes-count">${p.dislikes_count || 0}</span>
                    </button>
                    ${p.comment_count != null ? `💬 ${p.comment_count}` : ""}
                  </div>
                </li>
            `).join("");

            pageInfo.textContent = `Page ${currentPage}`;
        } catch (err) {
            postList.innerHTML = `<li>Error loading posts: ${err.message}</li>`;
        }
    }

    // Delegate click events for like/dislike
    postList.addEventListener("click", async e => {
        const likeBtn = e.target.closest(".like-btn");
        const dislikeBtn = e.target.closest(".dislike-btn");
        if (!likeBtn && !dislikeBtn) return;

        const li = e.target.closest("li[data-id]");
        const postId = li.dataset.id;
        const reaction = likeBtn ? "like" : "dislike";

        try {
            // Send reaction
            await fetch(`/api/posts/${postId}/reactions`, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "csrf-token": csrfToken,
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify({ reaction, csrfToken })
            });

            // Refresh this post’s counts
            const postRes = await fetch(`/api/posts/${postId}`, { credentials: "same-origin" });
            const postJson = await postRes.json();
            if (postJson.success) {
                li.querySelector(".likes-count").textContent = postJson.data.likes_count;
                li.querySelector(".dislikes-count").textContent = postJson.data.dislikes_count;
            }
        } catch (err) {
            console.error("Reaction failed:", err);
        }
    });

    // Sorting and pagination controls
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

    // Initial load
    loadPosts();
});

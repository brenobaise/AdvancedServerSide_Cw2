document.addEventListener("DOMContentLoaded", () => {
    const listEl = document.getElementById("profilePosts");
    const username = listEl.dataset.username;
    const userId = parseInt(listEl.dataset.userId, 10);
    const csrfToken = listEl.dataset.csrfToken;   // ← grab it here

    // Fetch all posts by this user
    async function loadMyPosts() {
        try {
            const res = await fetch(
                `/api/posts/search?filterBy=username&searchTerm=${encodeURIComponent(username)}&page=1&limit=100`,
                { credentials: "same-origin" }
            );
            const json = await res.json();
            if (!json.success) {
                listEl.innerHTML = `<li>${json.data}</li>`;
                return;
            }

            const posts = json.data.posts;
            if (!posts.length) {
                listEl.innerHTML = `<li>You have no posts yet.</li>`;
                return;
            }

            listEl.innerHTML = posts.map(p => `
          <li class="post-item" data-id="${p.id}">
            <a href="/posts/${p.id}" class="post-title">${p.title}</a>
            <small>${new Date(p.date_posted).toLocaleDateString()}</small>
            <div class="post-actions">
              <button class="edit-btn"   data-id="${p.id}">Edit</button>
              <button class="delete-btn" data-id="${p.id}">Delete</button>
            </div>
          </li>
        `).join("");
        } catch (err) {
            listEl.innerHTML = `<li>Error loading posts: ${err.message}</li>`;
        }
    }

    // Delegate click events for Edit/Delete
    listEl.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (!id) return;

        // EDIT → just navigate
        if (e.target.classList.contains("edit-btn")) {
            window.location.href = `/posts/${id}/edit`;
            return;
        }

        // DELETE → include CSRF in both header & body
        if (e.target.classList.contains("delete-btn")) {
            if (!confirm("Delete this post permanently?")) return;

            try {
                const res = await fetch(`/api/posts/${id}`, {
                    method: "DELETE",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "csrf-token": csrfToken,
                        "X-CSRF-Token": csrfToken
                    },
                    body: JSON.stringify({
                        author_id: userId,
                        csrfToken  // include in body too
                    })
                });
                // try to parse JSON (or will throw)
                const json = await res.json();
                if (!json.success) throw new Error(json.data || json.error);

                // remove the deleted post from the list
                const li = listEl.querySelector(`li[data-id="${id}"]`);
                if (li) li.remove();
            } catch (err) {
                alert("Error deleting post: " + err.message);
            }
        }
    });

    // initial load
    loadMyPosts();
});

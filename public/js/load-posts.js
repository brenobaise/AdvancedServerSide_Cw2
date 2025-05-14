async function loadPosts() {
    try {
        const resp = await fetch("/api/posts");
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        const container = document.getElementById("posts-container");

        if (!json.success) {
            container.textContent = "Error: " + json.error;
            return;
        }
        const posts = json.data;
        if (posts.length === 0) {
            container.textContent = "No posts yet.";
            return;
        }

        container.innerHTML = "";
        posts.forEach(p => {
            const div = document.createElement("div");
            div.className = "post";
            div.innerHTML = `
          <h2>${p.title}</h2>
          <small>Visited ${p.country} on ${p.date_of_visit}</small>
          <p>${p.content}</p>
        `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        document.getElementById("posts-container")
            .textContent = "Failed to load posts.";
    }
}

document.addEventListener("DOMContentLoaded", loadPosts);
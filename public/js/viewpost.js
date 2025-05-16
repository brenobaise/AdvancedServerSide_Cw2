// public/js/viewpost.js

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("postDetail");
    const postId = container.dataset.postId;
    const currentUserId = container.dataset.userId
        ? parseInt(container.dataset.userId, 10)
        : null;

    try {
        const res = await fetch(`/api/posts/${postId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.data);

        const p = json.data;
        container.innerHTML = `
        <h2>${p.title}</h2>
        <p>
          <strong>${p.author}</strong>
          on ${new Date(p.date_posted).toLocaleDateString()}
        </p>
        <p><em>Visited ${p.country} on ${p.date_of_visit}</em></p>
        <div>${p.content.replace(/\n/g, "<br/>")}</div>
      `;

        // Only show Edit link if the logged-in user is the author
        if (currentUserId === p.author_id) {
            container.innerHTML += `
          <p>
            <a href="/posts/${postId}/edit">Edit / Delete</a>
          </p>
        `;
        }
    } catch (err) {
        container.textContent = "Error: " + err.message;
    }
});

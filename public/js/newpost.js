// public/js/newpost.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("newPostForm");
    const msg = document.getElementById("msg");
    const authId = document.getElementById("auth_id").value;

    form.addEventListener("submit", async e => {
        e.preventDefault();
        msg.textContent = "Creating…";

        // grab the token
        const token = document.getElementById("csrfToken").value;

        // build your payload *including* the same token field
        const data = {
            auth_id: authId,
            title: form.title.value.trim(),
            country: form.country.value.trim(),
            date_of_visit: form.date_of_visit.value,
            content: form.content.value.trim(),
            csrfToken: token               // <-- include in body
        };

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                credentials: "same-origin",      // ensure cookies (session) are sent
                headers: {
                    "Content-Type": "application/json",
                    "csrf-token": token,         // <-- header too (in case your middleware checks here)
                    "X-CSRF-Token": token          // <-- some middlewares look here
                },
                body: JSON.stringify(data)
            });

            const json = await res.json();
            if (!json.success) {
                throw new Error(json.data || json.error || "Unknown error");
            }

            msg.textContent = "Post created! Redirecting…";
            // Assuming your create API returns the new post ID in json.data.id:
            window.location.href = `/posts/${json.data.id}`;

        } catch (err) {
            msg.textContent = "Error: " + err.message;
        }
    });
});

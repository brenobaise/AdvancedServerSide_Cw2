// public/js/editpost.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editPostForm");
    const msg = document.getElementById("msg");
    const postId = document.getElementById("post_id").value;
    const authId = document.getElementById("auth_id").value;
    const csrfToken = document.getElementById("csrfToken").value;

    // Fetch existing post data (you probably already have this)
    // …

    form.addEventListener("submit", async e => {
        e.preventDefault();
        msg.textContent = "Saving…";

        // Build payload and include CSRF again in the JSON body
        const payload = {
            author_id: authId,
            title: form.title.value.trim(),
            country: form.country.value.trim(),
            date_of_visit: form.date_of_visit.value,
            content: form.content.value.trim(),
            csrfToken      // <-- send it in the body
        };

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "PUT",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify(payload)
            });


            if (res.status === 403) {
                throw new Error("CSRF token missing or invalid");
            }
            const json = await res.json();
            if (!json.success) {
                throw new Error(json.data || json.error);
            }

            msg.textContent = "Updated! Redirecting…";
            window.location.href = `/posts/${postId}`;
        } catch (err) {
            msg.textContent = "Error: " + err.message;
        }
    });
});

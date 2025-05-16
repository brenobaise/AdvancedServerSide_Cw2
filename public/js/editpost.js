document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editPostForm");
    const msg = document.getElementById("msg");
    const postId = document.getElementById("post_id").value;
    const authId = document.getElementById("auth_id").value;
    const csrfToken = document.getElementById("csrfToken").value;
    const countrySelect = document.getElementById("countrySelect");
    const currentCountry = window.currentCountry;

    // Fetch and populate countries
    async function loadCountries() {
        try {
            const res = await fetch("/api/countries");
            const countries = await res.json();

            countrySelect.innerHTML = countries.map(c => {
                const selected = c === currentCountry ? "selected" : "";
                return `<option value="${c}" ${selected}>${c}</option>`;
            }).join("");
        } catch (err) {
            console.error("Failed to load countries:", err);
            countrySelect.innerHTML = `<option>Error loading countries</option>`;
        }
    }

    loadCountries(); // run on page load


    form.addEventListener("submit", async e => {
        e.preventDefault();
        msg.textContent = "Saving…";

        const payload = {
            author_id: authId,
            title: form.title.value.trim(),
            country: form.country.value, // selected from dropdown
            date_of_visit: form.date_of_visit.value,
            content: form.content.value.trim(),
            csrfToken
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

            if (res.status === 403) throw new Error("CSRF token missing or invalid");

            const json = await res.json();
            if (!json.success) throw new Error(json.data || json.error);

            msg.textContent = "Updated! Redirecting to profile…";
            window.location.href = `/profile`;

        } catch (err) {
            msg.textContent = "Error: " + err.message;
        }
    });

    document.getElementById("deleteBtn").addEventListener("click", async () => {
        if (!confirm("Delete this post permanently?")) return;

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify({ author_id: authId, csrfToken })
            });

            const json = await res.json();
            if (!json.success) throw new Error(json.data || json.error);

            window.location.href = "/home";
        } catch (err) {
            alert("Error deleting post: " + err.message);
        }
    });
});

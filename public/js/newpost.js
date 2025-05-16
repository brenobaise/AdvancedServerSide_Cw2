document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("newPostForm");
    const msg = document.getElementById("msg");
    const authId = document.getElementById("auth_id").value;
    const csrfToken = document.getElementById("csrfToken").value;
    const countrySelect = document.getElementById("countrySelect");

    //  Fetch and populate countries
    async function loadCountries() {
        try {
            const res = await fetch("/api/countries");

            const countries = await res.json();
            countrySelect.innerHTML = countries.map(
                c => `<option value="${c}">${c}</option>`
            ).join("");

        } catch (err) {
            console.error("Failed to load countries:", err);
            countrySelect.innerHTML = `<option>Error loading countries</option>`;
        }
    }

    loadCountries();  // Fetch on page load

    form.addEventListener("submit", async e => {
        e.preventDefault();
        msg.textContent = "Creating…";

        const data = {
            auth_id: authId,
            title: form.title.value.trim(),
            country: countrySelect.value, // use selected country
            date_of_visit: form.date_of_visit.value,
            content: form.content.value.trim(),
            csrfToken
        };

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify(data)
            });

            const json = await res.json();
            if (!json.success) {
                throw new Error(json.data || json.error || "Unknown error");
            }

            msg.textContent = "Post created! Redirecting…";
            window.location.href = `/posts/${json.data.id}`;

        } catch (err) {
            msg.textContent = "Error: " + err.message;
        }
    });
});

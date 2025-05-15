
// public/js/search.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("searchForm");
    const results = document.getElementById("results");
    const info = document.getElementById("info");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    let currentPage = 1;
    const limit = 5;

    async function doSearch(page = 1) {
        const term = form.searchTerm.value.trim();
        const filter = form.filterBy.value;
        if (!term) return;
        info.textContent = `Searching…`;
        try {
            const res = await fetch(`/api/posts/search?searchTerm=${encodeURIComponent(term)}
                         &filterBy=${encodeURIComponent(filter)}
                         &page=${page}&limit=${limit}`.replace(/\s+/g, ""));
            const json = await res.json();
            if (!json.success) {
                results.innerHTML = `<li>${json.data}</li>`;
                info.textContent = "";
                return;
            }
            // destructure posts + meta
            const { posts, meta } = json.data;
            currentPage = meta.page;
            info.textContent = `Page ${meta.page} of ${meta.totalPages} (${meta.totalItems} results)`;
            results.innerHTML = posts.map(p => `
          <li>
            <strong>${p.title}</strong><br/>
            <em>${p.author}</em> — ${new Date(p.date_posted).toLocaleDateString()}<br/>
            <small>${p.country}</small>
          </li>
        `).join("");
        } catch (err) {
            results.innerHTML = `<li>Error: ${err.message}</li>`;
        }
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        currentPage = 1;
        doSearch(1);
    });

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) doSearch(currentPage - 1);
    });
    nextBtn.addEventListener("click", () => {
        doSearch(currentPage + 1);
    });
});

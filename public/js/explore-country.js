document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.getElementById("countryDropdown");
    const infoBox = document.getElementById("countryDetails");

    async function loadCountries() {
        try {
            const res = await fetch("/api/countries");
            const countries = await res.json();

            countries.forEach(c => {
                const option = document.createElement("option");
                option.value = c;
                option.textContent = c;
                dropdown.appendChild(option);
            });
        } catch (err) {
            console.error("Failed to load countries:", err);
        }
    }

    async function fetchDetails(countryName) {
        try {
            const res = await fetch("/api/countries/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ country: countryName })
            });

            const data = await res.json();
            const country = data[0]; // Assuming we only show the first match

            const capital = country.capital?.[0] || "N/A";
            const currency = Object.keys(country.currencies || {})[0] || "N/A";
            const flag = country.flags?.png || "";

            infoBox.innerHTML = `
          <img src="${flag}" alt="Flag of ${country.name.common}" width="100" />
          <p><strong>Capital:</strong> ${capital}</p>
          <p><strong>Currency:</strong> ${currency}</p>
        `;
        } catch (err) {
            infoBox.innerHTML = `<p>Error loading details</p>`;
            console.error("Error fetching details:", err);
        }
    }

    dropdown.addEventListener("change", () => {
        const selected = dropdown.value;
        if (selected) fetchDetails(selected);
        else infoBox.innerHTML = "";
    });

    loadCountries();
});

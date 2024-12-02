const tableBody = document.querySelector("#todo-table tbody");
const addRowButton = document.getElementById("add-row");
const saveDataButton = document.getElementById("save-data");
const githubRepo = "Ahmed-4a/to-do-app"; // Replace with your repo
const accessToken = "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"; // Replace with your token

// Fetch data from JSON
async function loadData() {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${githubRepo}/main/data.json`);
        const data = await response.json();
        tableBody.innerHTML = ""; // Clear existing rows
        data.forEach((row, index) => addRow(index + 1, row.brief, row.status, row.date));
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Add a row to the table
function addRow(number = "", brief = "", status = "Pending", date = "") {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${number}</td>
        <td><textarea class="brief">${brief}</textarea></td>
        <td>
            <select class="status">
                <option value="Pending" ${status === "Pending" ? "selected" : ""}>Pending</option>
                <option value="Completed" ${status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
        </td>
        <td><input type="text" class="date" value="${date}"></td>
    `;
    tableBody.appendChild(newRow);
}

// Save data to GitHub
async function saveData() {
    const rows = tableBody.querySelectorAll("tr");
    const data = Array.from(rows).map((row, index) => ({
        number: index + 1,
        brief: row.querySelector(".brief").value,
        status: row.querySelector(".status").value,
        date: row.querySelector(".date").value,
    }));

    try {
        // Get the SHA of the current file
        const fileResponse = await fetch(`https://api.github.com/repos/${githubRepo}/contents/data.json`);
        const fileData = await fileResponse.json();
        const sha = fileData.sha;

        // Update the file
        const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/data.json`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Update data.json",
                content: btoa(JSON.stringify(data, null, 2)), // Convert JSON to base64
                sha: sha,
            }),
        });

        if (!response.ok) throw new Error("Failed to save data.");
        alert("Data saved successfully!");
    } catch (error) {
        console.error("Error saving data:", error);
        alert("Failed to save data.");
    }
}

// Event Listeners
addRowButton.addEventListener("click", () => addRow("", "", "Pending", ""));
saveDataButton.addEventListener("click", saveData);

// Load data on page load
loadData();


// ===================================
// ELEMENTLARNI TANLASH
// ===================================

const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const errorMessage = document.querySelector("#errorMessage");

const themeButton = document.querySelector("#themeButton");
const themeText = document.querySelector("#themeText");

const avatar = document.querySelector("#avatar");
const userName = document.querySelector("#userName");
const userLogin = document.querySelector("#userLogin");
const joined = document.querySelector("#joined");
const bio = document.querySelector("#bio");

const repos = document.querySelector("#repos");
const followers = document.querySelector("#followers");
const following = document.querySelector("#following");

const locationElement = document.querySelector("#location");
const twitter = document.querySelector("#twitter");
const blog = document.querySelector("#blog");
const company = document.querySelector("#company");


// ===================================
// DARK MODE
// ===================================

// Saqlangan rejimni olish
const savedTheme = localStorage.getItem("theme");

// Agar oldin dark mode tanlangan bo'lsa
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeText.textContent = "LIGHT";
}


// Theme tugmasini bosish
themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");
        themeText.textContent = "LIGHT";

    } else {

        localStorage.setItem("theme", "light");
        themeText.textContent = "DARK";

    }

});


// ===================================
// GITHUB USER SEARCH FUNCTION
// ===================================

async function searchUser() {

    const username = searchInput.value.trim();

    // Input bo'shligini tekshirish
    if (username === "") {
        errorMessage.textContent = "Please enter a username!";
        return;
    }

    // Eski xabarni tozalash
    errorMessage.textContent = "";

    // Loading
    searchButton.disabled = true;
    searchButton.textContent = "Loading...";


    try {

        // API dan ma'lumot olish
        const response = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}`
        );

        // Username topilmasa
        if (response.status === 404) {
            throw new Error("User not found!");
        }

        // Boshqa HTTP xatoliklari
        if (!response.ok) {
            throw new Error("Something went wrong. Try again!");
        }

        // JSON ma'lumotga aylantirish
        const user = await response.json();


        // ===================================
        // PROFILE INFORMATION
        // ===================================

        avatar.src = user.avatar_url;

        userName.textContent = user.name || user.login;

        userLogin.textContent = "@" + user.login;
        userLogin.href = user.html_url;

        // Sana
        const date = new Date(user.created_at);

        joined.textContent =
            "Joined " +
            date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });


        // Bio
        bio.textContent = user.bio || "This profile has no bio";


        // ===================================
        // STATISTICS
        // ===================================

        repos.textContent = user.public_repos;

        followers.textContent = user.followers;

        following.textContent = user.following;


        // ===================================
        // LOCATION
        // ===================================

        locationElement.textContent =
            user.location || "Not Available";


        // ===================================
        // TWITTER
        // ===================================

        twitter.textContent =
            user.twitter_username || "Not Available";


        // ===================================
        // BLOG
        // ===================================

        if (user.blog) {

            let blogUrl = user.blog;

            if (!blogUrl.startsWith("http")) {
                blogUrl = "https://" + blogUrl;
            }

            blog.textContent = user.blog;
            blog.href = blogUrl;

        } else {

            blog.textContent = "Not Available";
            blog.removeAttribute("href");

        }


        // ===================================
        // COMPANY
        // ===================================

        company.textContent =
            user.company || "Not Available";


    } catch (error) {

        // Xatolikni chiqarish
        errorMessage.textContent = error.message;

    } finally {

        // Loading tugashi
        searchButton.disabled = false;
        searchButton.textContent = "Search";

    }

}


// ===================================
// SEARCH BUTTON
// ===================================

searchButton.addEventListener("click", searchUser);


// ===================================
// ENTER KEY
// ===================================

searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchUser();
    }

});


// ===================================
// DEFAULT USER
// ===================================

// Sayt ochilganda Octocat profilini chiqarish
searchInput.value = "octocat";
searchUser();

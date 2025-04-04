document.addEventListener("DOMContentLoaded", function () {
    function getPosts() {
        return JSON.parse(localStorage.getItem("posts")) || [];
    }

    function savePosts(posts) {
        localStorage.setItem("posts", JSON.stringify(posts));
    }

    function displayBlogPosts() {
        const blogPostsSection = document.getElementById("blog-posts");
        blogPostsSection.innerHTML = "<h2>Blog Posts</h2>";
        const posts = getPosts();

        posts.forEach((post, index) => {
            let postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p><em>${post.date}</em></p>
                <p>${post.content}</p>
                <button class="edit-post" data-index="${index}">Edit</button>
            `;
            blogPostsSection.appendChild(postElement);
        });

        // Add event listeners for edit buttons
        document.querySelectorAll(".edit-post").forEach(button => {
            button.addEventListener("click", editPost);
        });
    }

    function addPost(event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const date = document.getElementById("date").value;
        const content = document.getElementById("content").value.trim();
        const messageDiv = document.getElementById("message");

        if (title && date && content) {
            const newPost = { title, date, content };
            const posts = getPosts();
            posts.unshift(newPost);
            savePosts(posts);

            messageDiv.textContent = "Post added successfully!";
            messageDiv.style.display = "block";

            setTimeout(() => {
                messageDiv.style.display = "none";
            }, 1500);

            document.getElementById("post-form").reset();
            displayBlogPosts();
        } else {
            alert("Please fill in all fields!");
        }
    }

    function editPost(event) {
        const index = event.target.getAttribute("data-index");
        let posts = getPosts();
        let post = posts[index];

        let postElement = event.target.parentElement;
        postElement.innerHTML = `
            <input type="text" id="edit-title" value="${post.title}">
            <input type="date" id="edit-date" value="${post.date}">
            <textarea id="edit-content">${post.content}</textarea>
            <button class="save-edit" data-index="${index}">Save</button>
            <button class="cancel-edit">Cancel</button>
        `;

        postElement.querySelector(".save-edit").addEventListener("click", function () {
            saveEditedPost(index, postElement);
        });

        postElement.querySelector(".cancel-edit").addEventListener("click", displayBlogPosts);
    }

    function saveEditedPost(index, postElement) {
        let posts = getPosts();
        posts[index].title = postElement.querySelector("#edit-title").value;
        posts[index].date = postElement.querySelector("#edit-date").value;
        posts[index].content = postElement.querySelector("#edit-content").value;

        savePosts(posts);
        displayBlogPosts();
    }

    function deleteAllPosts() {
        if (confirm("Are you sure you want to delete all blog posts?")) {
            localStorage.removeItem("posts");
            displayBlogPosts();
        }
    }

    document.getElementById("post-form").addEventListener("submit", addPost);
    document.getElementById("delete-all-posts-button").addEventListener("click", deleteAllPosts);
    displayBlogPosts();
});

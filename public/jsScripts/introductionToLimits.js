document
        .getElementById("chatbox-icon")
        .addEventListener("click", function () {
          var chatboxWindow = document.getElementById("chatbox-window");
          if (
            chatboxWindow.style.display === "none" ||
            chatboxWindow.style.display === ""
          ) {
            chatboxWindow.style.display = "flex";
          } else {
            chatboxWindow.style.display = "none";
          }
        });

      document
        .getElementById("chatbox-form")
        .addEventListener("submit", function (event) {
          event.preventDefault(); // Prevent default form submission
          const formData = new FormData(this);
          fetch("/submit-question", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.text())
            .then((data) => {
              alert(data); // Show response message
              document.getElementById("chatbox-window").style.display = "none"; // Hide chatbox window after submission
            });
        });
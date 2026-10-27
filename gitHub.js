const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function gitHub() {
  rl.question("Nhập GitHub username cần check: ", async (username) => {
    console.log(`Đang lấy dữ liệu cho user: ${username}`);
    const cleanUsername = encodeURIComponent(username.trim());

    const API = `https://api.github.com/users/${cleanUsername}/events/public`;

    try {
      const response = await fetch(API);

      const data = await response.json();

      // Kiểm tra xem dữ liệu có phải là mảng và có phần tử không
      if (Array.isArray(data) && data.length > 0) {
        console.log(`\n--- Hoạt động gần đây của: ${username} ---`);

        // Duyệt qua từng sự kiện trong mảng
        data.forEach((event, index) => {
          let action = "";

          // Dùng switch-case để phân loại các loại event phổ biến của GitHub
          switch (event.type) {
            case "PushEvent":
              // Lấy số lượng commit nếu có
              const commitCount = event.payload.commits
                ? event.payload.commits.length
                : "vài";
              action = `Pushed ${commitCount} commits to`;
              break;

            case "IssuesEvent":
              action = `${event.payload.action} an issue in`;
              break;

            case "WatchEvent":
              action = `Starred`;
              break;

            case "CreateEvent":
              action = `Created a ${event.payload.ref_type || "repository"} in`;
              break;

            case "PullRequestEvent":
              action = `${event.payload.action} a pull request in`;
              break;

            default:
              action = `Performed ${event.type} on`;
              break;
          }

          // In ra kết quả từng dòng giống như output mẫu
          console.log(`${index + 1}. - ${action} ${event.repo.name}`);
        });
      } else {
        console.log(
          "Không tìm thấy hoạt động nào hoặc tài khoản không tồn tại!",
        );
      }
    } catch (error) {
      console.log(error);
    }

    rl.close();
  });
}
gitHub();


// topic-entry.js

const goalSelect = document.getElementById("goal");
const subjectGroup = document.getElementById("subject-group");

// Toggle subject input visibility based on goal
goalSelect.addEventListener("change", function () {
  const selected = this.value;

  if (selected === "GATE" || selected === "Competitive Exams") {
    subjectGroup.style.display = "block";
    document.getElementById("subject").required = true;
  } else {
    subjectGroup.style.display = "none";
    document.getElementById("subject").required = false;
    document.getElementById("subject").value = "";
  }
});

// Handle form submission
document.getElementById("topicForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const goal = document.getElementById("goal").value;
  const subject = document.getElementById("subject").value.trim();
  const topic = document.getElementById("topic").value.trim();
  const video = document.getElementById("video").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!goal || !topic || (goal === "GATE" || goal === "Competitive Exams") && !subject) {
    alert("Please fill in Goal, Subject (if required), and Topic");
    return;
  }

  const entryData = {
    goal,
    subject,
    topic,
    video,
    description,
    createdAt: new Date().toISOString(),
  };

  console.log("✅ New Topic Entry:", entryData);

  alert("Entry saved successfully!\n(Backend integration coming soon.)");
  document.getElementById("topicForm").reset();

  // Reset subject visibility
  subjectGroup.style.display = "block";
  document.getElementById("subject").required = true;
});

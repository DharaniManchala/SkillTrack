const userGoals = [
  {
    goal: "GATE",
    topics: [
      { name: "DBMS", progress: 40 },
      { name: "CN", progress: 20 },
      { name: "OS", progress: 0 }
    ]
  },
  {
    goal: "Machine Learning",
    topics: [
      { name: "Regression", progress: 60 },
      { name: "Clustering", progress: 20 }
    ]
  },
  {
    goal: "Full Stack",
    topics: [
      { name: "React", progress: 50 },
      { name: "Node.js", progress: 30 }
    ]
  }
];

const goalListEl = document.getElementById('goalList');
const goalDetailsEl = document.getElementById('goalDetails');

// Render buttons for each goal
userGoals.forEach((goal, index) => {
  const btn = document.createElement('button');
  btn.innerText = goal.goal;
  btn.onclick = () => toggleGoal(index);
  goalListEl.appendChild(btn);
});

let activeGoal = null;

function toggleGoal(index) {
  if (activeGoal === index) {
    goalDetailsEl.innerHTML = `
      <div class="welcome-box">
        <h2>🎯 Welcome to Your Dashboard</h2>
        <p>Select any goal from the left to view topics and progress.</p>
      </div>
    `;
    activeGoal = null;
    return;
  }

  activeGoal = index;
  const goal = userGoals[index];

  let html = `<h2>${goal.goal} Topics</h2><div class="goal-topic">`;

  goal.topics.forEach(topic => {
    html += `
      <div class="topic-row">
        <div class="topic-name">${topic.name}</div>
        <div class="circle-progress" style="--progress: ${topic.progress * 3.6}deg">${topic.progress}%</div>
      </div>
    `;
  });

  html += `</div>`;
  goalDetailsEl.innerHTML = html;
}

// Profile image upload
const profileInput = document.getElementById('profileInput');
const profileImage = document.getElementById('profileImage');

profileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    profileImage.src = URL.createObjectURL(file);
  }
});

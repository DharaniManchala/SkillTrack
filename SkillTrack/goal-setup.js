const allGoals = [];

function addGoal() {
  const goalInput = document.getElementById('goal');
  const topicsInput = document.getElementById('topics');

  const goalName = goalInput.value.trim();
  const topics = topicsInput.value.trim().split(',').map(t => t.trim()).filter(t => t !== '');

  if (!goalName || topics.length === 0) {
    alert('Please fill in both fields.');
    return;
  }

  allGoals.push({ goal: goalName, topics });

  // Clear input fields
  goalInput.value = '';
  topicsInput.value = '';

  renderGoalsPreview();
}

function renderGoalsPreview() {
  const preview = document.getElementById('goalsPreview');
  preview.innerHTML = '<h3>📝 Your Goals:</h3>';

  allGoals.forEach((g, index) => {
    const div = document.createElement('div');
    div.className = 'goal-box';

    const header = document.createElement('div');
    header.className = 'goal-header';

    const title = document.createElement('h4');
    title.innerText = `${index + 1}. ${g.goal}`;

    // 🗑 Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '❌';
    deleteBtn.onclick = () => {
      allGoals.splice(index, 1);
      renderGoalsPreview();
    };

    header.appendChild(title);
    header.appendChild(deleteBtn);
    div.appendChild(header);

    const list = document.createElement('ul');
    g.topics.forEach(topic => {
      const li = document.createElement('li');
      li.innerText = topic;
      list.appendChild(li);
    });

    div.appendChild(list);
    preview.appendChild(div);
  });
}

function submitGoals() {
  if (allGoals.length === 0) {
    alert('Add at least one goal before submitting.');
    return;
  }

  console.log("All Goals Submitted:", allGoals);

  // TODO: send to backend using fetch() or save in localStorage
  alert('Goals submitted successfully! (Check console for data)');
}

function renderBarChart(progress) {
  const barDiv = document.getElementById('barChart');
  barDiv.innerHTML = '<h3>All Goals Progress</h3><div class="django-bars">';
  if (!progress || progress.length === 0) {
    barDiv.innerHTML += '<div>No data</div>';
    return;
  }
  progress.forEach(goal => {
    barDiv.innerHTML += `<div style="height:${goal.progress*2}px;" title="${goal.progress}%"></div>`;
  });
  barDiv.innerHTML += '</div><div class="bar-labels">' +
    progress.map(goal => `<span>${goal.goal}</span>`).join('') +
    '</div>';
}
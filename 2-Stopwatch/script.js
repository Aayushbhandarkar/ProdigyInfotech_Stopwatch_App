document.addEventListener('DOMContentLoaded', () => {
  const hrs = document.getElementById('hours');
  const mins = document.getElementById('minutes');
  const secs = document.getElementById('seconds');
  const ms = document.getElementById('milliseconds');

  const startBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const lapBtn = document.getElementById('lapBtn');
  const lapContainer = document.getElementById('lapList');
  const themeBtn = document.getElementById('themeToggle');

  let startTime = 0;
  let elapsed = 0;
  let interval = null;
  let running = false;
  let lapCount = 1;

  if (localStorage.getItem('theme') === 'true') {
    document.body.classList.add('dark-mode');
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark);
  });

  function startStopwatch() {
    startTime = Date.now() - elapsed;
    interval = setInterval(() => {
      elapsed = Date.now() - startTime;
      const time = new Date(elapsed);

      hrs.textContent = String(time.getUTCHours()).padStart(2, '0');
      mins.textContent = String(time.getUTCMinutes()).padStart(2, '0');
      secs.textContent = String(time.getUTCSeconds()).padStart(2, '0');
      ms.textContent = String(Math.floor(time.getUTCMilliseconds() / 10)).padStart(2, '0');
    }, 10);

    startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    resetBtn.disabled = true;
    lapBtn.disabled = false;
  }

  function pauseStopwatch() {
    clearInterval(interval);
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    resetBtn.disabled = false;
    lapBtn.disabled = true;
  }

  function toggleStopwatch() {
    if (running) {
      pauseStopwatch();
    } else {
      startStopwatch();
    }
    running = !running;
  }

  function resetStopwatch() {
    clearInterval(interval);
    startTime = 0;
    elapsed = 0;
    running = false;
    lapCount = 1;

    hrs.textContent = '00';
    mins.textContent = '00';
    secs.textContent = '00';
    ms.textContent = '00';

    startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    resetBtn.disabled = true;
    lapBtn.disabled = true;

    lapContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-flag"></i>
        <p>Your lap times will appear here</p>
      </div>
    `;
  }

  function recordLap() {
    const lapTime = `${hrs.textContent}:${mins.textContent}:${secs.textContent}.${ms.textContent}`;

    if (lapContainer.querySelector('.empty-state')) {
      lapContainer.innerHTML = '';
    }

    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `<span>Lap ${lapCount}</span><span>${lapTime}</span>`;
    lapContainer.prepend(lapItem);

    lapCount++;
  }

  startBtn.addEventListener('click', toggleStopwatch);
  resetBtn.addEventListener('click', resetStopwatch);
  lapBtn.addEventListener('click', recordLap);
});

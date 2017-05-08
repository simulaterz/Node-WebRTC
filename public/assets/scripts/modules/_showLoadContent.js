function showLoadContent() {
  var loading = document.getElementById('loading');
  var content = document.getElementById('content');

  loading.className += ' animated';
  loading.className += ' fadeOut';
  content.className += ' animated';
  content.className += ' fadeIn';
  content.style.visibility = 'visible';

  console.log('Connected to Server');
};

module.exports = { showLoadContent };

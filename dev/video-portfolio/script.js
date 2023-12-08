window.onload = function() {
  // Function to populate videos
  const populateVideos = (videoData, collectionTitle) => {
    const content = document.getElementById('content');
    const header = document.getElementById('header');
    header.innerHTML = collectionTitle;

    videoData.forEach((video, index) => {
      const videoContainer = document.createElement('div');
      videoContainer.className = 'video-container';

      const videoWrapper = document.createElement('div');
      videoWrapper.className = 'video-wrapper';

      const iframe = document.createElement('iframe');
      iframe.src = video.url;

      videoWrapper.appendChild(iframe);

      const description = document.createElement('div');
      description.className = 'description';
      description.innerHTML = `<h2>${video.title}</h2><p>${video.description}</p>`;

      videoContainer.appendChild(description);
      videoContainer.appendChild(videoWrapper);

      content.appendChild(videoContainer);
    });
  };

  // Function to get URL parameters
  const getUrlParameter = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  // Get 'set' parameter from URL
  const setParam = getUrlParameter('set');

  // Load the appropriate JS file based on the 'set' parameter
  if (setParam) {
    const script = document.createElement('script');
    script.src = `${setParam}.js`;
    script.onload = () => {
      populateVideos(window.videoData, window.collectionTitle);
    };
    document.head.appendChild(script);
  } else {
    // Default behavior when 'set' parameter is not specified
    const header = document.getElementById('header');
    header.innerHTML = "No video set specified";
    const content = document.getElementById('content');
    content.innerHTML = "<p>Please specify a video set (aboutnextclass, computationalreasoning, coursetrailers, portfolio, teaching, workshops, design) using the 'set' URL parameter.</p>";
  }
};

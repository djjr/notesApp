const videoData = [
    {
      url: 'https://www.youtube.com/embed/iGLR2Pn6eyc?si=fIyexSONv7nph1Wm',
      title: 'The Sociology Major',
      description: 'Promo video I created for our majors and minors preview day 2016.'
    },
    {
      url: 'https://www.youtube.com/embed/UuK_ziBqgHw?si=XbThbUCP7gRSkpbC',
      title: 'Shatter the Semester',
      description: 'Shatter the Semester is a video I created in conjunction with Mills College\'s 2015-16 strategic planning work. It describes a rethinking of the 4 year by 2 semester by 4 courses enrollment model and suggests ways a small liberal arts college could implement a more flexible curriculum to benefit students and to support its business model.'
    },
    {
      url: 'https://www.youtube.com/embed/ihfd-XofXNs?si=cue55PKW-DpbjKzv',
      title: 'Facebook/Youtube Ad for UofT Bachelor of Information Program',
      description: 'I created a series of social media advertising videos when I was director of the bachelor of information program at the University of Toronto\'s Faculty of Information.'
    },
    {
      url: 'https://www.youtube.com/embed/ZZA3ze9crHc?si=Y63pr81XReskHh_H',
      title: 'Course Thank You Fall 2021',
      description: 'Short end of semester thanks for students in my courses mid-COVID.'
    },
    {
        url: 'https://www.youtube.com/embed/https://www.youtube.com/embed/-ZkxRmT_7e8?si=pMhdetiVLwW505Zj',
        title: 'Mills 2015 Innovation Challenge',
        description: 'Video created to promote campus-wide innovation challenge.  Voiced by my former student, radio journalist Sarah Gonzalez.'
    },
    {
        url: 'https://www.youtube.com/embed/Zp6gjZirBcA?si=EkpVKYQ_XqQCOI9F',
        title: 'Course Welcome and Instructor Introduction, Computational Reasoning Fall 2021',
        description: 'Six minute welcome to the course with instructions on how to get started and instructor introduction.'
    },
    {
        url: 'https://www.youtube.com/embed/',
        title: 'x',
        description: 'x'
    }
    // Add more video objects here
    
  ];
  
  window.onload = function() {
    const content = document.getElementById('content');
  
    videoData.forEach((video, index) => {
      const videoContainer = document.createElement('div');
      videoContainer.className = 'video-container';
  
      //const videoWrapper = document.createElement('div');
      //videoWrapper.className = 'video-wrapper';

      const iframe = document.createElement('iframe');
      iframe.src = video.url;
      //iframe.width = 640;  // You can adjust this
      //iframe.height = 360; // You can adjust this
  

      //videoWrapper.appendChild(iframe);
  
      const description = document.createElement('div');
      description.className = 'description';
      description.innerHTML = `<h2>${video.title}</h2><p>${video.description}</p>`;


      videoContainer.appendChild(description);
      videoContainer.appendChild(iframe);

  
      content.appendChild(videoContainer);
    });
  };
  
  
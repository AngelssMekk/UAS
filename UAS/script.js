document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("background-audio");
  const icon = document.getElementById("icon");
  const volumeControlContainer = document.getElementById(
    "volume-control-container"
  );
  const volumeControlHandle = document.getElementById("volume-control-handle");
  const fadeDuration = 2000; // Adjust the fade duration in milliseconds

  function fadeInAudio() {
    audio.volume = 0;
    audio.play();

    let currentTime = 0;
    const fadeInInterval = setInterval(() => {
      currentTime += 100;
      if (currentTime < fadeDuration) {
        audio.volume = currentTime / fadeDuration;
      } else {
        clearInterval(fadeInInterval);
        audio.volume = 1;
      }
    }, 100);
  }

  function fadeOutAudio() {
    let currentTime = 0;
    const fadeOutInterval = setInterval(() => {
      currentTime += 100;
      if (currentTime < fadeDuration) {
        audio.volume = 1 - currentTime / fadeDuration;
      } else {
        clearInterval(fadeOutInterval);
        audio.pause();
        audio.currentTime = 0; // Rewind to the beginning when paused
      }
    }, 100);
  }

  function loopAudioWithFade() {
    fadeInAudio();

    audio.addEventListener("ended", function () {
      fadeOutAudio();
      setTimeout(function () {
        fadeInAudio();
      }, fadeDuration);
    });
  }

  icon.addEventListener("click", function () {
    if (audio.paused) {
      loopAudioWithFade();
      icon.classList.remove("muted");
      volumeControlContainer.classList.remove("invisible");
      volumeControlContainer.classList.add("visible");
    } else {
      audio.pause();
      // audio.currentTime = 0; // Removed to prevent rewind
      icon.classList.add("muted");
      volumeControlContainer.classList.remove("visible");
      volumeControlContainer.classList.add("invisible");
    }
  });

  volumeControlHandle.addEventListener("mousedown", function (event) {
    event.preventDefault(); // Prevent default behavior to avoid text selection

    function moveHandle(event) {
      const containerHeight = volumeControlContainer.offsetHeight;
      const handleHeight = volumeControlHandle.offsetHeight;
      const offsetY =
        event.clientY -
        volumeControlContainer.getBoundingClientRect().top -
        handleHeight / 2;

      // Ensure the handle stays within the container bounds
      const newPosition = Math.min(
        Math.max(0, offsetY),
        containerHeight - handleHeight
      );
      const volume = 1 - newPosition / (containerHeight - handleHeight);

      // Set the volume
      audio.volume = volume;

      // Move the handle
      volumeControlHandle.style.top = newPosition + "px";
    }

    function stopMoving() {
      document.removeEventListener("mousemove", moveHandle);
      document.removeEventListener("mouseup", stopMoving);
    }

    document.addEventListener("mousemove", moveHandle);
    document.addEventListener("mouseup", stopMoving);

    // Define the section element
    const section = document.querySelector(".appear-section");

    // Create a new Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // If the section enters the viewport, add the 'appeared' class
            section.classList.add("appeared");
          } else {
            // If the section exits the viewport, remove the 'appeared' class
            section.classList.remove("appeared");
          }
        });
      },
      {
        threshold: 0, // The section is considered visible when it enters the viewport
      }
    );

    // Start observing the section
    observer.observe(section);
  });
});

// Mobile menu
const toggle = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') links.classList.remove('open');
});

// Screenshot lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
document.querySelectorAll('.gallery button').forEach((btn) => {
  btn.addEventListener('click', () => {
    lightboxImg.src = btn.dataset.full;
    lightbox.showModal();
  });
});
lightbox.addEventListener('click', () => lightbox.close());

// Trailer: show the YouTube thumbnail, only load the player on click
const trailer = document.querySelector('.trailer');
const videoId = trailer.dataset.youtubeId;
if (videoId) {
  trailer.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg)`;
  trailer.classList.add('has-thumb');
  trailer.querySelector('.trailer__play').addEventListener('click', () => {
    trailer.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0"
      title="Mega City Force trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  });
}

// Contact form, submitted to Web3Forms (hCaptcha is injected by their client script)
const form = document.getElementById('contact-form');
const status = form.querySelector('.form__status');
const submitBtn = form.querySelector('button[type=submit]');

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (!data.get('h-captcha-response')) {
    setStatus('Please complete the captcha first.', true);
    return;
  }

  submitBtn.disabled = true;
  setStatus('Sending…');
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    form.reset();
    setStatus("Thanks! Your message is on its way. We'll get back to you soon.");
  } catch (err) {
    setStatus(`Something went wrong${err.message ? `: ${err.message}` : ''}. Please try again later.`, true);
  } finally {
    submitBtn.disabled = false;
    window.hcaptcha?.reset();
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

(() => {
  const photoColumn = document.querySelector('.member-photo-wrap')?.parentElement;
  const contactCard = document.querySelector('.member-contact-card');
  const bio = document.querySelector('.member-bio');

  if (photoColumn && contactCard) {
    photoColumn.append(contactCard);
  }

  if (bio && !document.querySelector('.member-profile-details')) {
    const createItems = (value) => value
      .split('|')
      .filter(Boolean)
      .map((item) => `<span>${item}</span>`)
      .join('');
    const skills = createItems(document.body.dataset.memberSkills || '');
    const programs = createItems(document.body.dataset.memberPrograms || '');
    const details = document.createElement('div');
    details.className = 'member-profile-details';
    details.innerHTML = `
      <section class="member-profile-detail">
        <h2>Habilidades</h2>
        <div class="member-profile-items">${skills}</div>
      </section>
      <section class="member-profile-detail">
        <h2>Programas</h2>
        <div class="member-profile-items">${programs}</div>
      </section>
    `;
    bio.after(details);
  }
})();

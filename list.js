/* list.js — Renders all activities as cards */

(function () {
  'use strict';

  const grid = document.getElementById('activities-grid');

  activities.forEach(function (activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';

    const badgeClass = activity.secret ? 'badge-secret' : 'badge-open';
    const badgeIcon = activity.secret ? '🔒' : '✅';
    const badgeText = activity.secret ? 'Secret' : 'Open';

    let descriptionHtml;
    if (activity.secret) {
      descriptionHtml = '<p class="activity-description secret-hidden">Description hidden — this one\'s a secret!</p>';
    } else {
      descriptionHtml = `<p class="activity-description">${escapeHtml(activity.description)}</p>`;
    }

    card.innerHTML = `
      <div class="card-header">
        <span class="activity-name">${escapeHtml(activity.name)}</span>
        <span class="badge ${badgeClass}">${badgeIcon} ${badgeText}</span>
      </div>
      ${descriptionHtml}
    `;

    grid.appendChild(card);
  });

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();

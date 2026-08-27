(function (global) {
  'use strict';

  var DEFAULT_ENDPOINT = '/api/contest-group-qr';
  var DEFAULT_IMAGE_URL = 'assets/contest-group-qr.png';

  /*
   * GET /api/contest-group-qr
   *   -> { data: { imageUrl, updatedAt, expiresAt } }
   * PUT /api/contest-group-qr
   *   multipart/form-data field: qrCode
   *   -> { data: { imageUrl, updatedAt, expiresAt } }
   */

  function endpoint() {
    return global.CONTEST_GROUP_QR_API_URL || DEFAULT_ENDPOINT;
  }

  function normalize(payload) {
    var data = payload && payload.data ? payload.data : payload || {};
    return {
      imageUrl: data.imageUrl || data.url || DEFAULT_IMAGE_URL,
      updatedAt: data.updatedAt || null,
      expiresAt: data.expiresAt || null,
      fallback: false
    };
  }

  async function getCurrent() {
    try {
      var response = await fetch(endpoint(), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Failed to load contest group QR code');
      return normalize(await response.json());
    } catch (error) {
      return {
        imageUrl: DEFAULT_IMAGE_URL,
        updatedAt: null,
        expiresAt: null,
        fallback: true
      };
    }
  }

  async function update(file) {
    if (!file) throw new Error('A QR code image file is required');
    var form = new FormData();
    form.append('qrCode', file, file.name || 'contest-group-qr.png');
    var response = await fetch(endpoint(), { method: 'PUT', body: form });
    if (!response.ok) throw new Error('Failed to update contest group QR code');
    return normalize(await response.json());
  }

  global.ContestGroupQrAPI = {
    endpoint: endpoint(),
    defaultImageUrl: DEFAULT_IMAGE_URL,
    getCurrent: getCurrent,
    update: update
  };
})(window);

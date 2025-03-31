if (!self.define) {
  let e,
    s = {}
  const n = (n, i) => (
    (n = new URL(n + '.js', i).href),
    s[n] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = n), (e.onload = s), document.head.appendChild(e)
        } else (e = n), importScripts(n), s()
      }).then(() => {
        let e = s[n]
        if (!e) throw new Error(`Module ${n} didn’t register its module`)
        return e
      })
  )
  self.define = (i, a) => {
    const c =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (s[c]) return
    let t = {}
    const r = (e) => n(e, c),
      f = { module: { uri: c }, exports: t, require: r }
    s[c] = Promise.all(i.map((e) => f[e] || r(e))).then((e) => (a(...e), t))
  }
}
define(['./workbox-4754cb34'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/app-build-manifest.json',
          revision: 'f44039d57f6db5b13bd26650ea075e79',
        },
        {
          url: '/_next/static/chunks/167-f9278df5b64cd8cd.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/191-c141e6c5421cafae.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/212-02c2a2ec10b89dca.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/238-25008f158b2f7b8a.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/290-51049052c6342fd1.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/341.34f2b76c309db662.js',
          revision: '34f2b76c309db662',
        },
        {
          url: '/_next/static/chunks/368-1b7eae0d6df7c2f4.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/393-748393cba6e9adec.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/446-4549a9424be56802.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/472.a3826d29d6854395.js',
          revision: 'a3826d29d6854395',
        },
        {
          url: '/_next/static/chunks/4bd1b696-8c9bcffb657e83f8.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/558-fadaeebdbd2dc64a.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/655-0d9d5e1a7cdbcc88.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/684-9266f2a39c337707.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/722-0f74b2201dc207dd.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/874-936d692af51badcf.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-7b590b0cfb7a1027.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/auth/login/page-a159139d76df0e67.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/auth/signup/name/page-d7751a35d1d238d7.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/auth/signup/page-fa34a89ac95e04e3.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/auth/signup/password/page-6738c4b85461279f.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/contract/page-ac802e803e6880ca.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/duty/edit/page-68899e577369cec3.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/duty/page-bc54131ecf6188d2.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/group/create/createProfile/page-43d4c03acbef73cd.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/group/create/inviteCode/page-d7483ad06b58542b.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/group/invite/createProfile/page-b8ddb9c17bbd133c.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/group/invite/inviteCode/page-c5d2fbbbedd6ae55.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/layout-9a5d885af38b7eb7.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/lifeRule/page-57e2e4b43753b079.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/lifeRule/update/page-ff33defedd7ba4cd.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/my/page-699f5aab7db8b28a.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/onboarding/blockchain/page-c3b3b60e09fa1fda.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/onboarding/page-0efeb38d77572256.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/app/page-95f7a31298876442.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/framework-be704551803917a8.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/main-app-79b528fc5967fe79.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/main-f6f0e9bb25da613b.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/pages/_app-b7bdcc0fd7b38f6a.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/pages/_error-017c6399e3ac7b72.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-6cf2e7a3cf256622.js',
          revision: 'j1kFZfVq2-B0Lj2eRnTG9',
        },
        {
          url: '/_next/static/css/aeacfa65c4e65cb5.css',
          revision: 'aeacfa65c4e65cb5',
        },
        {
          url: '/_next/static/j1kFZfVq2-B0Lj2eRnTG9/_buildManifest.js',
          revision: '5ddda56e989ced52f77430587b0b5e0e',
        },
        {
          url: '/_next/static/j1kFZfVq2-B0Lj2eRnTG9/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/media/01486af3143d1952-s.p.ttf',
          revision: '8ec7f3e409cb4077a2214938095d8e71',
        },
        {
          url: '/_next/static/media/bee22d9457a2ece7-s.p.ttf',
          revision: 'd77070be3b155c641c94dd7d5b08ddec',
        },
        {
          url: '/_next/static/media/d817efcbb04848e0-s.p.ttf',
          revision: '46513b4410d0504b2ee03f8bbad5c0dc',
        },
        {
          url: '/_next/static/media/da85912baa695379-s.p.ttf',
          revision: '3c1f768d91dbbb160d6db15893acd456',
        },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        {
          url: '/firebase-messaging-sw.js',
          revision: '58397ab2282979b61c53e8ac8683a11c',
        },
        {
          url: '/fonts/Paperlogy-1Thin.ttf',
          revision: 'cdf1281aeef05318b74478786934db58',
        },
        {
          url: '/fonts/Paperlogy-2ExtraLight.ttf',
          revision: 'de9102ba40cbfae6fe9d366278daaf80',
        },
        {
          url: '/fonts/Paperlogy-3Light.ttf',
          revision: 'eca8b9766ff9293fc779970d46385690',
        },
        {
          url: '/fonts/Paperlogy-4Regular.ttf',
          revision: 'd77070be3b155c641c94dd7d5b08ddec',
        },
        {
          url: '/fonts/Paperlogy-5Medium.ttf',
          revision: '8ec7f3e409cb4077a2214938095d8e71',
        },
        {
          url: '/fonts/Paperlogy-6SemiBold.ttf',
          revision: '3c1f768d91dbbb160d6db15893acd456',
        },
        {
          url: '/fonts/Paperlogy-7Bold.ttf',
          revision: '46513b4410d0504b2ee03f8bbad5c0dc',
        },
        {
          url: '/fonts/Paperlogy-8ExtraBold.ttf',
          revision: '1ed90bf603fde6486d39d6ae557c844d',
        },
        {
          url: '/fonts/Paperlogy-9Black.ttf',
          revision: '0191b38561b15ae3d39f7bb5f83f5964',
        },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        {
          url: '/icons/arrow-left.svg',
          revision: 'a43ec35c08ffe65248c1444160772b80',
        },
        {
          url: '/icons/homescreen192.png',
          revision: '92c41331abc4306325a3e314699dd8bb',
        },
        {
          url: '/icons/menu.svg',
          revision: '6fd1e471ec43c4fa36644e07bea72478',
        },
        {
          url: '/icons/nav/nav-contract-active.svg',
          revision: '1f77cf97551ec32e74dc1917baef50d5',
        },
        {
          url: '/icons/nav/nav-contract-inactive.svg',
          revision: '2be65294eac4ead0038e402732d4ef6d',
        },
        {
          url: '/icons/nav/nav-home-active.svg',
          revision: 'c22fc047231670d33c0c5a371f74faf0',
        },
        {
          url: '/icons/nav/nav-home-inactive.svg',
          revision: '2a0088dd49b2427b017d74dbdb91775f',
        },
        {
          url: '/icons/nav/nav-my-active.svg',
          revision: '766a43f346f73f8499af057f8b4f5323',
        },
        {
          url: '/icons/nav/nav-my-inactive.svg',
          revision: 'f7ea8ca1f53629dac7a8c55121209f5a',
        },
        {
          url: '/icons/notice-active.svg',
          revision: '5578119ce5ba606d035d0e04ad4209e5',
        },
        {
          url: '/icons/notice-inactive.svg',
          revision: '7997a03dd0f0b613236cc51f5b40e8f9',
        },
        {
          url: '/icons/plus_circle.svg',
          revision: '9b5ef369c58c0b6352ce33a74541ba6b',
        },
        {
          url: '/icons/update.svg',
          revision: '12fce3faffff1a4b7bd71f1028c56902',
        },
        {
          url: '/icons/validation-false.svg',
          revision: '8106aa24919e74ecde948dce83b0e368',
        },
        {
          url: '/icons/validation-true.svg',
          revision: '4fc134302815eecc360ae72a4f7775b5',
        },
        {
          url: '/images/duty/duty-category-clean.png',
          revision: '0736c1bb3086f91dd6c76c150aad726f',
        },
        {
          url: '/images/duty/duty-category-trash.png',
          revision: '8bce74b3af7ad5ba4d1cf643968736c7',
        },
        {
          url: '/images/lifeRule/delete.svg',
          revision: '2aedd394a1c7654c034a062e194a2418',
        },
        {
          url: '/images/lifeRule/life-rule-category-clean.svg',
          revision: 'f2823d3d9dcd6a891a9385c0fc0d3620',
        },
        {
          url: '/images/lifeRule/move-right.svg',
          revision: '3876dc3c28df4dc640c7157fa8286e7e',
        },
        {
          url: '/images/lifeRule/notice.svg',
          revision: '18fca9d683aa5e6e3e68e731b35404e8',
        },
        {
          url: '/images/lifeRule/update.svg',
          revision: 'e02523523963947a0f6db4d7e43cf761',
        },
        {
          url: '/images/profile/user09.png',
          revision: 'c0440e494bcb4e0b5b1b0e31445dcf1b',
        },
        {
          url: '/images/profile/user1.png',
          revision: '9bac22bc34ee3bdde1ba93501bb69ba5',
        },
        {
          url: '/images/profile/user10.png',
          revision: 'ce5f5f8672f53d916a3e0cef9185af89',
        },
        {
          url: '/images/profile/user2.png',
          revision: '614c70ebeb6ccbf9c1751e9a36615457',
        },
        {
          url: '/images/profile/user3.png',
          revision: 'bde30741f759543125df10dbc0f23933',
        },
        {
          url: '/images/profile/user4.png',
          revision: '241a71f49b7fe76b1a3f57e48c172114',
        },
        {
          url: '/images/profile/user5.png',
          revision: '3b3d2a39c608e769860edf175bf61d26',
        },
        {
          url: '/images/profile/user6.png',
          revision: 'a00db7aaa298b6a4d14bed6789f5663e',
        },
        {
          url: '/images/profile/user7.png',
          revision: '8b4b42ccb666bacef0894bb05775c042',
        },
        {
          url: '/images/profile/user8.png',
          revision: 'd1813b276733b3bb5ba5ab93fd6024aa',
        },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        { url: '/vercel.svg', revision: 'c0af2f507b369b085b35ef4bbe3bcf1e' },
        { url: '/window.svg', revision: 'a2760511c65806022ad20adf74370ff3' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: i,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const s = e.pathname
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    )
})

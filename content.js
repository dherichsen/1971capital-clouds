/* =============================================================================
   1971 CAPITAL — EDITABLE CONTENT
   -----------------------------------------------------------------------------
   ▸ RESEARCH is now AUTOMATIC. New Substack essays appear on the site by
     themselves (pulled live from your RSS feed). You do NOT edit the `posts`
     list below anymore — it's only a safety fallback if the feed is down.

   ▸ MEDIA is manual. This is the ONE place you add a podcast / interview /
     press hit. It's a fill-in-the-blanks template — no coding. To add one:
       1. Copy the line of an existing entry in the `media:` list.
       2. Paste it as the NEW first line (newest goes at the TOP).
       3. Change the values between the quotes:
            date    short date, e.g. 'Jun 2026'
            title   the show / outlet name, or the article headline
            desc    one short line of description
            action  'Listen' (podcast) | 'Watch' (video) | 'Read' (article) | 'View'
            url     full link, in quotes, starting with https://
            image   a cover image URL in quotes — or write `null` for a clean
                    typographic cover (no image needed)
       4. Save. That's it.

   Cover images point at your existing Squarespace CDN and keep working after
   the move. To use your own file instead, drop it in the assets/ folder and set
   image to 'assets/your-file.jpg'.
   ============================================================================= */

const SS = 'https://images.squarespace-cdn.com/content/v1/65c83e9f3108842bd6b22c99/';
const img = (p) => SS + p + '?format=800w';

window.SITE_CONTENT = {

  /* --- RESEARCH (Substack essays) — newest first ------------------------- */
  posts: [
    { date: 'Jul 2026', title: "A Growing Risk to the AI Trade", desc: "Transformational technology, unclear economics.", url: 'https://1971capital.substack.com/p/a-growing-risk-to-the-ai-trade', image: 'https://substackcdn.com/image/fetch/$s_!3xAF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F298e72f0-c670-4544-9f88-20afddd5b875_1168x784.jpeg' },
    { date: 'Apr 2026', title: "Inflation Isn’t Coming Back", desc: "That’s good news for asset prices", url: 'https://1971capital.substack.com/p/inflation-isnt-coming-back', image: img('fabf545e-b753-4534-a581-67cea71f8429/oil.jpg') },
    { date: 'Apr 2026', title: "Bitcoin Update: Is The Bottom In?", desc: "Using position sizing to manage uncertainty", url: 'https://1971capital.substack.com/p/bitcoin-update-is-the-bottom-in', image: img('f8f99fcf-2f79-4e4a-aa84-b3515b80d61c/bitcoin+3.jpg') },
    { date: 'Mar 2026', title: "Part 2: Missiles Over Dubai", desc: "The data has turned, the narrative has not", url: 'https://1971capital.substack.com/p/part-2-missiles-over-dubai', image: img('0143a458-f6cc-4b2f-89bf-97db292b55b2/IMG_5126.jpeg') },
    { date: 'Mar 2026', title: "Missiles Over Dubai", desc: "Why the conflict in the Middle East is likely to persist", url: 'https://1971capital.substack.com/p/missiles-over-dubai', image: img('99c0383f-0d90-48ea-b759-fc00de580d70/missiles+1.jpg') },
    { date: 'Feb 2026', title: "When Stablecoins Aren’t Stable", desc: "Tether and the anatomy of a bank run", url: 'https://1971capital.substack.com/p/when-stablecoins-arent-stable', image: img('7537650d-23f4-4be2-9fe7-37627e730e45/tether+1.jpg') },
    { date: 'Feb 2026', title: "The Investment Case for Coinbase", desc: "Why we’re accumulating Coinbase here, with the stock down nearly 70%", url: 'https://1971capital.substack.com/p/the-investment-case-for-coinbase', image: img('19bae29d-e75b-4460-89fa-d08747b19790/coinbase+11.jpg') },
    { date: 'Feb 2026', title: "What Worked, What Didn’t", desc: "A cross-asset market update and forward outlook", url: 'https://1971capital.substack.com/p/what-worked-what-didnt', image: img('6e03908a-544e-466c-8617-3cae2abac3d1/stock.jpg') },
    { date: 'Feb 2026', title: "Bitcoin: Inflection Point", desc: "Our base case is now for a 50% correction in the price of Bitcoin towards $40k", url: 'https://1971capital.substack.com/p/bitcoin-inflection-point', image: img('bc42cbdc-e8b9-4ed5-b2bd-5ba943dc54e2/bitcoin+5.jpg') },
    { date: 'Jan 2026', title: "Stablecoins", desc: "Reshaping finance and the future of money", url: 'https://1971capital.substack.com/p/stablecoins', image: img('696930b8-b1b7-4720-ae78-2678a776813d/stablecoin+3.jpg') },
    { date: 'Jan 2026', title: "The Most Important Variable Investors Ignore", desc: "Time horizon is a decisive factor in shaping investment outcomes", url: 'https://1971capital.substack.com/p/the-most-important-variable-investors', image: img('f59e1f49-f0d7-47fb-94a4-b1b5e1f8cca9/hour+glass+2.jpg') },
    { date: 'Dec 2025', title: "NOVAGOLD: Deeply Mispriced", desc: "How one gold mining stock could deliver 180% returns", url: 'https://1971capital.substack.com/p/novagold-deeply-mispriced', image: img('54a7052c-eb3c-47f3-9519-5c104677ad8c/mining+tools.jpg') },
    { date: 'Dec 2025', title: "Gold & Silver: Opening Act or Curtain Call?", desc: "Signs the precious metals bull market is entering its final phase", url: 'https://1971capital.substack.com/p/gold-and-silver-opening-act-or-curtain', image: img('880ff34d-9735-40db-a740-2094be14b7ed/gold+2.jpg') },
    { date: 'Dec 2025', title: "Bitcoin: A New Type of Money", desc: "How bitcoin derives its value", url: 'https://1971capital.substack.com/p/bitcoin-a-new-type-of-money', image: img('e8fb63d2-1a60-455f-a772-f589b6915bcf/btc.jpg') },
    { date: 'Dec 2025', title: "The Denominator Effect", desc: "The single most important factor for higher asset prices", url: 'https://1971capital.substack.com/p/the-denominator-effect', image: img('aab8348b-ea98-4d20-bea4-3f4ea36f65fc/dollar.jpg') },
    { date: 'Dec 2025', title: "Uncle Sam Wants You… to Hold His Bag", desc: "The role of gold & bitcoin in modern portfolios", url: 'https://1971capital.substack.com/p/uncle-sam-wants-you-to-hold-his-bag', image: img('74bf0c4d-2b35-46fb-9343-14ab8ac65803/uncle+sam+2.jpg') },
    { date: 'Nov 2025', title: "The Bear Case", desc: "Market technicals suggest near-term caution, while secular trends remain intact", url: 'https://1971capital.substack.com/p/the-bear-case', image: img('64574393-0c55-4ead-84a1-906cdf39888b/bear+3.jpg') },
  ],

  /* --- MEDIA (podcasts, interviews, press) — newest first ---------------- */
  media: [
    { date: 'Apr 2026', title: "Failed Rallies on Good News Suggest a Continued Crypto Bear Market", desc: "CoinMarketCap feature", action: 'Read', url: 'https://coinmarketcap.com/academy/article/macro-news-crypto-markets-rally-clarity-act-us-iran-ceasefire', image: img('c011b0f2-4def-458b-8941-da8f6bf92e5d/IMG_5361.jpeg') },
    { date: 'Jan 2026', title: "Enter the Lionheart Podcast", desc: "Investing and the Goal of Wealth", action: 'Listen', url: 'https://enterthelionheart.com/episodes/', image: img('7283a787-103e-41a5-af4f-6b828f1754d3/lionheart+6.jpg') },
    { date: 'Dec 2025', title: "BitLift Podcast", desc: "Bitcoin weakness is likely to persist short term, but the long-term thesis remains intact", action: 'Listen', url: 'https://bitlift.com/podcast/75-supercycle', image: img('10a1d806-1771-4167-9662-013dc7d33f75/astronaut.jpg') },
    { date: 'May 2025', title: "System 2 Podcast", desc: "Tariffs are a buy-the-dip opportunity", action: 'Watch', url: 'https://youtu.be/-nRW2fWZ2D8?si=vSE5Oajk_8G5bZFu', image: img('a71f42c4-b5a1-4e21-8a58-629e8e87e7fa/Trump.jpg') },
    { date: 'Jan 2025', title: "Cointelegraph Feature", desc: "Why we don’t think the ongoing correction will last long", action: 'Read', url: 'https://cointelegraph.com/news/bitcoin-traders-share-their-pv-p-views-on-btc-s-recent-price-weakness', image: img('7cd88741-64ad-4ec4-afdc-4bcb5b2ca4dd/btc3.jpg') },
    { date: 'Nov 2024', title: "Enter the Lionheart Podcast", desc: "Bitcoin, Gold & the Current Crypto Cycle", action: 'Listen', url: 'https://enterthelionheart.com/163-brian-russ-on-bitcoin-gold-the-current-crypto-cycle/', image: img('5a774063-1ca5-4007-9955-184274af5ba3/lion.jpg') },
    { date: 'Oct 2024', title: "Bitcoin Is One Catalyst Away From $100,000", desc: "Cointelegraph interview on Bitcoin, Ethereum, and precious metals", action: 'Read', url: 'https://cointelegraph.com/news/bitcoin-needs-catalyst-for-100-k-gold-going-higher-eth-still-undervalued-analyst', image: img('52c4c7e1-3c80-4138-8c10-d26d1b80c8cf/dollar4.jpg') },
    { date: 'Oct 2024', title: "Global Macro Breakdown", desc: "BitLift interview", action: 'Watch', url: 'https://bitlift.com/podcast/72-macro-2024', image: img('15815df0-8722-4974-a58a-fdff3e9abde9/earth.jpg') },
  ],

};

# ADPARA Advertising Strategy (ADS.md)

## 1. Targeting Profiles
- **Primary Audience:** Hyper-casual gamers, ages 13-35.
- **Interests:** Retro arcade, idle RPGs, competitive survival, indie tech.
- **Geographic Focus:** Global (Tier 1 optimized for higher CPM).

## 2. Ad Inventory
### Video Interstitials (High Engagement)
- **Placement:** Triggered during state transitions (Game Over, Level Up).
- **Behavior:** 60s cooldown timer. Sets `isAdPending` to avoid mid-game breaks.
- **Revenue Logic:** Rewarded options provide +50 Coins or Revive.

### Static Banners (Persistence)
- **Footer:** Always visible bottom-fixed banner.
- **Pause Menu:** Central banner during inactivity.
- **Game Over:** Adjacent to the "Play Again" button for maximum attention.

## 3. Rewards & Economy
| Action | Reward | Frequency |
| --- | --- | --- |
| Watch Video Ad | 100 Coins | Per Ad |
| Banner Impressions | 1 Coin / min | Ongoing |
| Skip Video Ad | No Reward | - |

## 4. Highest Earning Ad Sites & Networks
To maximize revenue with AdPara, use these recommended networks:
- **Google AdSense / AdMob:** The gold standard for high CPM and reliable payouts. Best for banners and interstitials.
- **Unity Ads:** Specialized for game rewarded videos. Superior fill rates for "Watch for Coins" mechanics.
- **AppLovin (MAX):** Excellent header bidding to ensure you get the highest price for every impression.
- **IronSource:** Strong for hyper-casual game monetization and user acquisition.
- **Meta Audience Network:** High-performance social-style ads. Best for high-engagement rewarding placements and localized content targeting.
- **HighPerformanceFormat:** Active provider for the 468x60 iframe unit (Key: `15d7c92e434af70497d906bd9984b5d7`).
- **Adsterra:** Famous for high-impact social bars and pop-unders. Excellent for "unlocking" content or getting high CPMs on casual web traffic.
- **Yandex Ads:** Essential for global reach, particularly in Eastern Europe and CIS. Features robust SDKs for web games.
- **GameDistribution (Azerion):** A massive aggregator that provides built-in video ads and interstitials specifically for HTML5 games.
- **Clickadu:** A multi-format network with high fill rates for video and push notifications, great for "Partner Stream" links.
- **PropellerAds:** Advanced automation tools for monetization with clean, high-CPM video units.

## 5. Monetization Strategy (Max Profit)
1. **Header/Footer Focus:** Place permanent 728x90 banners in the hub. 
2. **The "10-Link Rotation" Strategy:** Use the "Premium Links" sidebar module to provide 10 unique outbound paths. These are styled as "Partner Streams" to blend with the game-portal aesthetic, significantly increasing CTR.
3. **Escalating Rewards:** First ad gives 100 coins, second gives 150, etc., to keep users watching.
4. **Ad Fatigue Guard:** Limiting auto-ads to 50/day ensures high-value users don't churn, while still capturing $2-$5 EPCM from consistent players.
5. **Loading Screen Interstitials:** Deploy 5-second skippable video ads during level transitions or loading sequences. This minimizes perceived wait time while increasing impression frequency.

## 6. Technical Implementation
- Use `isAdPending` flag to wait for "Core Destroyed" or "Sequence Complete" states.
- Always blur the background to prevent user interaction with the game during an ad.
- Use `z-[999]` to ensure no game elements overlay the ad container.

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

## 5. Monetization Strategy (Max Profit)
1. **Header/Footer Focus:** Place permanent 728x90 banners in the hub. 
2. **The "Blank Link" Hack:** Add "Sponsored Hub" or "Partner Games" links that open high-CPM landing pages in new tabs. These should be styled as part of the core navigation to encourage organic clicks.
3. **Escalating Rewards:** First ad gives 100 coins, second gives 150, etc., to keep users watching.
4. **Ad Fatigue Guard:** Limiting auto-ads to 50/day ensures high-value users don't churn, while still capturing $2-$5 EPCM from consistent players.

## 6. Technical Implementation
- Use `isAdPending` flag to wait for "Core Destroyed" or "Sequence Complete" states.
- Always blur the background to prevent user interaction with the game during an ad.
- Use `z-[999]` to ensure no game elements overlay the ad container.

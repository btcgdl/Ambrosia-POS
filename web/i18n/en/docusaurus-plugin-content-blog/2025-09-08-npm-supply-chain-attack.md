---
title: 'Security Analysis'
authors: jordypirata
tags: [security, npm, javascript, supply-chain]
date: 2025-09-08
---
## NPM Supply Chain Attack and its Impact on Ambrosia
Recently, the JavaScript community has been on alert for a supply-chain attack that has affected dozens of popular packages on the NPM registry.

The attack originated when the NPM account of the developer `qix` was compromised, which allowed the publication of malicious versions of fundamental packages such as `chalk`, `strip-ansi`, and `color-convert`.

<!--truncate-->

## Incident Summary

*   **What happened?** An attacker gained access to a high-reputation NPM developer account and published malicious versions of dozens of packages.
*   **What was the impact?** The affected packages have more than a billion weekly downloads, representing a significant risk to the entire JavaScript ecosystem.
*   **What does the malware do?** The malicious code is a "crypto-clipper". Its goal is to steal cryptocurrencies by intercepting and modifying transactions. It stealthily replaces users' wallet addresses with those of the attackers.
*   **How does it work?** The malware uses two attack vectors:
    1.  **Passive Address Swapping:** If it does not detect a cryptocurrency wallet, it modifies the browser's `fetch` and `XMLHttpRequest` functions to intercept all network requests. Using the Levenshtein distance algorithm, it looks for an attacker's wallet address that is visually similar to the user's to make the change difficult to detect.
    2.  **Active Transaction Hijacking:** If it detects a wallet like MetaMask, it patches its communication methods. When the user is about to sign a transaction, the malware modifies it in memory, changing the recipient's address to the attacker's. If the user does not review it meticulously, they will approve sending funds to the attacker.

## Obfuscated Code: A Red Flag

The malicious code was obfuscated to make it difficult to analyze, but it contained functions with suspicious names like `checkethereumw`.

```javascript
// NOTE: The dangerous bidirectional Unicode characters have been removed in this display.
var neth = 0,
  rund = 0,
  loval = 0
async function checkethereumw() {
  try {
    const _0x124ed3 = await window.ethereum.request({ method: 'eth_accounts' })
    _0x124ed3.length > 0
      ? (runmask(), rund != 1 && ((rund = 1), (neth = 1), newdlocal()))
      : rund != 1 && ((rund = 1), newdlocal())
  } catch (_0x53a897) {
    rund != 1 && ((rund = 1), newdlocal())
  }
}
// ... rest of the malicious code (sanitized)
```
*The original code contained bidirectional Unicode characters to further obfuscate its intent, a technique known as "Trojan Source".*

## Impact on Ambrosia POS: Analysis and Conclusion

Upon learning of this incident, the Ambrosia team conducted an immediate security audit of our dependencies to determine if our project had been compromised.

Our investigation confirmed that Ambrosia POS, through user interface dependencies, uses three of the packages mentioned in the security alerts: `simple-swizzle`, `color-name`, and `color-convert`.

Fortunately, we can confirm the following:

1.  **Non-Vulnerable Versions:** The versions of these packages used in our project **are not the compromised versions**.
    *   `simple-swizzle`: We use version `0.2.2`. The malicious version was `0.2.3`.
    *   `color-name`: We use version `1.1.4`. The malicious version was `2.0.1`.
    *   `color-convert`: We use version `2.0.1`. The malicious version was `3.1.1`.

2.  **Packages Removed:** The NPM security team acted quickly and, in collaboration with the maintainers, removed the malicious versions from the registry.

**In conclusion, the Ambrosia POS project has not been affected by this supply chain attack. No action is required from developers or users.**

This incident underscores the importance of constant vigilance in the open-source ecosystem. We will continue to apply the best security practices to protect the integrity of our software.

## More Information

For a detailed technical analysis of the attack, you can consult the post by [Aikido Security](https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised).
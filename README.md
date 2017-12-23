# HODLCoin

HODLCoin is a simple ERC20 coin that rewards hodlers.

Anyone can deposit ether into the contract by calling `deposit()` or sending ether directly to its address. They are rewarded with HODL tokens proportional to the amount of ether they sent, less a small (max 2%) deposit fee. Since they are only given 98% of their Ether's value in tokens, the remaining 2% is evenly distributed amongst existing HODLers, slightly inflating the value of their tokens. If the deposit is large compared to the current quantity of issued tokens, the fee is smaller - for instance, depositing as much ether as was already in the contract results in a net fee of approximately 1%.

HODLCoins are initially issued at 100 per 1 ether, but this rate decreases (and the value of an individual HODLCoin appreciates) as people deposit funds. HODLCoin has 18 decimal places, just like Ether.

Anyone can withdraw their tokens for full value at any time, by calling `withdraw` with the number of (base unit) tokens they wish to withdraw. There are no withdrawal fees. As a result, the maximum loss for someone depositing a small amount then immediately withdrawing it is 2%, plus gas fees.

The `value()` function exists for convenience in calculating the value of your HODLings; call it with a number of (base unit) tokens to determine how many wei you would get for them by calling `withdraw()`.

This token was a fun holiday (hodliday?) project; it is simple but lightly audited and may contain bugs. No warranties express or implied are offered.

const PRELOADER_INTERVAL = 1000;

const PRELOADER_RAMBLINGS = [
  "Putting your nose to the grindstone",
  "Picking you up by your bootstraps",
  "Shoveling coal",
  "Consuming fossil fuels",
  "Notifying your FBI agent",
].map((rambling) =>
  rambling
    .split(" ")
    .map((word) =>
      word.length > 2
        ? `${word[0].toUpperCase() + word.substring(1, word.length)}`
        : word
    )
    .join(" ")
);

let _ellipsisCount = 0;
let _currentRamble =
  PRELOADER_RAMBLINGS[Math.floor(Math.random() * PRELOADER_RAMBLINGS.length)];
const preloaderInterval = setInterval(() => {
  const preloaderRambleTextElement = document.getElementById(
    "preloader-rambling-text"
  );
  const preloaderLoadingTextElement = document.getElementById(
    "preloader-loading-text"
  );
  if (preloaderRambleTextElement && preloaderLoadingTextElement) {
    if (_ellipsisCount === 4) {
      _currentRamble =
        PRELOADER_RAMBLINGS[
          Math.floor(Math.random() * PRELOADER_RAMBLINGS.length)
        ];
      _ellipsisCount = 0;
    }
    preloaderRambleTextElement.innerText = _currentRamble;
    preloaderLoadingTextElement.innerText = `[LOADING${".".repeat(
      _ellipsisCount++
    )}]`;
  } else clearInterval(preloaderInterval);
}, PRELOADER_INTERVAL);

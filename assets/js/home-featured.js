(() => {
  const roots = document.querySelectorAll("[data-home-featured]");
  if (roots.length === 0) return;

  const storageKey = "clear-home-featured-selection";
  const selectionSize = 3;
  const cardWeight = (card) => Math.max(1, Number.parseInt(card.dataset.featureWeight, 10) || 1);

  const getPreviousSelection = () => {
    try {
      return window.sessionStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const rememberSelection = (signature) => {
    try {
      window.sessionStorage.setItem(storageKey, signature);
    } catch {
      // The carousel still works when browser storage is unavailable.
    }
  };

  const combinationsOf = (items, count, start = 0, picked = [], results = []) => {
    if (picked.length === count) {
      results.push([...picked]);
      return results;
    }

    for (let index = start; index <= items.length - (count - picked.length); index += 1) {
      picked.push(items[index]);
      combinationsOf(items, count, index + 1, picked, results);
      picked.pop();
    }
    return results;
  };

  const signatureFor = (cards) =>
    cards
      .map((card) => card.dataset.featureId)
      .sort()
      .join("|");

  const selectWeightedCombination = (combinations) => {
    const weighted = combinations.map((cards) => ({
      cards,
      weight: cards.reduce((total, card) => total * cardWeight(card), 1),
    }));
    const totalWeight = weighted.reduce((total, item) => total + item.weight, 0);
    let position = Math.floor(Math.random() * totalWeight);

    for (const item of weighted) {
      if (position < item.weight) return item.cards;
      position -= item.weight;
    }
    return weighted[0].cards;
  };

  const shuffled = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  };

  roots.forEach((root) => {
    const allCards = Array.from(root.querySelectorAll("[data-feature-slide]"));
    const track = root.querySelector("[data-feature-track]");
    const viewport = root.querySelector("[data-feature-viewport]");
    const controls = root.querySelector("[data-feature-controls]");
    const previousButton = root.querySelector("[data-feature-previous]");
    const nextButton = root.querySelector("[data-feature-next]");
    if (allCards.length === 0 || !track || !viewport) return;

    const count = Math.min(selectionSize, allCards.length);
    const combinations = combinationsOf(allCards, count);
    const uniqueTopicCombinations = combinations.filter(
      (cards) => new Set(cards.map((card) => card.dataset.featureKey)).size === cards.length,
    );
    const pool = uniqueTopicCombinations.length > 0 ? uniqueTopicCombinations : combinations;
    const previousSelection = getPreviousSelection();
    const freshPool = pool.filter((cards) => signatureFor(cards) !== previousSelection);
    const selectedCards = shuffled(selectWeightedCombination(freshPool.length > 0 ? freshPool : pool));
    const selectedSet = new Set(selectedCards);

    allCards.forEach((card) => {
      card.hidden = !selectedSet.has(card);
      card.setAttribute("aria-hidden", String(!selectedSet.has(card)));
    });
    selectedCards.forEach((card, index) => {
      card.hidden = false;
      card.setAttribute("aria-hidden", "false");
      card.setAttribute("aria-posinset", String(index + 1));
      card.setAttribute("aria-setsize", String(selectedCards.length));
      track.append(card);
    });
    rememberSelection(signatureFor(selectedCards));

    const updateControls = () => {
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      if (previousButton) previousButton.disabled = viewport.scrollLeft <= 2;
      if (nextButton) nextButton.disabled = viewport.scrollLeft >= maxScroll - 2;
    };

    const scrollByCard = (direction) => {
      const firstCard = selectedCards[0];
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      const distance = firstCard.getBoundingClientRect().width + gap;
      viewport.scrollBy({ left: direction * distance, behavior: "smooth" });
    };

    if (controls) controls.hidden = selectedCards.length < 3;
    previousButton?.addEventListener("click", () => scrollByCard(-1));
    nextButton?.addEventListener("click", () => scrollByCard(1));
    viewport.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);

    viewport.scrollLeft = 0;
    window.requestAnimationFrame(updateControls);
  });
})();

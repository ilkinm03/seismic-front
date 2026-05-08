export function scrollIntoNearestContainer(element: HTMLElement) {
  let parent = element.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const canScrollY =
      /(auto|scroll|overlay)/.test(style.overflowY) &&
      parent.scrollHeight > parent.clientHeight;

    if (canScrollY) {
      const parentRect = parent.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      parent.scrollTo({
        top:
          parent.scrollTop +
          elementRect.top -
          parentRect.top -
          parent.clientHeight / 2 +
          elementRect.height / 2,
        behavior: "smooth",
      });
      return;
    }

    parent = parent.parentElement;
  }

  element.scrollIntoView({ behavior: "smooth", block: "center" });
}

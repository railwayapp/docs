export const scrollToID =
  (input: string, skipScroll: boolean = false) =>
  (event: React.MouseEvent) => {
    // if input is a string with #, then split it and take the last element
    // if input is not a string with #, then take the input
    // this is needed because the input can be a relative path such as "/quick-start#deploying-your-project---from-github"
    const splitInput = input.split("#");

    // if input links to a different page, then don't scroll, let the browser navigate to the path
    if (
      splitInput.length === 2 &&
      splitInput[0] &&
      splitInput[0] !== window.location.pathname
    ) {
      return;
    }

    const slug = splitInput[1] || input;

    if (!slug) return;

    const element = document.getElementById(slug);

    if (!element) return;

    event.preventDefault();

    history.pushState(null, "", `#${slug}`);

    if (skipScroll) return;

    element.scrollIntoView({ behavior: "smooth" });
  };

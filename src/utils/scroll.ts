export const scrollToID =
  (input: string, skipScroll: boolean = false) =>
  (event: React.MouseEvent) => {
    // if input is a string with #, then split it and take the last element
    // if input is not a string with #, then take the input
    // this is needed because the input can be a relative path such as "/quick-start#deploying-your-project---from-github"
    const id = input.split("#")[1] || input;

    if (!id) return;

    const element = document.getElementById(id);

    if (!element) return;

    event.preventDefault();

    history.pushState(null, "", `#${id}`);

    if (skipScroll) return;

    element.scrollIntoView({ behavior: "smooth" });
  };

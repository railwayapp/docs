export const scrollToID =
  (input: string, skipScroll: boolean = false) =>
  (event: React.MouseEvent) => {
    const id = input.replace(/^#/, "");

    if (!id) return;

    const element = document.getElementById(id);

    if (!element) return;

    event.preventDefault();

    history.pushState(null, "", `#${id}`);

    if (skipScroll) return;

    element.scrollIntoView({ behavior: "smooth" });
  };

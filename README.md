# 📚 Railway Documentation

Visit [docs.railway.app](https://docs.railway.app)

![og](https://railway.app/og.png)

## 💡 About

This is the place where all the documentation about Railway is hosted. Contributions are welcome! Change the markdown, make a pull request, and we'll merge it! Deploys will happen automagically cause the docs are hosted on Railway

## 🧑‍🔬 Contributing

This is a [NextJS](https://nextjs.org) project.

Develop with

```bash
npm run dev
# or
yarn dev
```

Open [localhost:3001](http://localhost:3001) to see the result

## Using Vale Locally

We've added a small GitHub Action that lints our documentation. It uses an app called [Vale](https://vale.sh). Vale is great, and you can use it locally to analyse your contributions for spelling mistakes and much more. Here is how to use it:

1) clone this repo
2) make sure [Vale is installed](https://vale.sh) locally
3) from this project's root directory, run `vale ./src/docs/`

If you want to test with more rules, modify the configuration file `vale.ini` and the `styles` directory inside the `.github` directory. Reference the [Vale docs](https://vale.sh) for more info.

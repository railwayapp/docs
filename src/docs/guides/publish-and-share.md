---
title: Publish and Share Templates
---

Once you create a template, you have the option to publish it. Publishing a template will add it to our <a href="https://railway.app/templates" target="_blank">template marketplace</a> for other users to deploy.

## Publishing a Template

After you create your template, simply click the publish button and fill out the form to publish your template.

<Image src="https://res.cloudinary.com/railway/image/upload/v1680281251/CleanShot_2023-03-31_at_20.46.28_2x_tjjpna.png"
  alt="Template publishing form"
  layout="intrinsic"
  width={510}
  height={800}
  quality={80}
/>

You can always publish your template by going to the <a href="https://railway.app/account/templates" target="_blank">Templates page in Account Settings</a> and choose `Publish` next to the template you'd like to publish.

## Sharing your Templates

After you create your template, you may want to share your work with the public and let others clone your project.  You are provided with the Template URL where your template can be found and deployed. 

### Deploy on Railway Button 

To complement your template, we also provide a `Deploy on Railway` button which you can include in your README or embed it into a website.

<Image src="https://res.cloudinary.com/railway/image/upload/v1676438967/docs/deploy-on-railway-readme_iwcjjw.png" width={714} height={467} alt="Example README with Deploy on Railway button" />

![https://railway.app/button.svg](https://railway.app/button.svg)
The button is located at [https://railway.app/button.svg](https://railway.app/button.svg).

#### Markdown
To render the button in Markdown, copy the following code and replace the link with your desired template:
```md
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/ZweBXA)
```

#### HTML
To render the button in HTML, copy the following code and replace the link with your desired template:
```html
<a href="https://railway.app/new/template/ZweBXA"><img src="https://railway.app/button.svg" alt="Deploy on Railway" /></a>
```

### Examples

Here are some example templates from the <a href="https://railway.app/templates" target="_blank">template marketplace</a> in button form:
|Icon|Template|Button|
|----|--------|------|
|<img src="https://devicons.railway.app/i/nodejs.svg" alt="Node" width="25" height="25" />|Node|[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/ZweBXA)|
|<img src="https://devicons.railway.app/i/deno.svg" alt="Deno" width="25" height="25" />|Deno|[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/LsaSsU)|
|<img src="https://devicons.railway.app/i/bun.svg" alt="Bun" width="25" height="25" />|Bun|[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/gxxk5g)|
|<img src="https://devicons.railway.app/i/go.svg" alt="Gin" width="25" height="25" />|Gin|[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/dTvvSf)|
|<img src="https://devicons.railway.app/i/flask-dark.svg" alt="Flask" width="25" height="25" />|Flask|[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/zUcpux)|


## Kickback program

If your published template is deployed into other users' projects, you are immediately eligible for a 25% kickback, in the form of Railway credits.  Refer to the [template reference page](/reference/templates#kickback-program) for more information.
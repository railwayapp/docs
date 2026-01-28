---
title: Publish and Share Templates
description: Learn how to publish and share your Railway templates.
---

Once you create a template, you have the option to publish it. Publishing a template will add it to our <a href="https://railway.com/templates" target="_blank">template marketplace</a> for other users to deploy.

## Publishing a Template

After you create your template, simply click the publish button and fill out the form to publish your template.

<Image src="https://res.cloudinary.com/railway/image/upload/v1753243835/docs/reference/templates/mockup-1753242978376_skjt7w.png"
  alt="Template publishing form"
  layout="intrinsic"
  width={2004}
  height={3834}
  quality={80}
/>

You can always publish your template by going to the <a href="https://railway.com/workspace/templates" target="_blank">Templates page in your Workspace settings</a> and choose `Publish` next to the template you'd like to publish.

Optionally, you can add a demo project to your template. This will be used to showcase your template in a working project, and can be accessed by clicking on the `Live Demo` button in the template's overview page.

## Sharing your Templates

After you create your template, you may want to share your work with the public and let others clone your project. You are provided with the Template URL where your template can be found and deployed.

### Deploy on Railway Button

To complement your template, we also provide a `Deploy on Railway` button which you can include in your README or embed it into a website.

<Image src="https://res.cloudinary.com/railway/image/upload/v1676438967/docs/deploy-on-railway-readme_iwcjjw.png" width={714} height={467} alt="Example README with Deploy on Railway button" />

![https://railway.com/button.svg](https://railway.com/button.svg)
The button is located at [https://railway.com/button.svg](https://railway.com/button.svg).

#### Markdown

To render the button in Markdown, copy the following code and replace the template code with your desired template. If you'd like to help us attribute traffic to your template, replace `utm_campaign=generic` in the URL with your template name.

```md
[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/ZweBXA?utm_medium=integration&utm_source=button&utm_campaign=generic)
```

#### HTML

To render the button in HTML, copy the following code and replace the template code with your desired template. If you'd like to help us attribute traffic to your template, replace `utm_campaign=generic` in the URL with your template name.

```html
<a
  href="https://railway.com/new/template/ZweBXA?utm_medium=integration&utm_source=button&utm_campaign=generic"
  ><img src="https://railway.com/button.svg" alt="Deploy on Railway"
/></a>
```

### Examples

Here are some example templates from the <a href="https://railway.com/templates" target="_blank">template marketplace</a> in button form:
|Icon|Template|Button|
|:--:|:------:|:----:|
|<img src="https://devicons.railway.com/i/nodejs.svg" alt="Node" width="25" height="25" />|Node|[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/ZweBXA?utm_medium=integration&utm_source=button&utm_campaign=node)|
|<img src="https://devicons.railway.com/i/deno.svg" alt="Deno" width="25" height="25" />|Deno|[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/LsaSsU?utm_medium=integration&utm_source=button&utm_campaign=deno)|
|<img src="https://devicons.railway.com/i/bun.svg" alt="Bun" width="25" height="25" />|Bun|[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/gxxk5g?utm_medium=integration&utm_source=button&utm_campaign=bun)|
|<img src="https://devicons.railway.com/i/go.svg" alt="Gin" width="25" height="25" />|Gin|[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/dTvvSf?utm_medium=integration&utm_source=button&utm_campaign=gin)|
|<img src="https://devicons.railway.com/i/flask-dark.svg" alt="Flask" width="25" height="25" />|Flask|[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/zUcpux?utm_medium=integration&utm_source=button&utm_campaign=flask)|

## Kickback Program

If your published template is deployed into other users' projects, you are eligible for kickbacks based on your support engagement. Learn more about the [kickback program](/reference/templates#kickback-program).

## Template Verification

Templates are verified when the creator and maintainer of the technology becomes a partner and reviews the template.

If you are or have a relationship with the creator, please reach out to us by submitting the form on our [partners page](https://railway.com/partners).

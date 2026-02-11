[style.css](https://github.com/user-attachments/files/25241773/style.css)
[reset_password.php](https://github.com/user-attachments/files/25241772/reset_password.php)
[register.php](https://github.com/user-attachments/files/25241771/register.php)
[orders.php](https://github.com/user-attachments/files/25241770/orders.php)
[logout.php](https://github.com/user-attachments/files/25241769/logout.php)
[login.php](https://github.com/user-attachments/files/25241768/login.php)
[index.php](https://github.com/user-attachments/files/25241767/index.php)
[helpers.php](https://github.com/user-attachments/files/25241766/helpers.php)
[forgot_password.php](https://github.com/user-attachments/files/25241765/forgot_password.php)
[edit_product.php](https://github.com/user-attachments/files/25241764/edit_product.php)
[db_migrations.sql](https://github.com/user-attachments/files/25241763/db_migrations.sql)
[db.php](https://github.com/user-attachments/files/25241762/db.php)
[contacts.php](https://github.com/user-attachments/files/25241761/contacts.php)
[checkout.php](https://github.com/user-attachments/files/25241760/checkout.php)
[cart.php](https://github.com/user-attachments/files/25241759/cart.php)
[admin.php](https://github.com/user-attachments/files/25241758/admin.php)
---
title: Builds
description: Understand Railway's build concepts.
---

Let's customize the build process.

Railway will build and deploy your code with zero configuration, but we make it easy to override this behavior as needed. Now that you're warmed up, let's take a look at how you can adjust how your services are built.

The goal of this section is to guide you through the various ways to customize the build process.

#### Build concepts

|                         |                                                                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Railpack**            | <a href="https://railpack.com" target="_blank">Railpack</a> analyzes your code and generates optimized container images. |
| **Nixpacks**            | <a href="https://nixpacks.com/docs" target="_blank">Nixpacks</a> is a legacy builder. (Deprecated) |
| **Build Configuration** | Railway provides several ways to configure the build process to produce the desired result. If necessary, you have control over the build command, which root directory to build from, when to trigger a build, etc.      |
| **Dockerfiles**         | Dockerfiles welcome! If you already have a build defined in a Dockerfile within your code repository, Railway will automatically use it to build your service.                                                            |

The following pages will guide you through how to interact with these controls.

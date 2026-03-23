---
layout: post
title: Deploy a Shopify theme to multiple stores from a single repository
date: 2026-03-23 21:28:22.313771392 +0000
description: How to deploy a Shopify theme to multiple stores from a single repository without overwriting content on each store.
tags: [shopify, theme development, github actions, ci/cd]
---

## The problem

Sometimes we want the same theme code deployed to multiple stores. For example, you might have a live store and a staging store, or you might have multiple live stores for different regions that all use the same theme code but have different content.

This is not possible using the [native Shopify GitHub integration](https://shopify.dev/docs/storefronts/themes/tools/github){:target="_blank" :rel="noopener"}. This is because the native integration only allows you to connect one store to a GitHub repository. 

Even if you could connect multiple stores, changing the content on one store would push that change back to the repository and then that change would be deployed to all the other stores, in most cases this is not desirable as it doesn't allow you to have different content on each store.

## The solution

Instead of using the native Shopify GitHub integration, we can use the Shopify CLI in a CI/CD pipeline (in this case, GitHub Actions) to deploy to multiple stores. This allows us to deploy the same theme code to multiple stores without overwriting the content on each store.

## Setup

This guide is for theme code hosted on GitHub.

The first step, if it's in use, is to disconnect the store from the GitHub repository in the Shopify admin.

Next you will need to install the [Shopify Theme Access app](https://apps.shopify.com/theme-access){:target="_blank" :rel="noopener"} on each store and generate a password for each store. This effectively gives you an API key with permissions to theme_read and theme_write.

Save these passwords in [GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets){:target="_blank" :rel="noopener"}, for example you could name them `STORE_1_PASSWORD`, `STORE_2_PASSWORD`, etc.

Once you have your secrets set up, you can set up a GitHub Actions workflow to deploy to multiple stores. Create a new yaml file in your repository's `.github/workflows` directory. e.g. `.github/workflows/deploy-theme.yml`

You can use the following workflow as a starting point:

```yaml
name: Deploy theme
on: 
  workflow_dispatch:
  push:
    branches: [ main ]
env:
  FLAGS: --ignore config/settings_data.json --ignore templates/*.json --ignore locales/* --ignore sections/*.json
jobs:
  deploy:
    name: Deploy ${{ matrix.name }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - name: "Store 1"
            theme_id: 000000000000
            store: store1
            secret: STORE_1_PASSWORD
            use_flags: true
          - name: "Store 2"
            theme_id: 000000000000
            store: store2
            secret: STORE_2_PASSWORD
            use_flags: true
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - name: Install Shopify CLI
        run: npm install -g @shopify/cli
      - name: Deploy theme
        run: |
          shopify theme push \
            --allow-live \
            --nodelete \
            --theme ${{ matrix.theme_id }} \
            --store ${{ matrix.store }} \
            ${{ matrix.use_flags && env.FLAGS || '' }} \
            --password ${{ secrets[matrix.secret] }}
```

This flow is triggered either on a push to the `main` branch or manually through the GitHub Actions interface. It will deploy the theme to each store defined in the matrix, using the corresponding password from the secrets.

For each store, you must make sure the configuration in the `matrix` is correct:

- `theme_id`: The ID of the theme you want to deploy to on that store. You can find this in the URL when editing the theme in the Shopify admin.
- `store`: The myshopify domain of the store, without the `.myshopify.com` part. e.g. if your store is `example-store.myshopify.com`, you would put `example-store` here.
- `secret`: The name of the GitHub secret where you stored the password for that store.

Once this file is set up and pushed to the repository, the workflow will run and deploy the theme to each store. You can check the progress and results of the workflow in the GitHub Actions tab of your repository.

## Further explanation

The `FLAGS` environment variable is used to specify which files to ignore during deployment. In this example, we are ignoring `config/settings_data.json`, all JSON templates, all JSON locales, and all JSON sections. This allows us to deploy the same theme code to multiple stores without overwriting the content on each store, as these files often contain store-specific content. At the time of writing, these are the only files that are written to from changes made in the Shopify admin.

Within the store `matrix`, `use_flags` is a boolean value that determines whether to use the `FLAGS` environment variable. This is useful if you want to deploy to some stores with the flags and some without. For example, you might want to deploy to a staging store without the flags so that you can test changes to content before deploying those changes to the live store with the flags enabled.
---
layout: post
title: How to enable Qwant search and suggestions on Firefox Android
date: 2025-08-27 18:48:00.000000000 +01:00
---

<style type="text/css">
  .main-content img {
    max-width: min(65vw, 320px);
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>

In Firefox open the settings menu by tapping the three-dot icon in the bottom right corner, then select **Settings**. Scroll down to the **Search** section and tap on it. Tap on **Manage alternative search engines** and then **Add Engine**. Here you can add Qwant as a search engine and enable search suggestions using the following settings:

**Name**:

```
Qwant
```

**Search string URL**:

```
https://www.qwant.com/?q=%s
```

**Suggestion suggestion API (optional)**:

```
https://api.qwant.com/v3/suggest?q=%s
```

Once you are done, tap on **Save** to apply the changes. You can now use Qwant for your searches in Firefox Mobile. You can also make Qwant the default search engine by selecting it under the **Default Search Engine** setting.

Here is a screenshot of the complete configuration:

![Qwant Search Configuration in Firefox Android](/images/2025/08/27/qwant-firefox-mobile-android-search-suggestions-settings.png)

Here is what suggestions look like when using Qwant in the browser, the Qwant icon is loaded automatically:

![Qwant Suggestions in Firefox Android](/images/2025/08/27/qwant-firefox-mobile-android-search-suggestions.png)
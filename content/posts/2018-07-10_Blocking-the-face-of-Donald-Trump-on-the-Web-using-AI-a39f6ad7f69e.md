---
title: Blocking the face of Donald Trump on the Web using AI
description: >-
  Recently my employer Adblock Plus was having an annual Summer Team Week. Being
  a mostly distributed company it is a great opportunity to…
date: '2018-07-10T19:39:29.648Z'
categories: []
keywords: []
slug: /@shoniko/blocking-the-face-of-donald-trump-on-the-web-using-ai-a39f6ad7f69e
---

![](/images/1__lt3lFQRZgxww1OY0h7WXXw.png)

Recently my employer [Adblock Plus](https://medium.com/u/ec2706a38f84) was having an annual Summer Team Week. Being a mostly distributed company it is a great opportunity to socialize and meet people you work with, but never get to see in real life.

As it often happens in these cases after some amount of social activities I overheard someone jokingly suggesting that us being a company which has this goal of “putting you in charge of a fair and profitable Web”, we can just block the face of Donald Trump using some machine learning techniques. Because someone might want to do that :) Challenge accepted, I thought.

As luck would have it I was just recently reading about the release of [face-api.js](https://github.com/justadudewhohacks/face-api.js) — JavaScript API for Face Recognition in the Browser with tensorflow.js. Armed with that, I quickly hacked together an extension that just goes through all the images in a web page and runs face-api.js inference on them. That all was easier than expected, however I discovered that some images cannot be retrieved for inference because of something called “[Canvas Tainting](https://stackoverflow.com/questions/22710627/tainted-canvases-may-not-be-exported)”. Essentially there is a security policy on image data, which guarantees that only scripts from the domain which loaded the image can access the image data.

After a quick brainstorm I have resorted to loading a separate copy of an image from the background script, which shouldn’t be a big deal, as in most cases the images are cached anyway. With that change the extension started working. However since face recognition using a neural network is pretty resource intensive on some web pages the face recognition took way too long. So I enforced an artificial limit on the size of an image that extension would run inference on — dimensions larger than 150px. Thinking is that anything smaller than that doesn’t really matter much anyway.

Next, I had to compare the extracted face features to features of the face of Donald Trump. For that I have bundled an [official portrait](https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg) within the extension and just extracted the features from it when the extension initializes. This means that in theory any face can be targeted, just replace the \`[icons/detailed/Donald\_Trump\_official\_portrait.jpg](https://github.com/shoniko/trumpblock/blob/master/icons/detailed/Donald_Trump_official_portrait.jpg)\` with your reference image. And since the \`carrot\` image is also easily replaceable the extension can be taken to a lot of different directions. For example I have [heard](https://news.sky.com/story/china-censors-winnie-the-pooh-social-media-posts-amid-xi-criticism-11270677) president Xi of China especially enjoys being compared to Winnie the Pooh ;)

So there it is — [Trump Face Block](https://chrome.google.com/webstore/detail/trump-face-block/jhdiboefiphoflmekjffaccgbhachicn), available now on [Chrome Web Store](https://chrome.google.com/webstore/detail/trump-face-block/jhdiboefiphoflmekjffaccgbhachicn) and on [GitHub](https://github.com/shoniko/trumpblock).
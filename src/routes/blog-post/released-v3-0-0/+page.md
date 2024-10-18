---
title: Released version v3.0.0
slug: released-v3-0-0
coverImage: /images/posts/released-v3-0-0/team.png
date: 2024-10-03T11:05:14.597Z
updated: 2024-10-03T11:05:14.597Z
excerpt: We’re thrilled to announce the official release of version 3.0.0 of the Torrust software.
contributor: Jose Celano
contributorSlug: jose-celano
tags:
  - Announcement
  - Release
hidden: false
---

<script>
  import Callout from "$lib/components/molecules/Callout.svelte";
  import CodeBlock from "$lib/components/molecules/CodeBlock.svelte";
  import Image from "$lib/components/atoms/Image.svelte";
  import PostBody from "$lib/components/molecules/PostBody.svelte";
  import PostContainer from "$lib/components/molecules/PostContainer.svelte";
  import PostTable from "$lib/components/molecules/PostTable.svelte";
  import TableOfContents from '$lib/components/atoms/TableOfContents.svelte';

  let sections = [
    { name: "Introduction", id: "introduction" },
    { name: "A Unified Tracker and Index Release", id: "a-unified-tracker-and-index-release" },
    { name: "Roadmap for the Future", id: "roadmap-for-the-future" },
    { name: "Special Thanks", id: "special-thanks" }
  ]

  let activeSection = '';
</script>

<PostContainer>
<PostTable>

## Table of contents

<TableOfContents {sections} {activeSection} />

</PostTable>

<PostBody>

## Introduction

We’re thrilled to announce the official release of version **3.0.0** of the Torrust software! This marks a new milestone in our journey, bringing together Tracker and Index into a unified, cohesive release. After several beta iterations and invaluable feedback from the community, we’ve reached this significant moment.

## A Unified Tracker and Index Release

The goal of this release was to ensure consistent and homogeneous versions across all packages that make up the Tracker + Index solution. Version 3.0.0 sets the foundation for further developments, offering a reliable, modern system.

## Roadmap for the Future

This release is just the beginning. We’ll now focus on reviewing the roadmap to introduce more features and improvements to Torrust. Our aim is to continue enhancing the platform and building even better tools for the BitTorrent ecosystem.

We invite the community to be part of this journey by contributing ideas, reporting bugs, and helping shape the next phase of our project. The discussions around the future roadmap are open on our GitHub discussions page.

## Special Thanks

A heartfelt thank you to everyone who contributed to the development of this release. Your dedication, feedback, and hard work have made this possible, and we look forward to continued collaboration in the future.

</PostBody>
</PostContainer>

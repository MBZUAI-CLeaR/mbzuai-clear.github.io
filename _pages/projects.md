---
layout: page
title: Projects
permalink: /projects/
description: Research and engineering projects that turn causal ideas into methods, benchmarks, and real-world systems.
nav: true
nav_order: 3
page_class: projects-page
display_categories: [Academic Research, Engineering]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  {% assign category_slug = category | slugify %}
  <section class="project-category" aria-labelledby="{{ category_slug }}">
    <div class="project-category__header">
      <h2 id="{{ category_slug }}" class="category"><a href="#{{ category_slug }}">{{ category }}</a></h2>
      <p class="project-category__status">
        {% if sorted_projects.size > 0 %}
          {{ sorted_projects.size }} project{% unless sorted_projects.size == 1 %}s{% endunless %}
        {% else %}
          In development
        {% endif %}
      </p>
    </div>
  <!-- Generate cards for each project -->
  {% if sorted_projects.size == 0 %}
    <p class="projects-empty">Engineering initiatives will appear here as they launch.</p>
  {% elsif page.horizontal %}
  <div class="container">
    <div class="row row-cols-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="grid">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  </section>
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="grid">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>

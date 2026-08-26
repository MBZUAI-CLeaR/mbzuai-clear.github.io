---
layout: page
title: Working Groups
nav_title: Groups
permalink: /groups/
description: Research communities exploring focused questions across causal learning, reasoning, and AI.
nav: true
nav_order: 4
page_class: groups-page
---

{% assign working_groups = site.data.working_groups | sort: "order" %}

<div class="working-groups" aria-label="CLeaR working groups">
  {% for group in working_groups %}
    <article class="group-card">
      <div class="group-card__identity" aria-hidden="true">
        <span class="group-card__initials">{{ group.initials }}</span>
        <span class="group-card__eyebrow">Working group</span>
      </div>

      <div class="group-card__content">
        <div class="group-card__meta">
          <span class="group-card__status"><span class="group-card__status-dot"></span>{{ group.status }}</span>
          {% if group.cadence %}
            <span>{{ group.cadence }}</span>
          {% endif %}
        </div>

        <h2 class="group-card__title">
          <a href="{{ group.url }}" target="_blank" rel="noopener noreferrer">{{ group.name }}</a>
        </h2>
        <p class="group-card__description">{{ group.description }}</p>

        {% if group.tags %}
          <ul class="group-card__tags" aria-label="Research themes">
            {% for tag in group.tags %}
              <li>{{ tag }}</li>
            {% endfor %}
          </ul>
        {% endif %}

        <a class="group-card__link" href="{{ group.url }}" target="_blank" rel="noopener noreferrer">
          Visit group site <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </article>
  {% endfor %}
</div>

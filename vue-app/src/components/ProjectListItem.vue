<template>
  <div class="project-item">
    <router-link
      class="project-image"
      :to="{ name: 'project', params: { address: project.address }}"
    >
      <img :src="project.imageUrl" :alt="project.name">
    </router-link>
    <div class="project-info">
      <router-link
        class="project-name"
        :to="{ name: 'project', params: { address: project.address }}"
      >
        {{ project.name }}
      </router-link>
      <div class="project-description">{{ project.description }}</div>
      <button
        v-if="!inCart"
        class="btn contribute-btn"
        :disabled="!canContribute()"
        @click="contribute(project)"
      >
        Contribute
      </button>
      <button
        v-else
        class="btn btn-inactive in-cart"
      >
        <img src="@/assets/checkmark.svg" />
        <span>In cart</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import { DEFAULT_CONTRIBUTION_AMOUNT, CART_MAX_SIZE, CartItem } from '@/api/contributions'
import { Project } from '@/api/projects'
import { ADD_CART_ITEM } from '@/store/mutation-types'

@Component
export default class ProjectListItem extends Vue {
  @Prop()
  project!: Project;

  get inCart(): boolean {
    const index = this.$store.state.cart.findIndex((item: CartItem) => {
      return item.address === this.project.address
    })
    return index !== -1
  }

  canContribute(): boolean {
    return (
      this.$store.state.currentUser &&
      this.$store.state.currentRound &&
      !this.project.isRemoved &&
      this.$store.state.cart.length < CART_MAX_SIZE
    )
  }

  contribute(project: Project) {
    this.$store.commit(ADD_CART_ITEM, {
      ...project,
      amount: DEFAULT_CONTRIBUTION_AMOUNT.toString(),
    })
  }
}
</script>

<style scoped lang="scss">
@import '../styles/vars';

.project-item {
  background-color: $bg-secondary-color;
  border: $border;
  border-radius: 20px;
  box-sizing: border-box;

  &:hover {
    .project-image {
      opacity: 0.5;
    }

    .contribute-btn {
      background-color: $highlight-color;
      color: $bg-secondary-color;
    }
  }
}

.project-image {
  display: block;

  img {
    border: none;
    border-radius: 20px 20px 0 0;
    display: block;
    height: 150px;
    object-fit: cover;
    text-align: center;
    width: 100%;
  }
}

.project-info {
  display: flex;
  line-height: 150%;
  flex-direction: column;
  padding: 0 $content-space $content-space;
}

.project-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 18px;
  font-weight: 500;
  height: 45px;
  margin: 15px 0;
  max-height: 45px;
  overflow: hidden;
}

.project-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
  height: 60px;
  max-height: 60px;
  overflow: hidden;
}

.contribute-btn,
.in-cart {
  margin-top: 20px;
}
</style>

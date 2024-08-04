<template>
  <div class="card" :class="$props">
    <div class="card-topline"></div>
    <div class="card-header" v-if="$props.price && !$props.image">
      <h3 class="card-title"><slot name="title"></slot></h3>
      <h1 class="card-subtitle"><slot name="subtitle"></slot></h1>
    </div>
    <div class="card-header" v-else>
      <slot name="header"></slot>
    </div>

    <div class="card-body" v-if="$props.price">
      <ul class="card-features">
        <slot name="features"></slot>
      </ul>
    </div>
    <div class="card-body" v-else>
      <slot name="body"></slot>
    </div>

    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  price: Boolean,
  topline: Boolean,
  image: Boolean,
});
</script>

<style scoped lang="scss">
.card {
  position: relative;

  padding: 40px;

  background-color: var(--background-color-1);

  border-radius: 7px;

  display: grid;
  justify-content: center;

  grid-template-rows: auto 1fr auto;

  grid-template-columns: 100%;

  overflow: hidden;
}

.card-topline {
  transform: scaleX(0);
  transform-origin: left;

  background: var(--primary-color);

  position: absolute;

  left: 0;
  right: 0;
  top: 0;
  height: 2px;

  border-radius: 2px;

  box-shadow: 0 0 7px 3px rgba(var(--primary-color), 0.5);

  transition: 0.15s;
}

.card.topline:not(.image) > .card-topline {
  transform: scaleX(1);
}

.card-title {
  text-align: center;

  font-size: 1.5rem;
}

.card-subtitle {
  text-align: center;

  margin-top: 15px;
  font-size: 3rem;
}

.card-header {
  .card.image > & {
    margin: -40px;
    margin-bottom: 0;

    &:deep(img) {
      max-width: 400px;
    }
  }
}

.card-body {
  display: grid;
  justify-content: center;
  align-items: end;

  padding-top: 40px;
  padding-bottom: 50px;
}

.card-features {
  list-style: none;
}

.card-features:deep(li) {
  margin-top: 10px;
}

.card-features:deep(li::before) {
  content: '\2022';
  color: var(--primary-color);
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.card-footer {
  display: grid;
  justify-content: center;
  align-items: center;
}
</style>
